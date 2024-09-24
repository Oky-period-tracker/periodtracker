import cron from 'node-cron';
import { fetchAnalyticsData } from '../main'; // Assuming fetchAnalyticsData is exported from your main file

// Schedule to run the analytics data fetch task once every day at midnight
export function scheduleAnalyticsFetch() {
  // This cron job is set to run at midnight every day (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily data fetch at:', new Date().toISOString());
    await fetchAnalyticsData().catch(console.error);
  });
}
