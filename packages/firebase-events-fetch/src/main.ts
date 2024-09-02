import { google } from 'googleapis';
import path from 'path';
import { scheduleAnalyticsFetch } from './config/cronConfig';
import { getEventsData, getUserMetricsByCountry, UserMetrics } from './services/analyticsService';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

// Authenticate with Google Analytics API
async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../credentials/client_secrets.json'),
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  return await auth.getClient();
}

interface EventData {
  eventName: string;
  eventCount: string;
}

export async function fetchAnalyticsData() {
  const propertyId = '450226830'; // Replace with your actual property ID
  const authClient = await authenticate();

  const eventsData: EventData[] | undefined = await getEventsData(authClient, propertyId);
  const userMetricsByCountry: UserMetrics[] | undefined = await getUserMetricsByCountry(authClient, propertyId);

  // Get the current timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Ensure timestamp is safe for filenames
  console.log(`Data fetched at: ${timestamp}`);

  // Log data to the console
  console.log('Event Data (Last 30 Days):');
  eventsData?.forEach((event: EventData) => {
    console.log(`${event.eventName}: ${event.eventCount}`);
  });

  console.log('User Metrics by Country (Last 30 Days):');
  userMetricsByCountry?.forEach((metric: UserMetrics) => {
    console.log(`Country: ${metric.country}, Total Users: ${metric.totalUsers}, DAU: ${metric.dau}, MAU: ${metric.mau}`);
  });

  // Write data to CSV files
  await writeDataToCSV(eventsData, userMetricsByCountry, timestamp);
}

// Function to write data to CSV files
async function writeDataToCSV(eventsData: EventData[] | undefined, userMetrics: UserMetrics[] | undefined, timestamp: string) {
  // Define paths for the CSV files
  const eventsCsvPath = path.join(__dirname, `../analytics_data/events_data_${timestamp}.csv`);
  const metricsCsvPath = path.join(__dirname, `../analytics_data/user_metrics_${timestamp}.csv`);

  // Ensure the directory exists
  fs.mkdirSync(path.dirname(eventsCsvPath), { recursive: true });

  // Write Event Data to CSV
  const eventsCsvWriter = createObjectCsvWriter({
    path: eventsCsvPath,
    header: [
      { id: 'eventName', title: 'Event Name' },
      { id: 'eventCount', title: 'Event Count' },
    ],
  });

  if (eventsData) {
    await eventsCsvWriter.writeRecords(eventsData);
    console.log(`Event data successfully written to ${eventsCsvPath}`);
  }

  // Write User Metrics Data to CSV
  const metricsCsvWriter = createObjectCsvWriter({
    path: metricsCsvPath,
    header: [
      { id: 'country', title: 'Country' },
      { id: 'totalUsers', title: 'Total Users' },
      { id: 'dau', title: 'Daily Active Users (DAU)' },
      { id: 'mau', title: 'Monthly Active Users (MAU)' },
    ],
  });

  if (userMetrics) {
    await metricsCsvWriter.writeRecords(userMetrics);
    console.log(`User metrics data successfully written to ${metricsCsvPath}`);
  }
}

// Schedule the analytics fetch task
scheduleAnalyticsFetch();

// Run the main function for an immediate fetch
fetchAnalyticsData().catch(console.error);
