from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import schedule
import time
from collections import Counter
from opportunities import process_opportunities

def job_scraping_task():
    driver = webdriver.Chrome()  # You can replace 'Chrome' with your preferred browser
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

        companies_info = Counter()
        try:
            while True:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".mb-3.card"))
                )

                job_listings = driver.find_elements(By.CSS_SELECTOR, ".mb-3.card")

                for job in job_listings:
                    company_name = job.find_element(By.CSS_SELECTOR, "div.mb-2.align-items-baseline a").text if job.find_elements(By.CSS_SELECTOR, "div.mb-2.align-items-baseline a") else "Unknown"

                    # Increment count for each company found
                    companies_info[company_name] += 1

                try:
                    show_more_button = WebDriverWait(driver, 5).until(
                        EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Show more')]"))
                    )
                    driver.execute_script("arguments[0].click();", show_more_button)
                except (NoSuchElementException, TimeoutException):
                    print("No more 'Show more' button to click or all job listings are loaded.")
                    break
        except Exception as e:
            print("An error occurred while collecting job listings:", e)

        formatted_opportunities = [{"company": company, "no_of_posts": count} for company, count in companies_info.items()]

        process_opportunities(formatted_opportunities)

    except Exception as e:
        print("An error occurred during login or navigation:", e)

    driver.quit()

schedule.every().day.at("10:00").do(job_scraping_task)

while True:
    schedule.run_pending()
    time.sleep(1)