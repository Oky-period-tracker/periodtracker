import { google } from 'googleapis';
import path from 'path';
import { scheduleAnalyticsFetch } from './config/cronConfig';
import { getEventsData } from './services/analyticsService';

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

export async function main() {
  const propertyId = '450226830'; // Replace with your actual property ID
  const authClient = await authenticate();

  const eventsData: EventData[] | undefined = await getEventsData(authClient, propertyId);

  console.log('Event Data (Last 30 Days):');
  eventsData?.forEach((event: EventData) => {
    console.log(`${event.eventName}: ${event.eventCount}`);
  });
}

scheduleAnalyticsFetch();
main().catch(console.error);
