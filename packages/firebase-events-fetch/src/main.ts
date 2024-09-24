import { google } from 'googleapis'; // Google API client library to interact with Firebase Analytics and other Google services
import path from 'path'; // Built-in Node.js module to work with file and directory paths
import mysql from 'mysql2/promise'; // MySQL client library with Promise support
import * as dotenv from 'dotenv'; // dotenv for loading environment variables
dotenv.config(); // Load .env file

import { scheduleAnalyticsFetch } from './config/cronConfig'; // Custom function that schedules analytics data fetching using cron jobs
import { getEventsData, getUserMetricsByCountry, UserMetrics } from './services/analyticsService'; // Functions and types related to fetching analytics data

// Utility function to format ISO date to MySQL DATETIME format
function formatDateForMySQL(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// This function is responsible for authenticating the application to access Google Analytics API
async function authenticate() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../credentials/client_secrets.json'), // Path to the JSON file containing client credentials
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'], // Scopes define the level of access to resources (read-only in this case)
    });
    console.log('Authentication successful.');
    return await auth.getClient();
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
}

// Interface that defines the structure of event data we expect to receive from Firebase Analytics
interface EventData {
  eventName: string; // The name of the event (e.g., "user_signup")
  eventCount: string; // The number of times the event has occurred
}

// Create MySQL connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Function to insert or update event data in MySQL
async function insertEventData(eventsData: EventData[] | undefined, deployment: string) {
  const query = `
    INSERT INTO ${deployment}.events_data (event_type, event_timestamp, user_id, country, event_count)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      event_count = VALUES(event_count), 
      event_timestamp = VALUES(event_timestamp);
  `;

  if (eventsData && eventsData.length > 0) {
    for (const event of eventsData) {
      const formattedTimestamp = formatDateForMySQL(new Date());
      try {
        await pool.execute(query, [
          event.eventName,
          formattedTimestamp,
          'unknown_user',
          'unknown_country',
          parseInt(event.eventCount, 10),
        ]);
        console.log(`Event Data Inserted: ${event.eventName}, Count: ${event.eventCount}`);
      } catch (error) {
        console.error(`Error inserting event data for ${event.eventName}:`, error);
      }
    }
  } else {
    // Insert '0' for default if no events data is fetched
    const formattedTimestamp = formatDateForMySQL(new Date());
    try {
      await pool.execute(query, [
        'no_event', // Default event name
        formattedTimestamp,
        'unknown_user',
        'unknown_country',
        0,
      ]);
      console.log(`Inserted default event data with count 0.`);
    } catch (error) {
      console.error('Error inserting default event data:', error);
    }
  }
}

// Function to insert or update daily active users (DAU) in MySQL
async function insertDailyActiveUsers(userMetrics: UserMetrics[] | undefined, deployment: string) {
  const query = `
    INSERT INTO ${deployment}.daily_active_users (date, country, active_users)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      active_users = VALUES(active_users);
  `;

  if (userMetrics && userMetrics.length > 0) {
    let hasOneDayData = false; // Track if we have any data for the 1-day metric

    for (const metric of userMetrics) {
      // Parse and round down DAU value
      const dau = Math.floor(parseFloat(metric.dau));

      // Ensure we handle all cases, even if the value is 0
      if (!isNaN(dau)) {
        try {
          await pool.execute(query, [
            new Date().toISOString().slice(0, 10),
            metric.country,
            dau,
          ]);
          console.log(`Daily Active Users Inserted for ${metric.country}: ${dau}`);
          if (dau > 0) hasOneDayData = true;
        } catch (error) {
          console.error(`Error inserting daily active users for ${metric.country}:`, error);
        }
      }
    }

    // If no active users were found for any country, ensure a 0 entry is inserted for consistency
    if (!hasOneDayData) {
      try {
        await pool.execute(query, [
          new Date().toISOString().slice(0, 10),
          'United Kingdom', // Set a specific country or placeholder
          0,
        ]);
        console.log('Inserted default daily active users with count 0 for 1-day metric.');
      } catch (error) {
        console.error('Error inserting default daily active users with count 0:', error);
      }
    }
  } else {
    console.log('No daily active users data found, inserting 0.');
    // Explicitly insert 0 for a known country or placeholder if no data was fetched
    try {
      await pool.execute(query, [
        new Date().toISOString().slice(0, 10),
        'United Kingdom', // Modify to your expected country
        0,
      ]);
      console.log('Inserted default daily active users with count 0.');
    } catch (error) {
      console.error('Error inserting default daily active users with count 0:', error);
    }
  }
}


// Function to insert or update monthly active users (MAU) in MySQL
async function insertMonthlyActiveUsers(userMetrics: UserMetrics[] | undefined, deployment: string) {
  const query = `
    INSERT INTO ${deployment}.monthly_active_users (month_year, country, active_users)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      active_users = VALUES(active_users);
  `;

  if (userMetrics && userMetrics.length > 0) {
    for (const metric of userMetrics) {
      const mau = parseInt(metric.mau, 10);
      if (!isNaN(mau) && mau > 0) {
        const monthYear = new Date().toISOString().slice(0, 7);
        try {
          await pool.execute(query, [
            monthYear,
            metric.country,
            mau
          ]);
          console.log(`Monthly Active Users Inserted for ${metric.country}: ${mau}`);
        } catch (error) {
          console.error(`Error inserting monthly active users for ${metric.country}:`, error);
        }
      }
    }
  } else {
    console.log('No monthly active users data found.');
  }
}

// Function to insert or update total users in MySQL
async function insertTotalUsers(userMetrics: UserMetrics[] | undefined, deployment: string) {
  const query = `
    INSERT INTO ${deployment}.total_users (country, total_users)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
      total_users = VALUES(total_users);
  `;

  if (userMetrics && userMetrics.length > 0) {
    for (const metric of userMetrics) {
      const totalUsers = parseInt(metric.totalUsers, 10);
      if (!isNaN(totalUsers) && totalUsers > 0) {
        try {
          await pool.execute(query, [
            metric.country,
            totalUsers
          ]);
          console.log(`Total Users Inserted for ${metric.country}: ${totalUsers}`);
        } catch (error) {
          console.error(`Error inserting total users for ${metric.country}:`, error);
        }
      }
    }
  } else {
    console.log('No total users data found.');
  }
}

// Main function responsible for fetching and inserting analytics data
export async function fetchAnalyticsData() {
  const propertyId = '452357929'; // Replace with your actual property ID from Firebase Analytics

  try {
    console.log('Starting data fetch...');
    const authClient = await authenticate();

    console.log('Fetching events data...');
    const eventsData: EventData[] | undefined = await getEventsData(authClient, propertyId);
    const deployment = 'deployment_1';
    await insertEventData(eventsData, deployment);

    console.log('Fetching user metrics by country...');
    const userMetricsByCountry: UserMetrics[] | undefined = await getUserMetricsByCountry(authClient, propertyId);
    
    // Log raw data fetched for verification
    console.log('Raw user metrics fetched:', JSON.stringify(userMetricsByCountry, null, 2));
    
    await insertDailyActiveUsers(userMetricsByCountry, deployment);
    await insertMonthlyActiveUsers(userMetricsByCountry, deployment);
    await insertTotalUsers(userMetricsByCountry, deployment);
  } catch (error) {
    console.error('Error during analytics data fetch:', error);
  }
}

// Schedule the analytics fetch task using a cron job (defined in another module)
scheduleAnalyticsFetch();

// Run the main function immediately to fetch and insert the data right away
fetchAnalyticsData().catch(console.error); // Catch and log any errors that may occur during the fetching process
