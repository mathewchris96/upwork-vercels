from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import json
import os

# Launching the browser
driver = webdriver.Chrome()  # You can replace 'Chrome' with your preferred browser

# Opening the website
driver.get("https://www.trueup.io/")

# Check for the existence of the 'company_rankings.txt' file
if not os.path.exists('company_rankings.txt'):
    print("Error: 'company_rankings.txt' file not found.")
    driver.quit()
    exit()

# Read the 'company_rankings.txt' file
with open('company_rankings.txt', 'r') as file:
    company_rankings = [line.strip() for line in file.readlines()]

try:
    # Waiting for the "Log in" button to be clickable
    login_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//span/button[contains(text(), 'Log in')]"))
    )
    
    # Clicking on the "Log in" button
    login_button.click()
    print("Clicked on the Log in button.")
    
    # Entering email
    email_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "username"))
    )
    email_input.send_keys("example@email.com")
    print("Entered email.")
    
    # Entering password
    password_input = driver.find_element(By.ID, "password")
    password_input.send_keys("password123")
    print("Entered password.")
    
    # Clicking on the "Continue" button
    continue_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[@value='default']"))
    )
    continue_button.click()
    print("Clicked on the Continue button.")
    
    # Clicking on the "All jobs" button
    all_jobs_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//a[@href='/jobs']"))
    )
    all_jobs_button.click()
    print("Clicked on the All jobs button.")
    
    # Wait for the job listings to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".mb-3.card"))
    )

    # Initialize an empty list to store job information in a dictionary format
    jobs_info = []

    try:
        while True:
            # Wait for the job listings to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".mb-3.card"))
            )

            # Find all job listing divs
            job_listings = driver.find_elements(By.CSS_SELECTOR, ".mb-3.card")

            # Loop through each job listing to extract information and store it in a dictionary
            for job in job_listings:
                job_info = {}  # Initialize an empty dictionary for this job's information
                try:
                    job_info['job_title'] = job.find_element(By.CSS_SELECTOR, "div.fw-bold.mb-1 a").text
                except NoSuchElementException:
                    job_info['job_title'] = "N/A"

                try:
                    job_info['company_name'] = job.find_element(By.CSS_SELECTOR, "div.mb-2.align-items-baseline a").text
                except NoSuchElementException:
                    job_info['company_name'] = "N/A"

                if job_info['company_name'] not in company_rankings:
                    continue  # Skip this job if the company is not in the rankings list

                try:
                    job_info['location'] = job.find_element(By.CSS_SELECTOR, "div.overflow-hidden.text-secondary.mb-2").text
                except NoSuchElementException:
                    job_info['location'] = "N/A"

                try:
                    job_info['time_posted'] = job.find_element(By.CSS_SELECTOR, "div.overflow-hidden.text-secondary.small.mb-2").text
                except NoSuchElementException:
                    job_info['time_posted'] = "N/A"

                try:
                    job_info['salary_range'] = job.find_element(By.CSS_SELECTOR, "div.overflow-hidden.small.mb-2").text
                except NoSuchElementException:
                    job_info['salary_range'] = "N/A"

                try:
                    job_info['job_link'] = job.find_element(By.CSS_SELECTOR, "div.fw-bold.mb-1 a").get_attribute('href')
                except NoSuchElementException:
                    job_info['job_link'] = "N/A"

                jobs_info.append(job_info)  # Add the job's information dictionary to the list

            # Click the "Show more" button if it exists and is visible
            try:
                show_more_button = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Show more')]"))
                )
                driver.execute_script("arguments[0].click();", show_more_button)
            except (NoSuchElementException, TimeoutException):
                print("No more 'Show more' button to click or reached end of listings.")
                break  # Break the loop if no more "Show more" button is found
    except Exception as e:
        print("An error occurred while collecting job listings:", e)

    # Filter the scraped data based on the company names from the company_rankings list
    filtered_data = [data for data in jobs_info if data['company_name'] in company_rankings]

    # Implement sorting mechanism based on salary_range as a relevant metric
    # Assuming salary_range can be parsed into a meaningful format for sorting. Below is a basic placeholder for sorting logic.
    # This basic logic assumes salary_range is a string that can be split into min and max values (e.g., "$100k - $150k").
    # Parsing these into integers and using the average for sorting. Real implementation may vary based on actual data format.
    filtered_data.sort(key=lambda x: sum(int(num.replace('k', '').replace('$', '')) for num in x['salary_range'].split(' - ')) / len(x['salary_range'].split(' - ')), reverse=True)

    # Save the filtered and sorted data to a JSON file
    with open('filtered_data.json', 'w') as json_file:
        json.dump(filtered_data, json_file, indent=4)

    # Print the entire output
    for job in filtered_data:
        print(job)

except Exception as e:
    print("An error occurred during login or navigation:", e)

# Closing the browser