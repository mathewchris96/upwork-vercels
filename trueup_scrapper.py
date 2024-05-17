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
        EC.element_to_be_clickable((By.XPATH, "//*[@id='main-nav']/nav/div[2]/button[1]"))
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
        EC.presence_of_element_located((By.CSS_SELECTOR, ".mb-4.rounded-lg.border.border-gray-300.flex.flex-col"))
    )

    jobs_info = []
    try:
        while len(jobs_info) < 1000:
            WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".flex.overflow-hidden"))
            )

            job_listings = driver.find_elements(By.CSS_SELECTOR, ".flex.overflow-hidden")

            for job in job_listings:
                if len(jobs_info) >= 1000:
                    break

                try:
                    job_title = job.find_element(By.CSS_SELECTOR, "button.text-start.text-foreground.font-bold.m-0.p-0.border-0.text-lg.inline-block").text
                except NoSuchElementException:
                    job_title = "N/A"

                try:
                    company_name = job.find_element(By.CSS_SELECTOR, "a.text-foreground.font-medium.text-base").text
                except NoSuchElementException:
                    company_name = "N/A"

                try:
                    location = job.find_element(By.CSS_SELECTOR, ".overflow-hidden.text-gray-500.mb-2.font-medium").text
                except NoSuchElementException:
                    location = "N/A"

                try:
                    time_posted = job.find_element(By.CSS_SELECTOR, ".overflow-hidden.text-gray-500.mb-2").text
                except NoSuchElementException:
                    time_posted = "N/A"

                try:
                    job_link = job.find_element(By.CSS_SELECTOR, "button[class*='text-start']").get_attribute('href')
                except NoSuchElementException:
                    job_link = "N/A"

                jobs_info.append([job_title, company_name, location, time_posted, job_link])

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

    try:
        jobs_data = [{"companyName": job[1], "jobPostings": job[2]} for job in jobs_info]
        with open('public/hiring_data.json', 'w') as json_file:
            json.dump(jobs_data, json_file)
        print("Data has been successfully written to 'public/hiring_data.json'")
    except Exception as e:
        print("An error occurred while writing data to the JSON file:", e)

except Exception as e:
    print("An error occurred during login or navigation:", e)
