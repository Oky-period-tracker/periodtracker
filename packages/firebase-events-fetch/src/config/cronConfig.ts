// Import the `cron` module, which allows us to schedule tasks to run at specific intervals.
import cron from 'node-cron';
// Import the `fetchAnalyticsData` function from the main module, which is responsible for fetching the analytics data.
import { fetchAnalyticsData } from '../main';

/**
 * Function to schedule the daily fetching of analytics data.
 * This function sets up a cron job that runs once a day at midnight.
 */
export function scheduleAnalyticsFetch() {
  // Schedule a cron job using `node-cron`.
  // The cron expression '0 0 * * *' means the job will run at midnight (00:00) every day.
  cron.schedule('0 0 * * *', () => {
    // Log a message to the console to indicate that the daily fetch is starting.
    console.log('Fetching daily analytics data...');
    // Call the `fetchAnalyticsData` function to fetch the data.
    // If an error occurs during data fetching, it will be caught and logged to the console.
    fetchAnalyticsData().catch(console.error);
  });
}
