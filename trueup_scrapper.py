from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException

# Launching the browser
driver = webdriver.Chrome()  # You can replace 'Chrome' with your preferred browser

# Opening the website
driver.get("https://www.trueup.io/")

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
    email_input.send_keys("mathewchris96@gmail.com")
    print("Entered email.")
    
    # Entering password
    password_input = driver.find_element(By.ID, "password")
    password_input.send_keys("Nighthack123")
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

    # Initialize an empty list to store job information in a structured format
    jobs_info = []

    try:
        while len(jobs_info) < 1000:
            # Wait for the job listings to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".mb-3.card"))
            )

            # Find all job listing divs
            job_listings = driver.find_elements(By.CSS_SELECTOR, ".mb-3.card")

            # Loop through each job listing to extract information
            for job in job_listings:
                if len(jobs_info) >= 1000:
                    break  # Break the loop if we have collected 1000 job entries

                job_data = {}  # Dictionary to store job data

                # Extracting job information and storing in the dictionary
                job_data['job_title'] = job.find_element(By.CSS_SELECTOR, "div.fw-bold.mb-1 a").text or "N/A"
                job_data['company_name'] = job.find_element(By.CSS_SELECTOR, "div.mb-2.align-items-baseline a").text or "N/A"
                job_data['location'] = job.find_element(By.CSS_SELECTOR, "div.overflow-hidden.text-secondary.mb-2").text or "N/A"
                job_data['time_posted'] = job.find_element(By.CSS_SELECTOR, "div.overflow-hidden.text-secondary.small.mb-2").text or "N/A"
                job_data['salary_range'] = job.find_element(By.CSS_SELECTOR, "div.overflow-hidden.small.mb-2").text or "N/A"
                job_data['job_link'] = job.find_element(By.CSS_SELECTOR, "div.fw-bold.mb-1 a").get_attribute('href') or "N/A"

                jobs_info.append(job_data)  # Append the job data dictionary to the list

            # Click the "Show more" button if it exists and is visible
            try:
                show_more_button = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Show more')]"))
                )
                driver.execute_script("arguments[0].click();", show_more_button)
            except (NoSuchElementException, TimeoutException):
                print("No more 'Show more' button to click or reached 1000 jobs.")
                break  # Break the loop if no more "Show more" button is found or if we've reached 1000 jobs
    except Exception as e:
        print("An error occurred while collecting job listings:", e)

    # Print the entire output
    for job in jobs_info:
        print(job)

except Exception as e:
    print("An error occurred during login or navigation:", e)

def get_job_data():
    return jobs_info

# Closing the browser
driver.quit()