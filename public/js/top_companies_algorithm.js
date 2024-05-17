// File created to hold algorithms related to processing top companies data

// Fetching data from the output of trueup_scrapper.py, expecting JSON format
async function fetchData() {
    const response = await fetch('./trueup_scrapper_output.json');
    const data = await response.json();
    return data;
}

// Function to sort the companies based on the number of hires and select the top 10
function sortAndSelectTopCompanies(data) {
    data.sort((a, b) => b.hires - a.hires);
    return data.slice(0, 10);
}

// Main function to process data and return top 10 companies
async function getTopCompanies() {
    try {
        const rawData = await fetchData();
        const topCompanies = sortAndSelectTopCompanies(rawData);
        const topCompaniesFormatted = topCompanies.map((company, index) => ({
            name: company.name,
            ranking: index + 1
        }));
        return topCompaniesFormatted;
    } catch(error) {
        console.error('Failed to process top companies data:', error);
        return [];
    }
}

// Export the getTopCompanies function to be available for other modules
export { getTopCompanies };