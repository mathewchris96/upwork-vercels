from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import json  # Importing json for data export

# Function to initialize the WebDriver
def init_driver():
    driver = webdriver.Chrome()  # You can replace 'Chrome' with your preferred browser
    return driver

# Function to log in to the website
def login_to_site(driver):
    driver.get("https://www.trueup.io/")
    try:
        login_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//span/button[contains(text(), 'Log in')]"))
        )
        login_button.click()
        print("Clicked on the Log in button.")
        
        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "username"))
        )
        email_input.send_keys("mathewchris96@gmail.com")
        print("Entered email.")
        
        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys("Nighthack123")
        print("Entered password.")
        
        continue_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@value='default']"))
        )
        continue_button.click()
        print("Clicked on the Continue button.")
        
        all_jobs_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//a[@href='/jobs']"))
        )
        all_jobs_button.click()
        print("Clicked on the All jobs button.")
    except Exception as e:
        print("An error occurred during login or navigation:", e)

# Function to scrape job listings and aggregate by company
def scrape_jobs(driver):
    jobs_info = {}
    try:
        while True:
            WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".mb-3.card"))
            )
            job_listings = driver.find_elements(By.CSS_SELECTOR, ".mb-3.card")
            for job in job_listings:
                company_name = job.find_element(By.CSS_SELECTOR, "div.mb-2.align-items-baseline a").text or "N/A"
                if company_name in jobs_info:
                    jobs_info[company_name] += 1
                else:
                    jobs_info[company_name] = 1

            try:
                show_more_button = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Show more')]"))
                )
                driver.execute_script("arguments[0].click();", show_more_button)
            except (NoSuchElementException, TimeoutException):
                print("No more 'Show more' button to click or enough data collected.")
                break
    except Exception as e:
        print("An error occurred while collecting job listings:", e)
    return jobs_info

# Modified function to export data directly for further processing
def export_data(jobs_aggregate):
    with open('aggregated_jobs_data.json', 'w') as file:
        json.dump(jobs_aggregate, file)
    print("Data exported successfully.")
    # Return the aggregated data for potential further processing within the application
    return jobs_aggregate

# Main function to control the flow
def main():
    driver = init_driver()
    login_to_site(driver)
    aggregated_jobs_data = scrape_jobs(driver)
    export_data(aggregated_jobs_data)
    driver.quit()

if __name__ == "__main__":
    main()