// src/main.ts

import { authenticate } from './utils/googleAnalyticsClient';
import { getUserMetrics, getUsersByCountry } from './services/analyticsService';
import { scheduleAnalyticsFetch } from './config/cronConfig';

// Call the function to schedule analytics fetch
scheduleAnalyticsFetch();

// Main function to fetch analytics data
export async function main() {
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
