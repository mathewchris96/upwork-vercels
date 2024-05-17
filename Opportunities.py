import datetime
import json

def store_opportunities(jobs_info):
    """
    Store the job opportunities information.
    """
    # Initialize a list to store data
    opportunities = []
    
    # Process each job information and store it in the list
    for job in jobs_info:
        job_entry = {
            "company": job["company"],
            "title": job["title"],
            "hires": job["hires"],
            "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        opportunities.append(job_entry)
    
    # Save the processed data
    save_opportunities(opportunities)

def rank_opportunities(opportunities):
    """
    Sort the opportunities based on the number of hires and select the top 10.
    """
    ranked_opportunities = sorted(opportunities, key=lambda x: x['hires'], reverse=True)[:10]
    return ranked_opportunities

def save_opportunities(opportunities):
    """
    Save the ranked opportunities into a JSON file.
    """
    with open("ranked_opportunities.json", "w") as file:
        json.dump(opportunities, file, indent=4)

# Sample data for testing
jobs_info = [
    {"company": "Company A", "title": "Software Engineer", "hires": 5},
    {"company": "Company B", "title": "Data Scientist", "hires": 8},
    {"company": "Company C", "title": "Product Manager", "hires": 2},
    # Add more job info as needed for testing
]

# Store the opportunities
store_opportunities(jobs_info)

# Load the stored opportunities for ranking
with open("ranked_opportunities.json", "r") as file:
    stored_opportunities = json.load(file)

# Rank the opportunities
top_opportunities = rank_opportunities(stored_opportunities)

# Print the top 10 opportunities for verification
print(top_opportunities)