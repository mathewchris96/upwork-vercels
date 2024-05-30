# date_utils.py

from datetime import datetime, timedelta

def format_posted_date(time_posted):
    current_date = datetime.now()
    posting_date = datetime.strptime(time_posted, '%Y-%m-%d')  # Assuming the time_posted is in the format 'YYYY-MM-DD'

    time_difference = current_date - posting_date

    if time_difference.days == 0:
        return "posted today"
    elif time_difference.days == 1:
        return "1 day ago"
    else:
        return f"{time_difference.days} days ago"