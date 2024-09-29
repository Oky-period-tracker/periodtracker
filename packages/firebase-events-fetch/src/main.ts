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

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: parseInt(process.env.PG_PORT || '5432', 10),
});

interface EventData {
  eventName: string;
  eventCount: string;
}

async function createTableIfNotExists(tableName: string, columns: string) {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id SERIAL PRIMARY KEY,
        ${columns}
      )
    `;
    await pool.query(createTableQuery);
    console.log(`Table "${tableName}" checked/created`);
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
  }
}

async function saveDataToSeparateTables(cmsName: string, data: any) {
  const tablesData = {
    usersLocations: data.usersLocations,
    usersGenders: data.usersGenders,
    usersAgeGroups: data.usersAgeGroups,
    usersCountries: data.usersCountries,
    usersProvinces: data.usersProvinces,
    usersShares: data.usersShares,
    directDownloads: data.directDownloads,
  };

  for (const [key, value] of Object.entries(tablesData)) {
    if (value && Array.isArray(value) && value.length > 0) {
      const tableName = `${cmsName}_${key}`;
      const columns = Object.keys(value[0])
        .map(column => `"${column.replace(/[\s\-\[\]]+/g, '_').toLowerCase()}" TEXT`)
        .join(", ");
      
      // Create table if not exists
      await createTableIfNotExists(tableName, columns);

      // Insert data into the table
      await insertDataIntoTable(tableName, value);
    } else if (value && typeof value === 'object' && (key === 'usersCountries' || key === 'usersProvinces')) {
      const tableName = `${cmsName}_${key}`;

      // Create columns dynamically based on country or province names
      const allColumns = new Set<string>();
      const insertData = [];

      for (const [mainKey, subObj] of Object.entries(value)) {
        const row: Record<string, any> = {};
        for (const [subKey, count] of Object.entries(subObj as Record<string, any>)) {
          const columnName = `${mainKey}_${subKey}`.replace(/[\s\-\[\]]+/g, '_').toLowerCase();
          row[columnName] = parseInt(count as string, 10) || 0;
          allColumns.add(columnName);
        }
        insertData.push(row);
      }

      // Generate the column definitions for the table
      const columnsSQL = Array.from(allColumns)
        .map(column => `"${column}" INTEGER DEFAULT 0`)
        .join(", ");

      // Create the table with dynamic columns
      await createTableIfNotExists(tableName, columnsSQL);

      // Insert the data into the table
      await insertDynamicDataIntoTable(tableName, insertData, allColumns);
      console.log(`Data inserted into table "${tableName}"`);
    }
  }
}




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




async function insertDataIntoTable(tableName: string, data: any[]) {
  if (data.length === 0) return;

  try {
    // Clear the table before inserting new data
    await pool.query(`DELETE FROM ${tableName}`);

    const keys = Object.keys(data[0]);
    const columns = keys.map((key) => `"${key}"`).join(", ");
    const valuesPlaceholders = keys.map((_, index) => `$${index + 1}`).join(", ");

    const insertQuery = `
      INSERT INTO ${tableName} (${columns})
      VALUES (${valuesPlaceholders})
    `;

    for (const row of data) {
      const values = keys.map((key) => row[key]);
      await pool.query(insertQuery, values);
    }

    console.log(`Data replaced in table "${tableName}"`);
  } catch (error) {
    console.error(`Error inserting data into table ${tableName}:`, error);
  }
}


// This function definition was missing in the original code
async function fetchAndSaveForCMS(cmsConfig: any) {
  const { name, loginUrl, username, password, endpoint } = cmsConfig;
  const cmsName = name || loginUrl.replace(/^https?:\/\//, '').split('.')[0];

  try {
    console.log(`Fetching data for CMS: ${cmsName}`);
    const cookies = await loginToCMS(loginUrl, username, password);
    const responseData = await fetchAnalyticsDataForCMS(endpoint, cookies);

    const filteredData = {
      usersLocations: responseData.usersLocations,
      usersGenders: responseData.usersGenders,
      usersAgeGroups: responseData.usersAgeGroups,
      usersCountries: responseData.usersCountries,
      usersProvinces: responseData.usersProvinces,
      usersShares: responseData.usersShares,
      directDownloads: responseData.directDownloads,
    };

    await saveDataToSeparateTables(cmsName, filteredData);
    console.log(`Data saved for CMS: ${cmsName}`);
  } catch (error) {
    console.error(`Error fetching data from CMS: ${cmsName}`, error);
  }
}

export async function fetchAnalyticsDataForCMSMain() {
  try {
    const cmsConfigs = await loadCMSConfigs();
    await Promise.all(cmsConfigs.map(fetchAndSaveForCMS));

    console.log('Data fetching completed for all CMS sources');
  } catch (error) {
    console.error('Error fetching data from CMS sources:', error);
  }
}

// Schedule the function to run at midnight every day
cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled CMS analytics fetch...');
  fetchAnalyticsDataForCMSMain().catch((error) => console.error('Scheduled task failed:', error));
});

// Schedule the function to run at midnight every day
cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled analytics fetch for Firebase...');
  fetchAnalyticsDataForFirebase().catch((error) => console.error('Scheduled task failed:', error));
});

// Run the fetch process initially when the script starts
fetchAnalyticsDataForCMSMain().catch((error) => console.error('Initial run failed:', error));







/**
 * Formats a JavaScript Date object into a PostgreSQL-compatible DATETIME string.
 * @param date - The JavaScript Date object to format.
 * @returns A formatted string in the 'YYYY-MM-DD HH:MM:SS' format.
 */
function formatDateForPostgreSQL(date: Date): string {
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



/**
 * Creates necessary tables in the PostgreSQL database if they do not exist for the given Firebase project.
 * @param tableNamePrefix - The prefix used to create the tables specific to each Firebase property ID.
 */
async function createFirebaseTablesIfNotExist(tableNamePrefix: string) {
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
 * Main function that fetches analytics data from Firebase.
 * It handles data fetching, processing, and saving to the PostgreSQL database.
 */
export async function fetchAnalyticsDataForFirebase() {
  try {
    // Fetch Firebase analytics
    const propertyIds = process.env.FIREBASE_PROPERTY_IDS?.split(',');
    const authClient = await authenticate();

    if (propertyIds) {
      await Promise.all(propertyIds.map(async (propertyId) => {
        const tableNamePrefix = `firebase_${propertyId}`;
        await createFirebaseTablesIfNotExist(tableNamePrefix);

        const eventsData = await getEventsData(authClient, propertyId);
        await insertEventData(eventsData, tableNamePrefix);

        const userMetricsByCountry = await getUserMetricsByCountry(authClient, propertyId);
        await insertUserMetricsData(userMetricsByCountry, tableNamePrefix);

        console.log(`Data fetching complete for Firebase property ID: ${propertyId}`);
      }));
    }

    console.log('Data fetching completed for Firebase');
  } catch (error) {
    console.error('Error fetching data from Firebase:', error);
  }
}



// Run the fetch process initially when the script starts
fetchAnalyticsDataForFirebase().catch((error) => console.error('Initial run failed:', error));


/**
 * Sanitizes a string by removing non-UTF8 characters.
 * @param input - The string to sanitize.
 * @returns A sanitized UTF8-compatible string.
 */
function sanitizeString(input: string): string {
  if (typeof input === 'string') {
    return input.replace(/[^\x00-\x7F]/g, ''); // Remove non-UTF8 characters
  }
  return input;
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
    sanitizeString(metric.country),
    Math.floor(parseFloat(metric.dau))
  ]);
  const monthlyValues = userMetrics.map(metric => [
    new Date().toISOString().slice(0, 7),
    sanitizeString(metric.country),
    parseInt(metric.mau, 10)
  ]);
  const totalValues = userMetrics.map(metric => [
    sanitizeString(metric.country),
    parseInt(metric.totalUsers, 10)
  ]);

  const dailyQuery = `
    INSERT INTO ${tableNamePrefix}_daily_active_users (date, country, active_users)
    VALUES ${dailyValues.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')}
    ON CONFLICT (date, country) DO UPDATE SET
      active_users = EXCLUDED.active_users;
  `;
  const monthlyQuery = `
    INSERT INTO ${tableNamePrefix}_monthly_active_users (month_year, country, active_users)
    VALUES ${monthlyValues.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')}
    ON CONFLICT (month_year, country) DO UPDATE SET
      active_users = EXCLUDED.active_users;
  `;
  const totalQuery = `
    INSERT INTO ${tableNamePrefix}_total_users (country, total_users)
    VALUES ${totalValues.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')}
    ON CONFLICT (country) DO UPDATE SET
      total_users = EXCLUDED.total_users;
  `;

  try {
    await pool.query(dailyQuery, dailyValues.flat());
    await pool.query(monthlyQuery, monthlyValues.flat());
    await pool.query(totalQuery, totalValues.flat());
    console.log(`User metrics data inserted for prefix ${tableNamePrefix}`);
  } catch (error) {
    console.error(`Error inserting user metrics data for prefix ${tableNamePrefix}:`, error);
  }
}

/**
 * Inserts or updates event data fetched from Firebase Analytics into the PostgreSQL table.
 * @param eventsData - Array of event data to be inserted or updated.
 * @param tableNamePrefix - The prefix used to identify the specific table.
 */
async function insertEventData(eventsData: EventData[] | undefined, tableNamePrefix: string) {
  if (eventsData && eventsData.length > 0) {
    const values = eventsData.map(event => [
      sanitizeString(event.eventName),
      new Date().toISOString().slice(0, 10), // Only the date part
      'unknown_user',
      'unknown_country',
      parseInt(event.eventCount, 10)
    ]);

    const query = `
      INSERT INTO ${tableNamePrefix}_events_data (event_type, event_timestamp, user_id, country, event_count)
      VALUES ${values.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(', ')}
      ON CONFLICT (event_type, event_timestamp, user_id, country)
      DO UPDATE SET
        event_count = EXCLUDED.event_count,
        event_timestamp = EXCLUDED.event_timestamp;
    `;

    try {
      await pool.query(query, values.flat());
      console.log('Bulk event data inserted/replaced.');
    } catch (error) {
      console.error('Error inserting/replacing bulk event data:', error);
    }
  }
}

/**
 * Inserts key-value data into the specified PostgreSQL table after sanitizing it.
 * @param tableName - The name of the table to insert the data into.
 * @param data - Array of data objects to insert.
 */
async function insertKeyValueDataIntoTable(tableName: string, data: any[]) {
  if (data.length === 0) return;

  try {
    // Clear the table before inserting new data
    await pool.query(`DELETE FROM ${tableName}`);

    const insertQuery = `
      INSERT INTO ${tableName} (location_name, count)
      VALUES ($1, $2)
    `;

    for (const row of data) {
      await pool.query(insertQuery, [sanitizeString(row.location_name), row.count]);
    }

    console.log(`Data replaced in table "${tableName}"`);
  } catch (error) {
    console.error(`Error inserting data into table ${tableName}:`, error);
  }
}

/**
 * Inserts dynamic data into the specified PostgreSQL table with sanitized column names.
 * @param tableName - The name of the table to insert the data into.
 * @param data - Array of data objects to insert.
 * @param allColumns - Set of all column names for the table.
 */
async function insertDynamicDataIntoTable(tableName: string, data: any[], allColumns: Set<string>) {
  if (data.length === 0) return;

  try {
    // Clear the table before inserting new data
    await pool.query(`TRUNCATE TABLE ${tableName}`);

    for (const row of data) {
      const columns = Array.from(allColumns).map(col => `"${col}"`).join(", ");
      const valuesPlaceholders = Array.from(allColumns).map((_, index) => `$${index + 1}`).join(", ");
      const values = Array.from(allColumns).map(col => row[col] || 0);

      const insertQuery = `
        INSERT INTO ${tableName} (${columns})
        VALUES (${valuesPlaceholders})
      `;
      await pool.query(insertQuery, values);
    }

    console.log(`Data replaced in table "${tableName}"`);
  } catch (error) {
    console.error(`Error inserting data into table ${tableName}:`, error);
  }
}

