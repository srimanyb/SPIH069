from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import os
from datetime import datetime

# ── Inline engine logic (no local imports in serverless) ──────────────────────
def calculate_risk(row: pd.Series, current_time: datetime) -> dict:
    score = 10
    reasons = []

    try:
        if isinstance(row["sla_deadline"], str):
            deadline = datetime.fromisoformat(row["sla_deadline"].replace("Z", "+00:00"))
        else:
            deadline = pd.to_datetime(row["sla_deadline"])
        time_remaining = deadline - current_time
        hours_remaining = time_remaining.total_seconds() / 3600.0
    except Exception:
        hours_remaining = 24

    if hours_remaining <= 0:
        score += 90
        reasons.append("Deadline has already passed.")
    elif hours_remaining < 12:
        score += 60
        reasons.append(f"Only {int(hours_remaining)} hours remain until the deadline.")
    elif hours_remaining < 24:
        score += 30
        reasons.append("Deadline is approaching (less than 24 hours).")

    delay_rate = row.get("historical_delay_rate", 0)
    if delay_rate > 30:
        score += 20
        reasons.append(f"{row['department']} department has a history of delays ({delay_rate}% delay rate).")
    elif delay_rate > 20:
        score += 10

    stage_duration = row.get("current_stage_duration_hours", 0)
    if stage_duration > 48:
        score += 15
        reasons.append(f"Request stuck in '{row['current_stage']}' stage longer than normal.")

    workload = row.get("department_workload", "NORMAL")
    if workload == "HIGH":
        score += 15
        reasons.append(f"Current {row['department']} department workload is high.")

    score = min(max(int(score), 5), 99)

    if score >= 75:
        level = "HIGH"
        action = f"Escalate to {row['department']} supervisor" if hours_remaining <= 0 else f"Escalate to {row['department']} Team"
    elif score >= 40:
        level = "MEDIUM"
        action = "Prioritize this request"
    else:
        level = "LOW"
        action = "Monitor normally"
        if not reasons:
            reasons.append("Request is progressing normally.")

    if hours_remaining < 0:
        time_str = "Overdue"
    elif hours_remaining < 1:
        time_str = "Less than 1 hour"
    else:
        time_str = f"{int(hours_remaining)} hours"

    return {
        "request_id": str(row["request_id"]),
        "service_type": str(row.get("service_type", "N/A")),
        "department": str(row.get("department", "N/A")),
        "current_stage": str(row.get("current_stage", "N/A")),
        "risk_score": score,
        "risk_level": level,
        "time_remaining": time_str,
        "reasons": reasons[:3],
        "recommended_action": action,
        "priority": 1 if level == "HIGH" else (2 if level == "MEDIUM" else 3),
    }


def analyze_requests(df: pd.DataFrame) -> list:
    current_time = datetime.now()
    results = []
    for _, row in df.iterrows():
        res = calculate_risk(row, current_time)
        item = row.to_dict()
        item.update(res)
        results.append(item)
    return results


def generate_demo_rows(n: int = 200) -> pd.DataFrame:
    import random
    from datetime import timedelta

    random.seed(42)
    departments = ["Urban Planning", "Commerce", "Public Health", "Finance", "Transport", "Education"]
    service_types = ["Building Permit", "Business License", "Health Inspection", "Tax Clearance", "Trade License", "Road Permit"]
    stages = ["Document Verification", "Review Phase", "Approval Pending", "Assigned", "Field Inspection"]
    workloads = ["LOW", "NORMAL", "HIGH"]

    rows = []
    now = datetime.now()
    for i in range(n):
        dept = random.choice(departments)
        offset_hours = random.uniform(-6, 72)
        deadline = now + timedelta(hours=offset_hours)
        rows.append({
            "request_id": f"REQ-{9000 + i}",
            "service_type": random.choice(service_types),
            "department": dept,
            "current_stage": random.choice(stages),
            "sla_deadline": deadline.isoformat(),
            "historical_delay_rate": random.randint(5, 45),
            "current_stage_duration_hours": random.randint(1, 96),
            "department_workload": random.choice(workloads),
        })
    return pd.DataFrame(rows)


# ── FastAPI App ───────────────────────────────────────────────────────────────
app = FastAPI(title="DelayGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store (resets on cold start — fine for hackathon demo)
db = {
    "requests": [],
    "summary": {"total": 0, "at_risk": 0, "high_risk": 0, "breached_today": 0},
}


def update_summary(analyzed_data):
    db["requests"] = analyzed_data
    db["summary"]["total"] = len(analyzed_data)
    db["summary"]["at_risk"] = sum(1 for r in analyzed_data if r["risk_level"] in ["HIGH", "MEDIUM"])
    db["summary"]["high_risk"] = sum(1 for r in analyzed_data if r["risk_level"] == "HIGH")
    db["summary"]["breached_today"] = sum(1 for r in analyzed_data if "passed" in " ".join(r["reasons"]) or r["time_remaining"] == "Overdue")


@app.get("/api/demo")
async def load_demo_data():
    df = generate_demo_rows(200)
    analyzed = analyze_requests(df)
    update_summary(analyzed)
    return {"message": "Demo data loaded", "count": len(analyzed)}


@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
        analyzed = analyze_requests(df)
        update_summary(analyzed)
        return {"message": "File uploaded successfully", "count": len(analyzed)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not read this file. Please check it is a valid CSV.")


@app.get("/api/dashboard")
async def get_dashboard():
    # Auto-load demo data if empty (so Vercel demo always works)
    if not db["requests"]:
        df = generate_demo_rows(200)
        update_summary(analyze_requests(df))

    sorted_requests = sorted(db["requests"], key=lambda x: x["priority"])
    return {"summary": db["summary"], "urgent_requests": sorted_requests[:5]}


@app.get("/api/requests")
async def get_requests(search: str = None, risk: str = None):
    if not db["requests"]:
        df = generate_demo_rows(200)
        update_summary(analyze_requests(df))

    results = db["requests"]
    if search:
        s = search.lower()
        results = [r for r in results if s in r["request_id"].lower() or s in r["service_type"].lower()]
    if risk and risk != "ALL":
        results = [r for r in results if r["risk_level"] == risk]
    results = sorted(results, key=lambda x: x["priority"])
    return {"requests": results}


@app.get("/api/requests/{request_id}")
async def get_request_detail(request_id: str):
    if not db["requests"]:
        df = generate_demo_rows(200)
        update_summary(analyze_requests(df))

    for r in db["requests"]:
        if r["request_id"] == request_id:
            return r
    raise HTTPException(status_code=404, detail="Request not found")


@app.get("/api/reports")
async def get_reports():
    if not db["requests"]:
        df = generate_demo_rows(200)
        update_summary(analyze_requests(df))

    df = pd.DataFrame(db["requests"])
    if df.empty:
        return {"bottlenecks": [], "departments": []}

    stage_counts = df.groupby("current_stage").size()
    stage_high_risk = df[df["risk_level"] == "HIGH"].groupby("current_stage").size()
    bottlenecks = [
        {"name": stage, "delay_rate": int(stage_high_risk.get(stage, 0) / count * 100)}
        for stage, count in stage_counts.items()
    ]

    dept_counts = df.groupby("department").size()
    dept_high_risk = df[df["risk_level"] == "HIGH"].groupby("department").size()
    departments = [
        {"name": dept, "delay_rate": int(dept_high_risk.get(dept, 0) / count * 100)}
        for dept, count in dept_counts.items()
    ]

    bottlenecks.sort(key=lambda x: x["delay_rate"], reverse=True)
    departments.sort(key=lambda x: x["delay_rate"], reverse=True)
    return {"bottlenecks": bottlenecks, "departments": departments}
