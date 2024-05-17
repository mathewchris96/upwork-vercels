import schedule
import time
from trueup_scrapper import run_scrapper  # Assuming trueup_scrapper.py has a main function named run_scrapper
from Opportunities import determine_top_companies, update_company_rankings_html

def job():
    print("Starting the scrapping job...")
    run_scrapper()  # This triggers the scrapping process from trueup_scrapper.py
    print("Scrapping job completed. Processing data...")
    determine_top_companies()  # Process the data to determine top companies
    print("Data processed. Updating company rankings...")
    update_company_rankings_html()  # Update the company rankings on the HTML page
    print("Company rankings updated successfully.")

# Schedule the job every day
schedule.every().day.at("00:00").do(job)

if __name__ == "__main__":
    while True:
        schedule.run_pending()
        time.sleep(1)  # Wait for one second before checking again