from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import json

driver = webdriver.Chrome()
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
    
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".mb-3.card"))
    )

    jobs_info = []
    company_jobs_count = {}
    try:
        while len(jobs_info) < 1000:
            WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".mb-3.card"))
            )

            job_listings = driver.find_elements(By.CSS_SELECTOR, ".mb-3.card")

            for job in job_listings:
                if len(jobs_info) >= 1000:
                    break

                try:
                    job_title = job.find_element(By.CSS_SELECTOR, "div.fw-bold.mb-1 a").text
                except NoSuchElementException:
                    job_title = "N/A"

                try:
                    company_name = job.find_element(By.CSS_SELECTOR, "div.mb-2.align-items-baseline a").text
                except NoSuchElementException:
                    company_name = "N/A"

                if company_name not in company_jobs_count:
                    company_jobs_count[company_name] = 1
                else:
                    company_jobs_count[company_name] += 1

                try:
                    location = job.find_element(By.CSS_SELECTOR, "div.overflow-hidden.text-secondary.mb-2").text
                except NoSuchElementException:
                    location = "N/A"

                try:
                    time_posted = job.find_element(By.CSS_SELECTOR, "div.overflow-hidden.text-secondary.small.mb-2").text
                except NoSuchElementException:
                    time_posted = "N/A"

                try:
                    salary_range = job.find_element(By.CSS_SELECTOR, "div.overflow-hidden.small.mb-2").text
                except NoSuchElementException:
                    salary_range = "N/A"

                try:
                    job_link = job.find_element(By.CSS_SELECTOR, "div.fw-bold.mb-1 a").get_attribute('href')
                except NoSuchElementException:
                    job_link = "N/A"

                jobs_info.append([job_title, company_name, location, time_posted, salary_range, job_link])

            try:
                show_more_button = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Show more')]"))
                )
                driver.execute_script("arguments[0].click();", show_more_button)
            except (NoSuchElementException, TimeoutException):
                print("No more 'Show more' button to click or reached 1000 jobs.")
                break
    except Exception as e:
        print("An error occurred while collecting job listings:", e)

    jobs_data = [{"companyName": company_name, "jobPostings": job_postings} for company_name, job_postings in sorted(company_jobs_count.items(), key=lambda item: item[1], reverse=True)[:10]]
    with open('public/hiring_data.json', 'w') as json_file:
        json.dump(jobs_data, json_file)

except Exception as e:
    print("An error occurred during login or navigation:", e)
