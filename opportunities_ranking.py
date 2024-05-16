# opportunities_ranking.py

# Import necessary functions from trueup_scrapper.py
from trueup_scrapper import get_scraped_data

# Implement a function to get the top hiring companies
def get_top_hiring_companies():
    # Get the scraped data
    scraped_data = get_scraped_data()

    # Sort companies based on the number of job openings
    sorted_companies = sorted(scraped_data, key=lambda x: x['job_openings'], reverse=True)

    # Prepare the data to return only company name and job openings
    prepared_data = [{'company_name': company['company_name'], 'job_openings': company['job_openings']} for company in sorted_companies[:10]]

    # Return the modified top 10 companies as a list of dictionaries
    return prepared_data

# Test the function
if __name__ == "__main__":
    top_hiring_companies = get_top_hiring_companies()
    print(top_hiring_companies)