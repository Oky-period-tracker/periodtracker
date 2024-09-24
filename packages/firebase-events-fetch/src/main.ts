import axios, { AxiosResponse } from 'axios';
import { google } from 'googleapis';
import path from 'path';
import mysql from 'mysql2/promise';
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

function formatDateForMySQL(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

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

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

async function createTablesIfNotExist(tableNamePrefix: string) {
  const createQueries = [
    `CREATE TABLE IF NOT EXISTS ${tableNamePrefix}_events_data (
      event_type VARCHAR(255) NOT NULL,
      event_timestamp DATE NOT NULL,
      user_id VARCHAR(255) DEFAULT 'unknown_user',
      country VARCHAR(255) DEFAULT 'unknown_country',
      event_count INT DEFAULT 0,
      UNIQUE KEY unique_event (event_type, event_timestamp, user_id, country)
    )`,
    `CREATE TABLE IF NOT EXISTS ${tableNamePrefix}_daily_active_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      country VARCHAR(255) DEFAULT 'unknown_country',
      active_users INT DEFAULT 0,
      UNIQUE KEY unique_daily_active (date, country)
    )`,
    `CREATE TABLE IF NOT EXISTS ${tableNamePrefix}_monthly_active_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      month_year VARCHAR(7) NOT NULL,
      country VARCHAR(255) DEFAULT 'unknown_country',
      active_users INT DEFAULT 0,
      UNIQUE KEY unique_monthly_active (month_year, country)
    )`,
    `CREATE TABLE IF NOT EXISTS ${tableNamePrefix}_total_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      country VARCHAR(255) DEFAULT 'unknown_country',
      total_users INT DEFAULT 0,
      UNIQUE KEY unique_total_users (country)
    )`
  ];

  try {
    for (const query of createQueries) {
      await pool.execute(query);
    }
    console.log(`Tables created or verified for prefix: ${tableNamePrefix}`);
  } catch (error) {
    console.error(`Error creating tables for prefix ${tableNamePrefix}:`, error);
  }
}

async function insertEventData(eventsData: EventData[] | undefined, tableNamePrefix: string) {
  if (eventsData && eventsData.length > 0) {
    const values = eventsData.map(event => [
      event.eventName,
      new Date().toISOString().slice(0, 10), // Only the date part
      'unknown_user',
      'unknown_country',
      parseInt(event.eventCount, 10)
    ]);

    const query = `
      INSERT INTO ${tableNamePrefix}_events_data (event_type, event_timestamp, user_id, country, event_count)
      VALUES ${values.map(() => '(?, ?, ?, ?, ?)').join(', ')}
      ON DUPLICATE KEY UPDATE
        event_count = VALUES(event_count),  -- Replace the old count with the new count
        event_timestamp = VALUES(event_timestamp);  -- Update the timestamp if necessary
    `;

    try {
      await pool.execute(query, values.flat());
      console.log('Bulk event data inserted/replaced.');
    } catch (error) {
      console.error('Error inserting/replacing bulk event data:', error);
    }
  }
}


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
    VALUES ${dailyValues.map(() => '(?, ?, ?)').join(', ')}
    ON DUPLICATE KEY UPDATE
      active_users = VALUES(active_users);
  `;
  const monthlyQuery = `
    INSERT INTO ${tableNamePrefix}_monthly_active_users (month_year, country, active_users)
    VALUES ${monthlyValues.map(() => '(?, ?, ?)').join(', ')}
    ON DUPLICATE KEY UPDATE
      active_users = VALUES(active_users);
  `;
  const totalQuery = `
    INSERT INTO ${tableNamePrefix}_total_users (country, total_users)
    VALUES ${totalValues.map(() => '(?, ?)').join(', ')}
    ON DUPLICATE KEY UPDATE
      total_users = VALUES(total_users);
  `;

  try {
    await pool.execute(dailyQuery, dailyValues.flat());
    await pool.execute(monthlyQuery, monthlyValues.flat());
    await pool.execute(totalQuery, totalValues.flat());
    console.log(`User metrics data inserted for prefix ${tableNamePrefix}`);
  } catch (error) {
    console.error(`Error inserting user metrics data for prefix ${tableNamePrefix}:`, error);
  }
}

// Utility functions for CMS data fetching

async function loadCMSConfigs(): Promise<any[]> {
  const cmsConfigsPath = path.join(__dirname, 'cmsConfigs.json');
  if (!fs.existsSync(cmsConfigsPath)) {
    throw new Error('CMS configuration file (cmsConfigs.json) not found');
  }
  const rawData = fs.readFileSync(cmsConfigsPath, 'utf-8');
  return JSON.parse(rawData);
}

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

async function saveCMSToMySQL(cmsName: string, data: object[]) {
  try {
    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${cmsName}_analytics_data (
        id INT PRIMARY KEY AUTO_INCREMENT,
        timestamp DATETIME NOT NULL,
        data JSON NOT NULL
      )
    `);

    // Instead of deleting all rows, use a REPLACE or INSERT ... ON DUPLICATE KEY UPDATE query to ensure id remains 1
    const insertQuery = `
      INSERT INTO ${cmsName}_analytics_data (id, timestamp, data)
      VALUES (1, ?, ?)
      ON DUPLICATE KEY UPDATE
        timestamp = VALUES(timestamp),
        data = VALUES(data);
    `;

    const timestamp = new Date();

    // Insert or update the data for id = 1
    await pool.execute(insertQuery, [timestamp, JSON.stringify(data)]);

    console.log(`Data successfully saved to MySQL for CMS: ${cmsName}`);
  } catch (err) {
    console.error(`Error saving data to MySQL for CMS: ${cmsName}`, err);
  }
}


async function fetchAndSaveForCMS(cmsConfig: any) {
  const { name, loginUrl, username, password, endpoint } = cmsConfig;
  const cmsName = name || loginUrl.replace(/^https?:\/\//, '').split('.')[0];

  try {
    console.log(`Fetching data for CMS: ${cmsName}`);
    const cookies = await loginToCMS(loginUrl, username, password);
    const responseData = await fetchAnalyticsDataForCMS(endpoint, cookies);

    const dataArray = Array.isArray(responseData) ? responseData : [responseData];
    await saveCMSToMySQL(cmsName, dataArray);
    console.log(`Fetched and saved analytics data for CMS: ${cmsName}`);
  } catch (error) {
    console.error(`Error fetching data from CMS: ${cmsName}`, error);

   // Fetch the most recent data from the database
try {
  const [rows] = await pool.query<any[]>( // Explicitly specify any[] as the expected row data type
    `SELECT timestamp, data FROM ${cmsName}_analytics_data WHERE id = 1`
  );

  if (rows.length > 0) {
    const recentData = rows[0];
    console.log(`CMS ${cmsName} is down. Showing the most recently fetched data on '${recentData.timestamp}':`);
    console.log(JSON.stringify(recentData.data, null, 2));
  } else {
    console.log(`CMS ${cmsName} is down, and no recent data is available.`);
  }
} catch (fetchError) {
  console.error(`Error fetching recent data from MySQL for CMS: ${cmsName}`, fetchError);
}

  }
}



// Main function to fetch analytics data for both Firebase and CMS
export async function fetchAnalyticsDataForAllSources() {
  try {
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

    const cmsConfigs = await loadCMSConfigs();
    await Promise.all(cmsConfigs.map(fetchAndSaveForCMS));

    console.log('Data fetching completed for all sources');
  } catch (error) {
    console.error('Error fetching data from all sources:', error);
  }
}

cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled analytics fetch...');
  fetchAnalyticsDataForAllSources().catch((error) => console.error('Scheduled task failed:', error));
});

fetchAnalyticsDataForAllSources().catch((error) => console.error('Initial run failed:', error));
