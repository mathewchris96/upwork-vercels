# Importing necessary libraries
import schedule
import time
from trueup_scrapper import main

# Defining the function to run the scrapper
def run_scrapper():
    try:
        main()
    except Exception as e:
        print(f"An error occurred: {e}")

# Scheduling the run_scrapper function to run every 3 hours
schedule.every(3).hours.do(run_scrapper)

# Infinite loop to keep the script running and check for scheduled tasks
while True:
    schedule.run_pending()
    time.sleep(1)