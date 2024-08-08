import { google } from 'googleapis';
import path from 'path';
// src/main.ts

import { scheduleAnalyticsFetch } from './config/cronConfig';

// Call the function to schedule analytics fetch
scheduleAnalyticsFetch();


async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../credentials/client_secrets.json'),
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  return await auth.getClient();
}

async function getUserMetrics(authClient: any, propertyId: string) {
  const analyticsData = google.analyticsdata('v1beta');

  // Request DAUs for today
  const dailyResponse = await analyticsData.properties.runReport({
    auth: authClient,
    property: `properties/${propertyId}`,
    requestBody: {
      metrics: [{ name: 'activeUsers' }], // Daily Active Users
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
    },
  });

  // Request MAUs for the last 30 days
  const monthlyResponse = await analyticsData.properties.runReport({
    auth: authClient,
    property: `properties/${propertyId}`,
    requestBody: {
      metrics: [{ name: 'active28DayUsers' }], // Monthly Active Users
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    },
  });

  const dailyActiveUsers =
    dailyResponse.data.rows?.[0]?.metricValues?.[0]?.value || '0';
  const monthlyActiveUsers =
    monthlyResponse.data.rows?.[0]?.metricValues?.[0]?.value || '0';

  return { dailyActiveUsers, monthlyActiveUsers };
}

async function getUsersByCountry(authClient: any, propertyId: string) {
  const analyticsData = google.analyticsdata('v1beta');

  // Request active users by country for the last 30 days
  const response = await analyticsData.properties.runReport({
    auth: authClient,
    property: `properties/${propertyId}`,
    requestBody: {
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }], // 30 days data
      dimensions: [{ name: 'country' }],
    },
  });

  const usersByCountry = response.data.rows?.map((row) => ({
    country: row.dimensionValues?.[0]?.value || 'Unknown',
    users: row.metricValues?.[0]?.value || '0',
  }));

  // Debug logging for better insights
  console.log('Raw response for users by country:', JSON.stringify(response.data, null, 2));

  return usersByCountry;
}

async function main() {
  const propertyId = '450226830'; // Replace with your actual property ID
  const authClient = await authenticate();
  const { dailyActiveUsers, monthlyActiveUsers } = await getUserMetrics(
    authClient,
    propertyId
  );
  const usersByCountry = await getUsersByCountry(authClient, propertyId);

  console.log(`Daily Active Users (Today): ${dailyActiveUsers}`);
  console.log(`Monthly Active Users (Last 30 Days): ${monthlyActiveUsers}`);
  console.log('Users by Country (Last 30 Days):');
  usersByCountry?.forEach((user) => {
    console.log(`${user.country}: ${user.users}`);
  });
}

main().catch(console.error);
