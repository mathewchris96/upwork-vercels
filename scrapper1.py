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
while i < 150:
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
    if len(leftPane) == 10 or len(rightPane) == 10:
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
with open('D:/complete/data.json', 'w') as json_file:
    json.dump(dictionary, json_file, indent=4)

# Quit the WebDriver
