# scraper_scheduler.py

# Import the APScheduler library
from apscheduler.schedulers.blocking import BlockingScheduler
import trueup_scrapper

# Define the schedule_scraper function
def schedule_scraper():
    # Initialize a BlockingScheduler instance
    scheduler = BlockingScheduler()
    
    # Configure the scheduler to call the run_scraper function from trueup_scrapper.py every 3 hours
    scheduler.add_job(trueup_scrapper.run_scraper, 'interval', hours=3)
    
    # Start the scheduler
    scheduler.start()

# Conditional check to make the script executable as a standalone scheduler
if __name__ == "__main__":
    schedule_scraper()