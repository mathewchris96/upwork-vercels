import schedule
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from Opportunities import store_opportunities

def job_scraping():
    driver = webdriver.Chrome()
    driver.get("https://www.trueup.io/")

    try:
        login_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//span/button[contains(text(), 'Log in')]"))
        )
        login_button.click()
        
        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "username"))
        )
        email_input.send_keys("mathewchris96@gmail.com")
        
        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys("Nighthack123")
        
        continue_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@value='default']"))
        )
        continue_button.click()
        
        all_jobs_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//a[@href='/jobs']"))
        )
        all_jobs_button.click()
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".mb-3.card"))
        )

        jobs_info = []
        try:
            while len(jobs_info) < 1000:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".mb-3.card"))
                )

                job_listings = driver.find_elements(By.CSS_SELECTOR, ".mb-3.card")

                for job in job_listings:
                    if len(jobs_info) >= 1000:
                        break

                    job_title = job.find_element(By.CSS_SELECTOR, "div.fw-bold.mb-1 a").text if job.find_elements(By.CSS_SELECTOR, "div.fw-bold.mb-1 a") else "N/A"
                    company_name = job.find_element(By.CSS_SELECTOR, "div.mb-2.align-items-baseline a").text if job.find_elements(By.CSS_SELECTOR, "div.mb-2.align-items-baseline a") else "N/A"
                    location = job.find_element(By.CSS_SELECTOR, "div.overflow-hidden.text-secondary.mb-2").text if job.find_elements(By.CSS_SELECTOR, "div.overflow-hidden.text-secondary.mb-2") else "N/A"
                    time_posted = job.find_element(By.CSS_SELECTOR, "div.overflow-hidden.text-secondary.small.mb-2").text if job.find_elements(By.CSS_SELECTOR, "div.overflow-hidden.text-secondary.small.mb-2") else "N/A"
                    salary_range = job.find_element(By.CSS_SELECTOR, "div.overflow-hidden.small.mb-2").text if job.find_elements(By.CSS_SELECTOR, "div.overflow-hidden.small.mb-2") else "N/A"
                    job_link = job.find_element(By.CSS_SELECTOR, "div.fw-bold.mb-1 a").get_attribute('href') if job.find_elements(By.CSS_SELECTOR, "div.fw-bold.mb-1 a") else "N/A"

                    # Modified to match the expected dictionary format in Opportunities.py
                    job_info_dict = {
                        'title': job_title,
                        'company': company_name,
                        'location': location,
                        'time_posted': time_posted,
                        'salary_range': salary_range,
                        'job_link': job_link
                    }
                    jobs_info.append(job_info_dict)

                try:
                    show_more_button = WebDriverWait(driver, 5).until(
                        EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Show more')]"))
                    )
                    driver.execute_script("arguments[0].click();", show_more_button)
                except (NoSuchElementException, TimeoutException):
                    break
        except Exception as e:
            print(f"An error occurred while collecting job listings: {e}")

        try:
            store_opportunities(jobs_info)
        except Exception as e:
            print(f"An error occurred while passing data to Opportunities.py: {e}")

    except Exception as e:
        print(f"An error occurred during login or navigation: {e}")

    driver.quit()

schedule.every().day.at("10:00").do(job_scraping)

while True:
    schedule.run_pending()
    time.sleep(60)