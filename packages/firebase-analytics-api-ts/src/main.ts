import { google } from 'googleapis';
import path from 'path';

async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../credentials/client_secrets.json'),
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  return await auth.getClient();
}

async function getUserMetrics(authClient: any, propertyId: string) {
  const analyticsData = google.analyticsdata('v1beta');

  // Request DAUs for the last 30 days
  const response = await analyticsData.properties.runReport({
    auth: authClient,
    property: `properties/${propertyId}`,
    requestBody: {
      metrics: [{ name: 'activeUsers' }], // Daily Active Users
      dateRanges: [
        { startDate: '30daysAgo', endDate: 'today' }, // 30 days period
      ],
      dimensions: [{ name: 'date' }], // Group by date to get DAUs for each day
    },
  });

  // Calculate Daily Active Users for today
  const dailyActiveUsers = response.data.rows?.[response.data.rows.length - 1].metricValues?.[0].value || '0';

  // Calculate Monthly Active Users by summing up unique users over the past 30 days
  const monthlyActiveUsers = response.data.rows?.reduce((total, row) => {
    return total + parseInt(row.metricValues?.[0].value || '0', 10);
  }, 0);

  return { dailyActiveUsers, monthlyActiveUsers };
}

async function getUsersByCountry(authClient: any, propertyId: string) {
  const analyticsData = google.analyticsdata('v1beta');

  const response = await analyticsData.properties.runReport({
    auth: authClient,
    property: `properties/${propertyId}`,
    requestBody: {
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }], // Modify this range as needed
      dimensions: [{ name: 'country' }], // Group by country
    },
  });

  const usersByCountry = response.data.rows?.map(row => ({
    country: row.dimensionValues?.[0].value || 'Unknown',
    users: row.metricValues?.[0].value || '0',
  }));

  return usersByCountry;
}

async function main() {
  const propertyId = '450226830'; // Replace with your actual property ID
  const authClient = await authenticate();
  const { dailyActiveUsers, monthlyActiveUsers } = await getUserMetrics(authClient, propertyId);
  const usersByCountry = await getUsersByCountry(authClient, propertyId);

  console.log(`Daily Active Users: ${dailyActiveUsers}`);
  console.log(`Monthly Active Users (sum of DAUs): ${monthlyActiveUsers}`);
  console.log('Users by Country:');
  usersByCountry?.forEach(user => {
    console.log(`${user.country}: ${user.users}`);
  });
}

main().catch(console.error);
