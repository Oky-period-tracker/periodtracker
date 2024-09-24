import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import qs from 'qs';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

dotenv.config();

function getEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const dataFilePath = path.join(__dirname, 'recentData.json');

async function loadCMSConfigs(): Promise<any[]> {
  const cmsConfigsPath = path.join(__dirname, 'cmsConfigs.json');
  if (!fs.existsSync(cmsConfigsPath)) {
    throw new Error('CMS configuration file (cmsConfigs.json) not found');
  }
  const rawData = fs.readFileSync(cmsConfigsPath, 'utf-8');
  return JSON.parse(rawData);
}

async function login(loginUrl: string, username: string, password: string): Promise<string[]> {
  try {
    const payload = qs.stringify({ username, password });
    const response: AxiosResponse = await axios.post(loginUrl, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      maxRedirects: 0,
      validateStatus: (status) => status < 400 || status === 302,
    });
    const cookies = response.headers['set-cookie'];
    if (!cookies) {
      throw new Error('No cookies set after login');
    }
    return cookies;
  } catch (error) {
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

async function fetchAnalytics(endpoint: string, cookies: string[]): Promise<any> {
  try {
    const response: AxiosResponse = await axios.get(endpoint, {
      headers: {
        Accept: 'application/json',
        Cookie: cookies.join('; '),
      },
      maxRedirects: 0,
    });
    return response.data;
  } catch (error) {
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

function saveData(cmsName: string, data: object) {
  const cmsDataFilePath = path.join(__dirname, `${cmsName}_recentData.json`);
  fs.writeFileSync(cmsDataFilePath, JSON.stringify(data, null, 2));
}

async function getMySQLConnection() {
  return mysql.createConnection({
    host: getEnvVariable('MYSQL_HOST'),
    user: getEnvVariable('MYSQL_USER'),
    password: getEnvVariable('MYSQL_PASSWORD'),
    database: getEnvVariable('MYSQL_DATABASE'),
  });
}

async function saveDataToMySQL(cmsName: string, data: object[]) {
  const connection = await getMySQLConnection();
  try {
    // Create table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ${cmsName}_analytics_data (
        id INT PRIMARY KEY AUTO_INCREMENT,
        timestamp DATETIME NOT NULL,
        data JSON NOT NULL
      )
    `);

    const timestamp = new Date();

    // Delete all previous data to ensure only the latest data is stored
    await connection.query(`DELETE FROM ${cmsName}_analytics_data`);

    // Insert the new data into the table
    await connection.query(`REPLACE INTO ${cmsName}_analytics_data (id, timestamp, data) VALUES (?, ?, ?)`, [
      1, // Use a fixed ID to always replace the previous entry
      timestamp,
      JSON.stringify(data),
    ]);

    console.log(`Data successfully saved to MySQL for CMS: ${cmsName}`);
  } catch (err) {
    console.error(`Error saving data to MySQL for CMS: ${cmsName}`, err);
  } finally {
    connection.end();
  }
}

async function fetchAndSaveForCMS(cmsConfig: any) {
  const { loginUrl, username, password, endpoint } = cmsConfig;
  const cmsName = loginUrl.replace(/^https?:\/\//, '').split('.')[0];

  try {
    const cookies = await login(loginUrl, username, password);
    const data = await fetchAnalytics(endpoint, cookies);

    if (!data || data.length === 0) {
      console.error(`No data fetched from CMS: ${cmsName}`);
      return;
    }

    const dataArray = Array.isArray(data) ? data : [data];
    const result = { timestamp: new Date().toISOString(), data: dataArray };

    saveData(cmsName, result);
    await saveDataToMySQL(cmsName, dataArray);
    console.log(`Fetched and saved analytics data for CMS: ${cmsName}`);
    console.log('Analytics data:', JSON.stringify(result, null, 2));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Axios error for CMS: ${cmsName}`, error.message);
    } else if (error instanceof Error) {
      console.error(`Error fetching data from CMS: ${cmsName}`, error.message);
    } else {
      console.error(`Unexpected error for CMS: ${cmsName}`, error);
    }

    const lastData = getLastSavedData(cmsName);
    if (lastData) {
      console.log(`CMS ${cmsName} is down. Showing the most recent fetched data:`);
      console.log(JSON.stringify(lastData, null, 2));
    } else {
      console.log(`CMS ${cmsName} is down and no recent data is available.`);
    }
  }
}

function getLastSavedData(cmsName: string): object | null {
  const cmsDataFilePath = path.join(__dirname, `${cmsName}_recentData.json`);
  if (fs.existsSync(cmsDataFilePath)) {
    const rawData = fs.readFileSync(cmsDataFilePath, 'utf-8');
    return JSON.parse(rawData);
  }
  return null;
}

async function main() {
  try {
    const cmsConfigs = await loadCMSConfigs();
    for (const cmsConfig of cmsConfigs) {
      await fetchAndSaveForCMS(cmsConfig);
    }
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled task...');
  main().catch((error) => console.error('Scheduled task failed:', error));
});

main().catch((error) => console.error('Initial run failed:', error));
