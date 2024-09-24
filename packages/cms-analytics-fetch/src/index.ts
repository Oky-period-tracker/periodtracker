import axios, { AxiosResponse } from 'axios'; // Import axios for HTTP requests and types for TypeScript.
import dotenv from 'dotenv'; // Import dotenv to load environment variables from a .env file.
import qs from 'qs'; // Import qs to stringify query parameters.
import cron from 'node-cron'; // Import node-cron to schedule tasks.
import fs from 'fs'; // Import fs to interact with the file system.
import path from 'path'; // Import path to work with file and directory paths.
import mysql from 'mysql2/promise'; // Import MySQL promise-based package.

// Load environment variables from the .env file.
dotenv.config();

/**
 * Retrieves the value of an environment variable.
 * @param name The name of the environment variable.
 * @returns The value of the environment variable.
 * @throws Error if the environment variable is missing.
 */
function getEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// Retrieve necessary environment variables for CMS login.
const loginUrl = getEnvVariable('CMS_LOGIN_URL');
const username = getEnvVariable('CMS_USERNAME');
const password = getEnvVariable('CMS_PASSWORD');

// The endpoint to fetch analytics data from the CMS.
const endpoint = 'https://cms.en.oky.greychaindesign.com/analytics-management';

// Paths to save the most recent data fetched.
const dataFilePath = path.join(__dirname, 'recentData.json');

/**
 * Logs in to the CMS and retrieves the session cookies.
 * @returns A promise that resolves with the session cookies.
 * @throws Error if the login fails.
 */
async function login(): Promise<string[]> {
  try {
    // Prepare the login payload with the username and password.
    const payload = qs.stringify({
      username,
      password,
    });

    console.log('Sending login request to:', loginUrl);
    
    // Send a POST request to the login URL with the credentials.
    const response: AxiosResponse = await axios.post(loginUrl, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      maxRedirects: 0, // Prevent following redirects automatically.
      validateStatus: (status) => status < 400 || status === 302, // Accept 302 (redirect) as a valid status.
    });

    // Check if the login was successful (302 redirect indicates a successful login).
    if (response.status === 302) {
      console.log('Login successful, redirected to:', response.headers['location']);
    } else {
      console.log('Login response status:', response.status);
      console.log('Login response data:', response.data);
    }

    // Extract cookies from the response headers.
    const cookies = response.headers['set-cookie'];
    if (!cookies) {
      throw new Error('No cookies set after login');
    }
    return cookies;
  } catch (error) {
    // Handle errors during the login process.
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else if (error instanceof Error) {
      console.error('Error logging in:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

/**
 * Fetches analytics data from the CMS using the session cookies.
 * @param cookies The session cookies obtained from the login.
 * @returns A promise that resolves with the analytics data.
 * @throws Error if the data fetch fails.
 */
async function fetchAnalytics(cookies: string[]): Promise<any> {
  try {
    console.log(`Fetching analytics from ${endpoint}`);
    
    // Send a GET request to the analytics endpoint with the cookies.
    const response: AxiosResponse = await axios.get(endpoint, {
      headers: {
        Accept: 'application/json', // Expect JSON response.
        Cookie: cookies.join('; '), // Send cookies in the request header.
      },
      maxRedirects: 0, // Prevent following redirects automatically.
    });
    
    // Debugging: Log the raw response data.
    console.log('Fetch analytics response:', response.data);
    
    return response.data; // Return the analytics data.
  } catch (error) {
    // Handle errors during data fetching.
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else if (error instanceof Error) {
      console.error('Error fetching analytics data:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

/**
 * Saves the fetched data to a JSON file.
 * @param data The data to save.
 */
function saveData(data: object) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

/**
 * Connects to MySQL database.
 * @returns A promise that resolves with the MySQL connection object.
 */
async function getMySQLConnection() {
  return mysql.createConnection({
    host: getEnvVariable('MYSQL_HOST'),
    user: getEnvVariable('MYSQL_USER'),
    password: getEnvVariable('MYSQL_PASSWORD'),
    database: getEnvVariable('MYSQL_DATABASE'),
  });
}

/**
 * Saves the fetched data to MySQL database.
 * @param data The data to save.
 */
async function saveDataToMySQL(data: object[]) {
  const connection = await getMySQLConnection();
  try {
    // Ensure the table exists or create it if necessary.
    await connection.query(`
      CREATE TABLE IF NOT EXISTS analytics_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp DATETIME,
        data JSON
      )
    `);

    // Insert the data into the table.
    const timestamp = new Date();
    await connection.query('INSERT INTO analytics_data (timestamp, data) VALUES (?, ?)', [
      timestamp,
      JSON.stringify(data),
    ]);

    console.log('Data successfully saved to MySQL');
  } catch (err) {
    console.error('Error saving data to MySQL:', err);
  } finally {
    connection.end(); // Close the connection.
  }
}

/**
 * Retrieves the last saved data from the JSON file.
 * @returns The last saved data or null if no data is available.
 */
function getLastSavedData(): object | null {
  if (fs.existsSync(dataFilePath)) {
    const rawData = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(rawData);
  }
  return null;
}

/**
 * Main function to log in, fetch analytics data, and save it with a timestamp.
 */
async function main() {
  try {
    const timestamp = new Date().toISOString(); // Get the current timestamp.
    const cookies = await login(); // Log in to get the session cookies.
    
    // Debugging: Log cookies after login.
    console.log('Cookies:', cookies);

    const data = await fetchAnalytics(cookies); // Fetch the analytics data.
    
    // Debugging: Log the data fetched from CMS.
    console.log('Fetched Data:', data);

    if (!data || data.length === 0) {
      console.error('No data fetched from the CMS.');
      return;
    }

    // Ensure the data is in an array format suitable for saving to MySQL.
    const dataArray = Array.isArray(data) ? data : [data];

    // Prepare the result with the fetched data and timestamp.
    const result = {
      timestamp,
      data: dataArray,
    };

    saveData(result); // Save the fetched data with the timestamp (optional).
    await saveDataToMySQL(dataArray); // Save the fetched data to MySQL.
    console.log('Fetched and saved analytics data:', JSON.stringify(result, null, 2));
  } catch (error) {
    // Handle errors during the main execution.
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else if (error instanceof Error) {
      console.error('Error fetching data from CMS:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }

    // If there's an error, retrieve and display the last saved data.
    const lastData = getLastSavedData();
    if (lastData) {
      console.log('CMS is down. Showing the most recent fetched data:');
      console.log(JSON.stringify(lastData, null, 2));
    } else {
      console.log('CMS is down and no recent data is available.');
    }
  }
}

// Schedule the task to run daily at midnight (00:00).
cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled task...');
  main().catch((error) => console.error('Scheduled task failed:', error));
});

// Run the task immediately on start.
main().catch((error) => console.error('Initial run failed:', error));
