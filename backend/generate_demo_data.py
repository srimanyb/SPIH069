import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_data(num_records=1000):
    departments = ["Municipal", "Revenue", "Transport", "Education", "Health", "Licensing"]
    services_map = {
        "Municipal": ["Building Permit", "Zoning Clearance", "Inspection Request"],
        "Revenue": ["Tax Certificate", "Business Registration", "Audit Request"],
        "Transport": ["Vehicle License", "Driver Permit", "Road Repair Request"],
        "Education": ["School Enrollment", "Grant Application", "Certification"],
        "Health": ["Health Inspection", "Facility License", "Sanitation Request"],
        "Licensing": ["Liquor License", "Event Permit", "Vendor License"]
    }
    
    stages = ["Submitted", "Verification", "Review", "Approval", "Completion"]
    workloads = ["LOW", "NORMAL", "HIGH", "CRITICAL"]
    
    now = datetime.now()
    
    data = []
    
    for i in range(num_records):
        req_id = f"SR-{1000 + i}"
        dept = random.choice(departments)
        service = random.choice(services_map[dept])
        
        # Decide if this request is risky (20% chance)
        is_risky = random.random() < 0.2
        
        if is_risky:
            # Short deadline, stuck in a late stage, high workload
            hours_until_deadline = random.randint(-5, 24)
            current_stage = random.choice(["Review", "Approval"])
            stage_duration_hours = random.randint(48, 120)
            workload = random.choice(["HIGH", "CRITICAL"])
            historical_delay = random.randint(25, 45)
        else:
            # Plenty of time, normal workload
            hours_until_deadline = random.randint(48, 300)
            current_stage = random.choice(stages[:3])
            stage_duration_hours = random.randint(1, 24)
            workload = random.choice(["LOW", "NORMAL"])
            historical_delay = random.randint(5, 15)
            
        sla_deadline = now + timedelta(hours=hours_until_deadline)
        request_time = sla_deadline - timedelta(days=random.randint(10, 30))
        
        data.append({
            "request_id": req_id,
            "department": dept,
            "service_type": service,
            "current_stage": current_stage,
            "request_time": request_time.isoformat(),
            "sla_deadline": sla_deadline.isoformat(),
            "current_stage_duration_hours": stage_duration_hours,
            "department_workload": workload,
            "historical_delay_rate": historical_delay
        })
        
    df = pd.DataFrame(data)
    df.to_csv("demo_data.csv", index=False)
    print(f"Generated {num_records} records to demo_data.csv")

if __name__ == "__main__":
    generate_data(1248)
