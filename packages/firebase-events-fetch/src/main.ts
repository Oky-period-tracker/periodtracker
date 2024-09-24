import { google } from 'googleapis';
import path from 'path';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

import { scheduleAnalyticsFetch } from './config/cronConfig';
import { getEventsData, getUserMetricsByCountry, UserMetrics } from './services/analyticsService';

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
    console.log('Authentication successful.');
    return await auth.getClient();
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
}

interface EventData {
  eventName: string;
  eventCount: string;
}

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Function to create tables if they do not exist
async function createTablesIfNotExist(tableNamePrefix: string) {
  const createEventTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableNamePrefix}_events_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_type VARCHAR(255) NOT NULL,
      event_timestamp DATETIME NOT NULL,
      user_id VARCHAR(255) DEFAULT 'unknown_user',
      country VARCHAR(255) DEFAULT 'unknown_country',
      event_count INT DEFAULT 0,
      UNIQUE KEY unique_event (event_type, event_timestamp, user_id, country)
    );
  `;

  const createDailyActiveUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableNamePrefix}_daily_active_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      country VARCHAR(255) DEFAULT 'unknown_country',
      active_users INT DEFAULT 0,
      UNIQUE KEY unique_daily_active (date, country)
    );
  `;

  const createMonthlyActiveUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableNamePrefix}_monthly_active_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      month_year VARCHAR(7) NOT NULL,
      country VARCHAR(255) DEFAULT 'unknown_country',
      active_users INT DEFAULT 0,
      UNIQUE KEY unique_monthly_active (month_year, country)
    );
  `;

  const createTotalUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableNamePrefix}_total_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      country VARCHAR(255) DEFAULT 'unknown_country',
      total_users INT DEFAULT 0,
      UNIQUE KEY unique_total_users (country)
    );
  `;

  try {
    await pool.execute(createEventTableQuery);
    await pool.execute(createDailyActiveUsersTableQuery);
    await pool.execute(createMonthlyActiveUsersTableQuery);
    await pool.execute(createTotalUsersTableQuery);
    console.log(`Tables created or verified for prefix: ${tableNamePrefix}`);
  } catch (error) {
    console.error(`Error creating tables for prefix ${tableNamePrefix}:`, error);
  }
}

async function insertEventData(eventsData: EventData[] | undefined, tableNamePrefix: string) {
  if (eventsData && eventsData.length > 0) {
    const values = eventsData.map(event => [
      event.eventName,
      formatDateForMySQL(new Date()),
      'unknown_user',
      'unknown_country',
      parseInt(event.eventCount, 10)
    ]);

    const query = `
      INSERT INTO ${tableNamePrefix}_events_data (event_type, event_timestamp, user_id, country, event_count)
      VALUES ${values.map(() => '(?, ?, ?, ?, ?)').join(', ')}
      ON DUPLICATE KEY UPDATE
        event_count = VALUES(event_count),
        event_timestamp = VALUES(event_timestamp);
    `;

    try {
      await pool.execute(query, values.flat());
      console.log('Bulk event data inserted.');
    } catch (error) {
      console.error('Error inserting bulk event data:', error);
    }
  } else {
    try {
      await pool.execute(`
        INSERT INTO ${tableNamePrefix}_events_data (event_type, event_timestamp, user_id, country, event_count)
        VALUES ('no_event', ?, 'unknown_user', 'unknown_country', 0)
        ON DUPLICATE KEY UPDATE
          event_count = VALUES(event_count),
          event_timestamp = VALUES(event_timestamp);
      `, [formatDateForMySQL(new Date())]);

      console.log('Inserted default event data with count 0.');
    } catch (error) {
      console.error('Error inserting default event data:', error);
    }
  }
}

async function insertDailyActiveUsers(userMetrics: UserMetrics[] | undefined, tableNamePrefix: string) {
  if (userMetrics && userMetrics.length > 0) {
    const values = userMetrics.map(metric => [
      new Date().toISOString().slice(0, 10),
      metric.country,
      Math.floor(parseFloat(metric.dau))
    ]);

    const query = `
      INSERT INTO ${tableNamePrefix}_daily_active_users (date, country, active_users)
      VALUES ${values.map(() => '(?, ?, ?)').join(', ')}
      ON DUPLICATE KEY UPDATE
        active_users = VALUES(active_users);
    `;

    try {
      await pool.execute(query, values.flat());
      console.log('Bulk daily active users data inserted.');
    } catch (error) {
      console.error('Error inserting bulk daily active users:', error);
    }
  } else {
    try {
      await pool.execute(`
        INSERT INTO ${tableNamePrefix}_daily_active_users (date, country, active_users)
        VALUES (?, 'United Kingdom', 0)
        ON DUPLICATE KEY UPDATE
          active_users = VALUES(active_users);
      `, [new Date().toISOString().slice(0, 10)]);

      console.log('Inserted default daily active users with count 0.');
    } catch (error) {
      console.error('Error inserting default daily active users with count 0:', error);
    }
  }
}

async function insertMonthlyActiveUsers(userMetrics: UserMetrics[] | undefined, tableNamePrefix: string) {
  if (userMetrics && userMetrics.length > 0) {
    const values = userMetrics.map(metric => [
      new Date().toISOString().slice(0, 7),
      metric.country,
      parseInt(metric.mau, 10)
    ]);

    const query = `
      INSERT INTO ${tableNamePrefix}_monthly_active_users (month_year, country, active_users)
      VALUES ${values.map(() => '(?, ?, ?)').join(', ')}
      ON DUPLICATE KEY UPDATE
        active_users = VALUES(active_users);
    `;

    try {
      await pool.execute(query, values.flat());
      console.log('Bulk monthly active users data inserted.');
    } catch (error) {
      console.error('Error inserting bulk monthly active users:', error);
    }
  } else {
    console.log('No monthly active users data found.');
  }
}

async function insertTotalUsers(userMetrics: UserMetrics[] | undefined, tableNamePrefix: string) {
  if (userMetrics && userMetrics.length > 0) {
    const values = userMetrics.map(metric => [
      metric.country,
      parseInt(metric.totalUsers, 10)
    ]);

    const query = `
      INSERT INTO ${tableNamePrefix}_total_users (country, total_users)
      VALUES ${values.map(() => '(?, ?)').join(', ')}
      ON DUPLICATE KEY UPDATE
        total_users = VALUES(total_users);
    `;

    try {
      await pool.execute(query, values.flat());
      console.log('Bulk total users data inserted.');
    } catch (error) {
      console.error('Error inserting bulk total users:', error);
    }
  } else {
    console.log('No total users data found.');
  }
}

export async function fetchAnalyticsDataForMultipleFirebases() {
  const propertyIds = process.env.FIREBASE_PROPERTY_IDS?.split(',');

  if (!propertyIds || propertyIds.length === 0) {
    console.error('No property IDs found in environment variables.');
    return;
  }

  try {
    const authClient = await authenticate();

    await Promise.all(propertyIds.map(async (propertyId) => {
      console.log(`Fetching data for Firebase property ID: ${propertyId}`);
      const tableNamePrefix = `firebase_${propertyId}`;
      
      await createTablesIfNotExist(tableNamePrefix);
      
      const eventsData: EventData[] | undefined = await getEventsData(authClient, propertyId);
      await insertEventData(eventsData, tableNamePrefix);

      const userMetricsByCountry: UserMetrics[] | undefined = await getUserMetricsByCountry(authClient, propertyId);

      await insertDailyActiveUsers(userMetricsByCountry, tableNamePrefix);
      await insertMonthlyActiveUsers(userMetricsByCountry, tableNamePrefix);
      await insertTotalUsers(userMetricsByCountry, tableNamePrefix);

      console.log(`Data fetching complete for Firebase property ID: ${propertyId}`);
    }));
  } catch (error) {
    console.error('Error during analytics data fetch for multiple Firebases:', error);
  }
}

scheduleAnalyticsFetch();
fetchAnalyticsDataForMultipleFirebases().catch(console.error);
