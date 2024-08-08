import { google } from 'googleapis';

// Function to get daily and monthly active users
export async function getUserMetrics(authClient: any, propertyId: string) {
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

// Function to get users by country
export async function getUsersByCountry(authClient: any, propertyId: string) {
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
