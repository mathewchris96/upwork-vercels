import json
import pandas as pd

def determine_top_companies():
    # Reading data from "scraped_data.json"
    with open('scraped_data.json', 'r') as file:
        data = json.load(file)
    
    # Convert JSON data into a DataFrame
    df = pd.DataFrame(data)
    
    # Process data to determine top 10 companies based on number of hires
    top_companies = df.groupby('company').size().reset_index(name='hires').sort_values(by='hires', ascending=False).head(10)
    
    # Convert the top companies data to a dictionary for easier manipulation
    top_companies_dict = top_companies.to_dict(orient='records')
    
    return top_companies_dict

def update_company_rankings_html(ranking):
    # Start HTML content
    html_content = "<html><head><title>Top 10 Companies by Number of Hires</title></head><body>"
    html_content += "<h1>Top 10 Companies by Number of Hires</h1>"
    html_content += "<ul>"
    
    # Loop through each company in the ranking and add it to the HTML content
    for company in ranking:
        html_content += f"<li>{company['company']} - {company['hires']} hires</li>"
    
    html_content += "</ul></body></html>"
    
    # Update "company-rankings.html" with the top 10 companies
    with open('company-rankings.html', 'w') as file:
        file.write(html_content)

# Example usage
if __name__ == "__main__":
    top_companies = determine_top_companies()
    update_company_rankings_html(top_companies)