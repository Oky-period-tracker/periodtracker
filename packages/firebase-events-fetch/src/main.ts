import { google } from 'googleapis';
import path from 'path';
import { scheduleAnalyticsFetch } from './config/cronConfig';
import { getEventsData, getUserMetricsByCountry, UserMetrics } from './services/analyticsService';

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
  const timestamp = new Date().toISOString();

  console.log(`Data fetched at: ${timestamp}`);
  console.log('Event Data (Last 30 Days):');
  eventsData?.forEach((event: EventData) => {
    console.log(`${event.eventName}: ${event.eventCount}`);
  });

  console.log('User Metrics by Country (Last 30 Days):');
  userMetricsByCountry?.forEach((metric: UserMetrics) => {
    console.log(`Country: ${metric.country} (${metric.countryCode}), Total Users: ${metric.activeUsers}, DAU: ${metric.dau}, MAU: ${metric.mau}`);
  });
}

// Schedule the analytics fetch task
scheduleAnalyticsFetch();

// Run the main function for an immediate fetch
fetchAnalyticsData().catch(console.error);
