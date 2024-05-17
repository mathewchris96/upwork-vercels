# opportunities.py

from trueup_scrapper import job_data

def calculate_top_companies(job_data):
    company_count = {}
    for job in job_data:
        company = job['company']
        if company in company_count:
            company_count[company] += 1
        else:
            company_count[company] = 1
    
    sorted_companies = sorted(company_count.items(), key=lambda x: x[1], reverse=True)
    
    top_10_companies = [{'company': company, 'job_listings': count} for company, count in sorted_companies[:10]]
    
    return top_10_companies

if __name__ == "__main__":
    top_companies = calculate_top_companies(job_data)
    print(top_companies)