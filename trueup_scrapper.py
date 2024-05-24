from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import json
from datetime import datetime, timedelta

driver = webdriver.Chrome()
driver.get("https://www.trueup.io/layoffs")  # Assuming this is the URL for layoff data

# Function to check if a date is within the last 6 months
def is_within_last_6_months(date_str):
    layoff_date = datetime.strptime(date_str, "%Y-%m-%d")  # Assuming date format is YYYY-MM-DD
    six_months_ago = datetime.now() - timedelta(days=182.5)
    return layoff_date > six_months_ago

layoffs_info = []

try:
    WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".layoff-entry"))  # Assuming CSS selector for layoff entries
    )
    layoff_entries = driver.find_elements(By.CSS_SELECTOR, ".layoff-entry")

    for entry in layoff_entries:
        try:
            company_name = entry.find_element(By.CSS_SELECTOR, ".company-name").text  # Assuming CSS selector
            layoff_date = entry.find_element(By.CSS_SELECTOR, ".layoff-date").text  # Assuming CSS selector
            layoff_count = entry.find_element(By.CSS_SELECTOR, ".layoff-count").text  # Assuming CSS selector

            # Filter to include only layoffs from the last 6 months
            if is_within_last_6_months(layoff_date):
                layoffs_info.append({"companyName": company_name, "layoffDate": layoff_date, "layoffCount": layoff_count})

        except NoSuchElementException:
            continue

    with open('SOURCE_DOCUMENTS-798697458/upwork-vercels/public/layoff.json', 'w') as json_file:
        json.dump(layoffs_info, json_file)
    print("Layoff data has been successfully written to 'SOURCE_DOCUMENTS-798697458/upwork-vercels/public/layoff.json'")

except Exception as e:
    print("An error occurred while collecting or processing layoff data:", e)