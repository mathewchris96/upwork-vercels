# Import the required function from trueup_scrapper.py
from trueup_scrapper import process_opportunities

# Define a function to format the ranking data for web presentation
def format_ranking_for_display(ranked_companies):
    # Convert the ranked companies data into HTML format for displaying on "company-rankings.html"
    # Note: The data structure now includes 'name', 'founded', 'headquarters', and 'industry'
    html_content = "<ul>"
    for company in ranked_companies:
        html_content += f"<li>{company['name']} - Founded: {company['founded']}, Headquarters: {company['headquarters']}, Industry: {company['industry']}</li>"
    html_content += "</ul>"
    return html_content

def main():
    # Fetch actual data from 'trueup_scrapper.py'
    jobs_info = process_opportunities()

    # Process and rank the companies (assuming process_opportunities already does this)
    ranked_companies = jobs_info

    # Format the ranking data for web display
    display_content = format_ranking_for_display(ranked_companies)

    # Logic to save/display this data on "company-rankings.html" would go here
    print(display_content)

if __name__ == "__main__":
    main()

# Assuming Flask is used for the web server part
from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/api/rankings/', methods=['GET'])
def get_rankings():
    # Fetch and process the data from 'trueup_scrapper.py'
    data = process_opportunities()
    # Format the data similar to how `format_ranking_for_display` does as suggested
    formatted_data = format_ranking_for_display(data)
    # Returning the formatted data
    return formatted_data

if __name__ == '__main__':
    app.run(debug=True)