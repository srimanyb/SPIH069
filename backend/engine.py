import pandas as pd
from datetime import datetime, timedelta

def calculate_risk(row: pd.Series, current_time: datetime) -> dict:
    """
    Rule-based engine for the hackathon MVP to simulate a predictive ML model.
    It returns a risk score, risk level, reasons, and a recommended action.
    """
    score = 10
    reasons = []
    
    # Calculate time remaining
    try:
        if isinstance(row["sla_deadline"], str):
            deadline = datetime.fromisoformat(row["sla_deadline"].replace("Z", "+00:00"))
        else:
            deadline = pd.to_datetime(row["sla_deadline"])
            
        time_remaining = deadline - current_time
        hours_remaining = time_remaining.total_seconds() / 3600.0
    except Exception:
        hours_remaining = 24 # default if parsing fails
    
    # Rules
    if hours_remaining <= 0:
        score += 90
        reasons.append("Deadline has already passed.")
    elif hours_remaining < 12:
        score += 60
        reasons.append(f"Only {int(hours_remaining)} hours remain until the deadline.")
    elif hours_remaining < 24:
        score += 30
        reasons.append("Deadline is approaching (less than 24 hours).")
        
    # Department history rule (simulated based on historical delay rate)
    delay_rate = row.get("historical_delay_rate", 0)
    if delay_rate > 30:
        score += 20
        reasons.append(f"{row['department']} department has a history of delays ({delay_rate}% delay rate).")
    elif delay_rate > 20:
        score += 10
        
    # Stage duration rule
    stage_duration = row.get("current_stage_duration_hours", 0)
    if stage_duration > 48:
        score += 15
        reasons.append(f"The request has been in the '{row['current_stage']}' stage longer than normal.")
    
    # Workload rule
    workload = row.get("department_workload", "NORMAL")
    if workload == "HIGH":
        score += 15
        reasons.append(f"Current {row['department']} department workload is high.")
        
    # Normalize score
    score = min(max(int(score), 5), 99)
    
    if score >= 75:
        level = "HIGH"
        if "Deadline has already passed." in reasons:
            action = f"Escalate immediately to {row['department']} supervisor"
        elif hours_remaining < 12:
            action = f"Escalate to {row['department']} Team"
        else:
            action = "Reassign to available agent"
    elif score >= 40:
        level = "MEDIUM"
        action = "Prioritize this request"
    else:
        level = "LOW"
        action = "Monitor normally"
        if not reasons:
            reasons.append("Request is progressing normally.")
            
    # Format time remaining nicely
    if hours_remaining < 0:
        time_str = "Overdue"
    elif hours_remaining < 1:
        time_str = "Less than 1 hour"
    else:
        time_str = f"{int(hours_remaining)} hours"

    return {
        "request_id": row["request_id"],
        "risk_score": score,
        "risk_level": level,
        "time_remaining": time_str,
        "reasons": reasons[:3], # Keep it to top 3 reasons for simplicity
        "recommended_action": action,
        "priority": 1 if level == "HIGH" else (2 if level == "MEDIUM" else 3)
    }

def analyze_requests(df: pd.DataFrame) -> list:
    # We simulate "current time" as the max timestamp of 'request_time' + a few days, 
    # but for a dynamic demo, let's just pretend "now" is the time the script runs, 
    # though for synthetic data, we'll anchor it around the current time.
    current_time = datetime.now()
    
    results = []
    for _, row in df.iterrows():
        # Ensure sla_deadline is somewhat coherent. If the dataset has old dates, we adjust.
        # But our demo_data generator will generate future/recent dates.
        res = calculate_risk(row, current_time)
        
        # Combine the original row data with the analysis
        item = row.to_dict()
        item.update(res)
        results.append(item)
        
    return results
