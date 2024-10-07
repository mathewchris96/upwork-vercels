
This project is a Node.js application designed to serve web content or APIs, complemented by Python scripts for background tasks. The Node.js server handles client requests and responses, while the Python scripts perform data scraping tasks, scheduled and managed by the Node.js environment.

# Prerequisites

- **Node.js**: Ensure Node.js is installed. Refer to the `package.json` for the specific version required.
- **Python**: Install Python. Check `scrapper1.py` for the required version or use a compatible version.
- **Global Installations**:
  - `npm`: For managing Node.js packages.
  - `pip`: For managing Python packages.

# Installation

## Node.js Setup

1. Navigate to the project directory.
2. Run the following command to install Node.js dependencies:
   ```bash
   npm install
   ```

## Python Setup

1. Ensure Python is installed on your system.
2. (Optional) Set up a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```
3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

# Configuring the Environment

Create a `.env` file in the root directory and populate it with necessary environment variables. Below is a template with example placeholders:

```
DB_CONNECTION_STRING=your_database_connection_string
SESSION_SECRET=your_session_secret
API_KEY=your_api_key
```

Replace the placeholder values with your actual configuration data.

# Running the Project

## Node.js Server

To start the Node.js server, run:
```bash
node server.js
```
Look for a success message or log output indicating the server is running.

## Python Scripts

To execute the `scrapper1.py` script directly, use:
```bash
python scrapper1.py
```

For running via `scrapperScheduler.js`, ensure the scheduler is set up and execute:
```bash
node scrapperScheduler.js
```

# Troubleshooting

- **Node.js Issues**: Ensure all dependencies in `package.json` are installed. Check for any missing environment variables in `.env`.
- **Python Issues**: Verify that all required packages are installed via `pip`. Ensure the correct Python version is being used.
- **Environment Variables**: Double-check the `.env` file for any missing or incorrect values.