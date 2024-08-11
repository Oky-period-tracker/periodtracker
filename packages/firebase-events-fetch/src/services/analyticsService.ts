import { google } from 'googleapis';

export async function getEventsData(authClient: any, propertyId: string) {
  const analyticsData = google.analyticsdata('v1beta');

  const response = await analyticsData.properties.runReport({
    auth: authClient,
    property: `properties/${propertyId}`,
    requestBody: {
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    },
  });

  const eventsData = response.data.rows?.map((row) => ({
    eventName: row.dimensionValues?.[0]?.value || 'Unknown',
    eventCount: row.metricValues?.[0]?.value || '0',
  }));

  return eventsData;
}
