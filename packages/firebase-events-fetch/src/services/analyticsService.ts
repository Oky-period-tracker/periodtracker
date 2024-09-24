import { google } from 'googleapis';



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

export interface UserMetrics {
  country: string;
  totalUsers: string;
  dau: string; // Daily Active Users
  mau: string; // Monthly Active Users
}



export async function getUserMetricsByCountry(authClient: any, propertyId: string): Promise<UserMetrics[]> {
  const analyticsData = google.analyticsdata('v1beta');

  // Fetch Total Users
  const totalUsersResponse = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    auth: authClient,
    requestBody: {
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'totalUsers' }], // Fetch Total Users
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    },
  });

  // Fetch DAU and MAU
  const dauMauResponse = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    auth: authClient,
    requestBody: {
      dimensions: [{ name: 'country' }],
      metrics: [
        { name: 'dauPerMau' }, // Fetch DAU per MAU
      ],
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    },
  });

  const totalUsersRows = totalUsersResponse.data.rows || [];
  const dauMauRows = dauMauResponse.data.rows || [];

  return totalUsersRows.map((row, index) => {
    const country = row.dimensionValues?.[0]?.value || 'Unknown';
    const totalUsers = row.metricValues?.[0]?.value || '0';

    const dau = dauMauRows[index]?.metricValues?.[0]?.value || '0';
    const mau = (parseInt(totalUsers) * parseFloat(dau)).toFixed(0); // Calculate MAU using DAU per MAU ratio

    return {
      country,
      totalUsers,
      dau,
      mau, 
    };
  });
}
