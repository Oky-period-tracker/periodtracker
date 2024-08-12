import { google } from 'googleapis';

export interface UserMetrics {
  country: string;
  countryCode: string; // Country code
  activeUsers: string; // Total active users
  dau: string;         // Daily active users
  mau: string;         // Monthly active users
}

export async function getEventsData(authClient: any, propertyId: string) {
  const analytics = google.analyticsdata('v1beta');

  const response = await analytics.properties.runReport({
    auth: authClient,
    property: `properties/${propertyId}`,
    requestBody: {
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    },
  });

  return response.data.rows?.map(row => ({
    eventName: row.dimensionValues?.[0]?.value || 'Unknown',
    eventCount: row.metricValues?.[0]?.value || '0',
  }));
}

export async function getUserMetricsByCountry(authClient: any, propertyId: string): Promise<UserMetrics[]> {
  const analyticsData = google.analyticsdata('v1beta');

  const response = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    auth: authClient,
    requestBody: {
      dimensions: [
        { name: 'country' },
        { name: 'countryIsoCode' } // Country ISO Code
      ],
      metrics: [
        { name: 'activeUsers' },    // Total active users
        { name: 'active1DayUsers' }, // Daily active users
        { name: 'active28DayUsers' } // Monthly active users
      ],
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    },
  });

  const rows = response.data.rows || [];

  return rows.map(row => ({
    country: row.dimensionValues?.[0]?.value || 'Unknown',
    countryCode: row.dimensionValues?.[1]?.value || 'Unknown', // Country code
    activeUsers: row.metricValues?.[0]?.value || '0',  // Total active users
    dau: row.metricValues?.[1]?.value || '0',          // Daily active users
    mau: row.metricValues?.[2]?.value || '0',          // Monthly active users
  }));
}
