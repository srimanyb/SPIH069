from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import os

from engine import analyze_requests

app = FastAPI(title="DelayGuard API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for the hackathon MVP
db = {
    "requests": [],
    "summary": {
        "total": 0,
        "at_risk": 0,
        "high_risk": 0,
        "breached_today": 0
    }
}

def update_summary(analyzed_data):
    db["requests"] = analyzed_data
    db["summary"]["total"] = len(analyzed_data)
    db["summary"]["at_risk"] = sum(1 for r in analyzed_data if r["risk_level"] in ["HIGH", "MEDIUM"])
    db["summary"]["high_risk"] = sum(1 for r in analyzed_data if r["risk_level"] == "HIGH")
    
    breached = 0
    for r in analyzed_data:
        # Check if breached (time remaining is 'Overdue' or similar)
        if "passed" in "".join(r["reasons"]) or "Overdue" in str(r.get("time_remaining", "")):
            breached += 1
    db["summary"]["breached_today"] = breached

@app.get("/api/demo")
async def load_demo_data():
    if not os.path.exists("demo_data.csv"):
        # run the script to generate it if it doesn't exist
        import generate_demo_data
        generate_demo_data.generate_data(1248)
        
    try:
        df = pd.read_csv("demo_data.csv")
        analyzed = analyze_requests(df)
        update_summary(analyzed)
        return {"message": "Demo data loaded successfully", "count": len(analyzed)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
        analyzed = analyze_requests(df)
        update_summary(analyzed)
        return {"message": "File uploaded successfully", "count": len(analyzed)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="We couldn't read this file. Please check that it is a valid CSV.")

@app.get("/api/dashboard")
async def get_dashboard():
    # Sort requests by risk priority (high, medium, low)
    sorted_requests = sorted(db["requests"], key=lambda x: x["priority"])
    return {
        "summary": db["summary"],
        "urgent_requests": sorted_requests[:5]
    }

@app.get("/api/requests")
async def get_requests(search: str = None, risk: str = None):
    results = db["requests"]
    
    if search:
        search = search.lower()
        results = [r for r in results if search in r["request_id"].lower() or search in r["service_type"].lower()]
        
    if risk and risk != "ALL":
        results = [r for r in results if r["risk_level"] == risk]
        
    # Default sort by priority
    results = sorted(results, key=lambda x: x["priority"])
    
    return {"requests": results}

@app.get("/api/requests/{request_id}")
async def get_request_detail(request_id: str):
    for r in db["requests"]:
        if r["request_id"] == request_id:
            return r
    raise HTTPException(status_code=404, detail="Request not found")

@app.get("/api/reports")
async def get_reports():
    df = pd.DataFrame(db["requests"])
    if df.empty:
        return {"bottlenecks": [], "departments": []}
    
    # Calculate delay rate per stage
    stage_counts = df.groupby("current_stage").size()
    stage_high_risk = df[df["risk_level"] == "HIGH"].groupby("current_stage").size()
    
    bottlenecks = []
    for stage, count in stage_counts.items():
        high_risk_count = stage_high_risk.get(stage, 0)
        delay_rate = (high_risk_count / count * 100) if count > 0 else 0
        bottlenecks.append({
            "name": stage,
            "delay_rate": int(delay_rate)
        })
        
    # Calculate delay rate per department
    dept_counts = df.groupby("department").size()
    dept_high_risk = df[df["risk_level"] == "HIGH"].groupby("department").size()
    
    departments = []
    for dept, count in dept_counts.items():
        high_risk_count = dept_high_risk.get(dept, 0)
        delay_rate = (high_risk_count / count * 100) if count > 0 else 0
        departments.append({
            "name": dept,
            "delay_rate": int(delay_rate)
        })
        
    bottlenecks.sort(key=lambda x: x["delay_rate"], reverse=True)
    departments.sort(key=lambda x: x["delay_rate"], reverse=True)
        
    return {
        "bottlenecks": bottlenecks,
        "departments": departments
    }
