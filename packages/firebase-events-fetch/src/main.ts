import axios, { AxiosResponse } from 'axios';
import { google } from 'googleapis';
import path from 'path';
import { Pool } from 'pg';
import qs from 'qs';
import cron from 'node-cron';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

import { getEventsData, getUserMetricsByCountry, UserMetrics } from './services/analyticsService';

// Define the EventData interface here
interface EventData {
  eventName: string;
  eventCount: string;
}

/**
 * Formats a JavaScript Date object into a PostgreSQL-compatible TIMESTAMP string.
 * @param date - The JavaScript Date object to format.
 * @returns A formatted string in the 'YYYY-MM-DD HH:MM:SS' format.
 */
function formatDateForPostgres(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Authenticates the application to access the Firebase Analytics API using Google OAuth.
 * @returns The authenticated Google client instance.
 */
async function authenticate() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../credentials/client_secrets.json'),
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
    console.log('Firebase Authentication successful.');
    return await auth.getClient();
  } catch (error) {
    console.error('Firebase Authentication failed:', error);
    throw error;
  }
}

// Create a connection pool to the PostgreSQL database using environment variables
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: Number(process.env.PG_PORT),
});

/**
 * Creates necessary tables in the PostgreSQL database if they do not exist for the given Firebase project.
 * @param tableNamePrefix - The prefix used to create the tables specific to each Firebase property ID.
 */
async function createTablesIfNotExist(tableNamePrefix: string) {
  const createQueries = [
    `CREATE TABLE IF NOT EXISTS ${tableNamePrefix}_events_data (
      event_type VARCHAR(255) NOT NULL,
      event_timestamp DATE NOT NULL,
      user_id VARCHAR(255) DEFAULT 'unknown_user',
      country VARCHAR(255) DEFAULT 'unknown_country',
      event_count INT DEFAULT 0,
      UNIQUE (event_type, event_timestamp, user_id, country)
    )`,
    `CREATE TABLE IF NOT EXISTS ${tableNamePrefix}_daily_active_users (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      country VARCHAR(255) DEFAULT 'unknown_country',
      active_users INT DEFAULT 0,
      UNIQUE (date, country)
    )`,
    `CREATE TABLE IF NOT EXISTS ${tableNamePrefix}_monthly_active_users (
      id SERIAL PRIMARY KEY,
      month_year VARCHAR(7) NOT NULL,
      country VARCHAR(255) DEFAULT 'unknown_country',
      active_users INT DEFAULT 0,
      UNIQUE (month_year, country)
    )`,
    `CREATE TABLE IF NOT EXISTS ${tableNamePrefix}_total_users (
      id SERIAL PRIMARY KEY,
      country VARCHAR(255) DEFAULT 'unknown_country',
      total_users INT DEFAULT 0,
      UNIQUE (country)
    )`
  ];

  try {
    for (const query of createQueries) {
      await pool.query(query);
    }
    console.log(`Tables created or verified for prefix: ${tableNamePrefix}`);
  } catch (error) {
    console.error(`Error creating tables for prefix ${tableNamePrefix}:`, error);
  }
}

/**
 * Inserts or updates event data fetched from Firebase Analytics into the PostgreSQL table.
 * @param eventsData - Array of event data to be inserted or updated.
 * @param tableNamePrefix - The prefix used to identify the specific table.
 */
async function insertEventData(eventsData: EventData[] | undefined, tableNamePrefix: string) {
  if (eventsData && eventsData.length > 0) {
    const values: any[] = [];
    
    // Create the VALUES string with positional parameter placeholders
    const valuePlaceholders = eventsData
      .map((_, index) => {
        const baseIndex = index * 5;
        values.push(
          eventsData[index].eventName,
          new Date().toISOString().slice(0, 10), // Only the date part
          'unknown_user',
          'unknown_country',
          parseInt(eventsData[index].eventCount, 10)
        );
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`;
      })
      .join(', ');

    const query = `
      INSERT INTO ${tableNamePrefix}_events_data (event_type, event_timestamp, user_id, country, event_count)
      VALUES ${valuePlaceholders}
      ON CONFLICT (event_type, event_timestamp, user_id, country)
      DO UPDATE SET
        event_count = EXCLUDED.event_count,
        event_timestamp = EXCLUDED.event_timestamp;
    `;

    try {
      await pool.query(query, values);
      console.log('Bulk event data inserted/replaced.');
    } catch (error) {
      console.error('Error inserting/replacing bulk event data:', error);
    }
  }
}


/**
 * Inserts or updates daily active users, monthly active users, and total users metrics into PostgreSQL.
 * @param userMetrics - Array of user metrics data to be inserted or updated.
 * @param tableNamePrefix - The prefix used to identify the specific table.
 */
async function insertUserMetricsData(userMetrics: UserMetrics[] | undefined, tableNamePrefix: string) {
  if (!userMetrics || userMetrics.length === 0) return;

  const dailyValues = userMetrics.map(metric => [
    new Date().toISOString().slice(0, 10),
    metric.country,
    Math.floor(parseFloat(metric.dau))
  ]);
  const monthlyValues = userMetrics.map(metric => [
    new Date().toISOString().slice(0, 7),
    metric.country,
    parseInt(metric.mau, 10)
  ]);
  const totalValues = userMetrics.map(metric => [
    metric.country,
    parseInt(metric.totalUsers, 10)
  ]);

  const dailyQuery = `
    INSERT INTO ${tableNamePrefix}_daily_active_users (date, country, active_users)
    VALUES ($1, $2, $3)
    ON CONFLICT (date, country) 
    DO UPDATE SET active_users = EXCLUDED.active_users;
  `;
  const monthlyQuery = `
    INSERT INTO ${tableNamePrefix}_monthly_active_users (month_year, country, active_users)
    VALUES ($1, $2, $3)
    ON CONFLICT (month_year, country) 
    DO UPDATE SET active_users = EXCLUDED.active_users;
  `;
  const totalQuery = `
    INSERT INTO ${tableNamePrefix}_total_users (country, total_users)
    VALUES ($1, $2)
    ON CONFLICT (country) 
    DO UPDATE SET total_users = EXCLUDED.total_users;
  `;

  try {
    for (const values of dailyValues) {
      await pool.query(dailyQuery, values);
    }
    for (const values of monthlyValues) {
      await pool.query(monthlyQuery, values);
    }
    for (const values of totalValues) {
      await pool.query(totalQuery, values);
    }
    console.log(`User metrics data inserted for prefix ${tableNamePrefix}`);
  } catch (error) {
    console.error(`Error inserting user metrics data for prefix ${tableNamePrefix}:`, error);
  }
}

/**
 * Loads CMS configurations from a JSON file.
 * @returns An array of CMS configuration objects.
 */
async function loadCMSConfigs(): Promise<any[]> {
  const cmsConfigsPath = path.join(__dirname, 'cmsConfigs.json');
  if (!fs.existsSync(cmsConfigsPath)) {
    throw new Error('CMS configuration file (cmsConfigs.json) not found');
  }
  const rawData = fs.readFileSync(cmsConfigsPath, 'utf-8');
  return JSON.parse(rawData);
}

/**
 * Logs in to the CMS and retrieves session cookies.
 * @param loginUrl - The URL for CMS login.
 * @param username - CMS login username.
 * @param password - CMS login password.
 * @returns An array of cookies for the CMS session.
 */
async function loginToCMS(loginUrl: string, username: string, password: string): Promise<string[]> {
  try {
    const payload = qs.stringify({ username, password });
    const response: AxiosResponse = await axios.post(loginUrl, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      maxRedirects: 0,
      validateStatus: (status) => status < 400 || status === 302,
    });
    const cookies = response.headers['set-cookie'];
    if (!cookies) {
      throw new Error('No cookies set after CMS login');
    }
    return cookies;
  } catch (error) {
    console.error('Error during CMS login:', error);
    throw error;
  }
}

/**
 * Fetches analytics data from a CMS endpoint using authenticated cookies.
 * @param endpoint - The CMS analytics endpoint URL.
 * @param cookies - An array of cookies for the CMS session.
 * @returns The fetched analytics data.
 */
async function fetchAnalyticsDataForCMS(endpoint: string, cookies: string[]): Promise<any> {
  try {
    const response: AxiosResponse = await axios.get(endpoint, {
      headers: {
        Accept: 'application/json',
        Cookie: cookies.join('; '),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching CMS analytics data:', error);
    throw error;
  }
}

/**
 * Saves the fetched CMS data into the PostgreSQL database, replacing any existing data.
 * @param cmsName - The CMS name used as the table prefix.
 * @param data - The CMS data to save.
 */
async function saveCMSToPostgreSQL(cmsName: string, data: object[]) {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${cmsName}_analytics_data (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP NOT NULL,
        data JSON NOT NULL
      )
    `);

    const insertQuery = `
      INSERT INTO ${cmsName}_analytics_data (id, timestamp, data)
      VALUES (1, $1, $2)
      ON CONFLICT (id)
      DO UPDATE SET
        timestamp = EXCLUDED.timestamp,
        data = EXCLUDED.data;
    `;

    const timestamp = new Date();
    await pool.query(insertQuery, [timestamp, JSON.stringify(data)]);

    console.log(`Data successfully saved to PostgreSQL for CMS: ${cmsName}`);
  } catch (err) {
    console.error(`Error saving data to PostgreSQL for CMS: ${cmsName}`, err);
  }
}

/**
 * Fetches analytics data for a CMS, logs in, retrieves data, and saves it into PostgreSQL.
 * If the CMS is down, it shows the most recent data with a message.
 * @param cmsConfig - The CMS configuration object containing login details and endpoint.
 */
async function fetchAndSaveForCMS(cmsConfig: any) {
  const { name, loginUrl, username, password, endpoint } = cmsConfig;
  const cmsName = name || loginUrl.replace(/^https?:\/\//, '').split('.')[0];

  try {
    console.log(`Fetching data for CMS: ${cmsName}`);
    const cookies = await loginToCMS(loginUrl, username, password);
    const responseData = await fetchAnalyticsDataForCMS(endpoint, cookies);

    const dataArray = Array.isArray(responseData) ? responseData : [responseData];
    await saveCMSToPostgreSQL(cmsName, dataArray);
    console.log(`Fetched and saved analytics data for CMS: ${cmsName}`);
  } catch (error) {
    console.error(`Error fetching data from CMS: ${cmsName}`, error);

    // Fetch the most recent data from the database
    try {
      const result = await pool.query<{ timestamp: string; data: any }>(
        `SELECT timestamp, data FROM ${cmsName}_analytics_data WHERE id = 1`
      );
    
      if (result.rows.length > 0) {
        const recentData = result.rows[0];
        console.log(`CMS ${cmsName} is down. Showing the most recently fetched data on '${recentData.timestamp}':`);
        console.log(JSON.stringify(recentData.data, null, 2));
      } else {
        console.log(`CMS ${cmsName} is down, and no recent data is available.`);
      }
    } catch (fetchError) {
      console.error(`Error fetching recent data from PostgreSQL for CMS: ${cmsName}`, fetchError);
    }
    
  }
}

/**
 * Main function that fetches analytics data from both Firebase and CMS sources.
 * It handles data fetching, processing, and saving to the PostgreSQL database.
 */
export async function fetchAnalyticsDataForAllSources() {
  try {
    // Fetch Firebase analytics
    const propertyIds = process.env.FIREBASE_PROPERTY_IDS?.split(',');
    const authClient = await authenticate();

    if (propertyIds) {
      await Promise.all(propertyIds.map(async (propertyId) => {
        const tableNamePrefix = `firebase_${propertyId}`;
        await createTablesIfNotExist(tableNamePrefix);

        const eventsData = await getEventsData(authClient, propertyId);
        await insertEventData(eventsData, tableNamePrefix);

        const userMetricsByCountry = await getUserMetricsByCountry(authClient, propertyId);
        await insertUserMetricsData(userMetricsByCountry, tableNamePrefix);

        console.log(`Data fetching complete for Firebase property ID: ${propertyId}`);
      }));
    }

    // Fetch CMS analytics data
    const cmsConfigs = await loadCMSConfigs();
    await Promise.all(cmsConfigs.map(fetchAndSaveForCMS));

    console.log('Data fetching completed for all sources');
  } catch (error) {
    console.error('Error fetching data from all sources:', error);
  }
}

// Schedule the function to run at midnight every day
cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled analytics fetch...');
  fetchAnalyticsDataForAllSources().catch((error) => console.error('Scheduled task failed:', error));
});

// Run the fetch process initially when the script starts
fetchAnalyticsDataForAllSources().catch((error) => console.error('Initial run failed:', error));
