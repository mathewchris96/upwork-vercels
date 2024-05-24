import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
import time
from bs4 import BeautifulSoup
import re

# Set up WebDriver
driver = webdriver.Chrome()  # Change to the appropriate WebDriver for your browser

# Navigate to the webpage
driver.get("https://airtable.com/app1PaujS9zxVGUZ4/shrqYt5kSqMzHV9R5/tbl8c8kanuNB6bPYr?backgroundColor=green&viewControls=on")
driver.maximize_window()
time.sleep(5)

element = driver.find_element(By.XPATH, "//*[@id='view']/div/div[1]/div[1]/div[2]")
# //*[@id="view"]/div/div[1]/div[1]/div[3]
# //*[@id="view"]/div/div[1]/div[1]/div[2]
leftPane = []
rightPane = []
i = 0
while i < 350:
    # Scroll down
    ActionChains(driver).click_and_hold(element).move_by_offset(0, 1).perform()
    ActionChains(driver).reset_actions()
    time.sleep(1)

    # Parse the HTML and append to the lists
    html = driver.page_source
    parsed_html = BeautifulSoup(html, 'html.parser')
    leftPane.append(parsed_html.find_all('div', class_='dataRow leftPane rowExpansionEnabled rowSelectionEnabled'))
    rightPane.append(parsed_html.find_all('div', class_='dataRow rightPane rowExpansionEnabled rowSelectionEnabled'))
    
    # Check if either list has reached size 500
    if len(leftPane) == 3000 or len(rightPane) == 3000:
        break
    
    i += 1
driver.quit()
print(len(leftPane))
print(len(rightPane))
# Function to collect data from each row
dictionary = {}

for i in range(len(leftPane)):  
    for j in range(len(leftPane[i])):

        pattern = r'<div class="line-height-4 overflow-hidden truncate">(.*?)<\/div>'
        match = re.search(pattern, str(leftPane[i][j]))

        if match:
            key = str(leftPane[i][j])[70:100]
            if key not in dictionary:
                dictionary[key] = []
            if str(match.group(1)) not in dictionary[key]:
                dictionary[key].append(str(match.group(1)))

for i in range(len(rightPane)):  
    for j in range(len(rightPane[i])):

        key = str(rightPane[i][j])[71:101]
        if key in dictionary:
            pattern = r'<div class="flex-auto truncate-pre" title="(.*?)">'
            matches = re.findall(pattern, str(rightPane[i][j]))
            for match in matches:
                if match not in dictionary[key]:
                    dictionary[key].append(match)

            pattern = r'<div class="flex-auto truncate line-height-4 right-align tabular-nums" style="padding:6px">([^<$%]+)</div></div>'
            matches = re.findall(pattern, str(rightPane[i][j]))
            filtered_matches = [m for m in matches if '%' not in m]
            if filtered_matches:
                for match in filtered_matches:
                    if match not in dictionary[key]:
                        dictionary[key].append(match)
            else:
                dictionary[key].append('Number of employees laid off not available')

            pattern = r'<div class="truncate css-10jy3hn">(.*?)</div>'
            match = re.search(pattern, str(rightPane[i][j]))
            if match and match.group(1) not in dictionary[key]:
                dictionary[key].append(match.group(1))

print(dictionary)

# Save the dictionary to a JSON file
with open('public/hiring_data.json', 'w') as json_file:
    json.dump(dictionary, json_file, indent=4)

# Quit the WebDriver



# heres a sample of the data in the format that will be scrapped by this page:-
# {
#     "data-rowid=\"recNmwSoB5hhbmN2i\"": [
#         "Silo",
#         "SF Bay Area",
#         "Food",
#         "Series C",
#         "United States",
#         "Number of employees laid off not available",
#         "5/22/2024"
#     ],
#     "data-rowid=\"recaabaLvvZGZYLHm\"": [
#         "Joonko",
#         "New York City",
#         "HR",
#         "Series B",
#         "United States",
#         "Number of employees laid off not available",
#         "5/19/2024"
#     ],
#     "data-rowid=\"recXwReZbpfq9RFGv\"": [
#         "Wefox",
#         "Berlin",
#         "Non-U.S.",
#         "Finance",
#         "Series D",
#         "Germany",
#         "60",
#         "5/16/2024"
#     ],
#     "data-rowid=\"recLPXGjaHnxuCGhZ\"": [
#         "Replit",
#         "SF Bay Area",
#         "Product",
#         "Unknown",
#         "United States",
#         "30",
#         "5/16/2024"
#     ],
#     "data-rowid=\"recZpHKHcPNOywWAd\"": [
#         "Gopuff",
#         "Philadelphia",
#         "Food",
#         "Series H",
#         "United States",
#         "Number of employees laid off not available",
#         "5/16/2024"
#     ],
#     "data-rowid=\"recGo0fJ8t11lYPuH\"": [
#         "SeekOut",
#         "Seattle",
#         "Recruiting",
#         "Series C",
#         "United States",
#         "Number of employees laid off not available",
#         "5/16/2024",
#         "Number of employees laid off not available"
#     ],
#     "data-rowid=\"recP2Fd1PwHGhf64J\"": [
#         "Atmosphere",
#         "Austin",
#         "Other",
#         "Series D",
#         "United States",
#         "100",
#         "5/15/2024"
#     ],
#     "data-rowid=\"recP0qdlkv5Ae4k34\"": [
#         "Singularity 6",
#         "Los Angeles",
#         "Other",
#         "Series B",
#         "United States",
#         "36",
#         "5/15/2024"
#     ],
#     "data-rowid=\"rec76U0Z7nLS0silY\"": [
#         "Mainvest",
#         "Boston",
#         "Finance",
#         "Unknown",
#         "United States",
#         "Number of employees laid off not available",
#         "5/14/2024",
#         "Number of employees laid off not available"
#     ],
#     "data-rowid=\"rec5hqYomqiuKLNdX\"": [
#         "Indeed",
#         "Austin",
#         "HR",
#         "Acquired",
#         "United States",
#         "1000",
#         "5/13/2024"
#     ],
#     "data-rowid=\"recDGisq7F9lALQKX\"": [
#         "Motional",
#         "Pittsburgh",
#         "Transportation",
#         "Unknown",
#         "United States",
#         "550",
#         "5/10/2024"
#     ],
#     "data-rowid=\"recq249RbuKhqMxIU\"": [
#         "Rivian",
#         "Los Angeles",
#         "Transportation",
#         "Post-IPO",
#         "United States",
#         "120",
#         "5/10/2024"
#     ],
#     "data-rowid=\"recT9h90jvnyn6xe8\"": [
#         "Google",
#         "SF Bay Area",
#         "Consumer",
#         "Post-IPO",
#         "United States",
#         "57",
#         "5/10/2024"
#     ],
#     "data-rowid=\"recq0WuSM1a1NbUbN\"": [
#         "Vacasa",
#         "Portland",
#         "Travel",
#         "Post-IPO",
#         "United States",
#         "800",
#         "5/9/2024"
#     ],
#     "data-rowid=\"recpVdI1xW56IkTkt\"": [
#         "PrepLadder",
#         "New Delhi",
#         "Non-U.S.",
#         "Education",
#         "Acquired",
#         "India",
#         "145",
#         "5/8/2024"
#     ],
#     "data-rowid=\"recdq6dTWpzcoDjPf\"": [
#         "Simpl",
#         "Bengaluru",
#         "Non-U.S.",
#         "Finance",
#         "Series B",
#         "India",
#         "100",
#         "5/8/2024"
#     ],
#     "data-rowid=\"recjg7N06h9KXPpNG\"": [
#         "Arkane Studios",
#         "Austin",
#         "Consumer",
#         "Unknown",
#         "United States",
#         "96",
#         "5/8/2024"
#     ],
#     "data-rowid=\"recuTCEnyeFesEgyV\"": [
#         "Brilliant",
#         "SF Bay Area",
#         "Hardware",
#         "Series B",
#         "United States",
#         "Number of employees laid off not available",
#         "5/8/2024",
#         "Number of employees laid off not available",
#         "Number of employees laid off not available",
#         "Number of employees laid off not available"
#     ],
#     "data-rowid=\"recU78Rx9mMN6vOKN\"": [
#         "Kinaxis",
#         "Ottawa",
#         "Non-U.S.",
#         "Other",
#         "Post-IPO",
#         "Canada",
#         "Number of employees laid off not available",
#         "5/8/2024",
#         "Number of employees laid off not available",
#         "Number of employees laid off not available",
#         "Number of employees laid off not available"
#     ],
#     "data-rowid=\"recRuXkUJsJPrSjTf\"": [
#         "Hopin",
#         "London",
#         "Non-U.S.",
#         "Other",
#         "Series D",
#         "United Kingdom",
#         "Number of employees laid off not available",
#         "5/7/2024",
#         "Number of employees laid off not available",
#         "Number of employees laid off not available",
#         "Number of employees laid off not available"
#     ]
# }