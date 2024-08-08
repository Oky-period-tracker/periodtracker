import cron from 'node-cron';
import { main } from '../main';

// Function to schedule analytics fetching
export function scheduleAnalyticsFetch() {
  // Schedule the task to run daily at midnight
  cron.schedule('0 0 * * *', () => {
    console.log('Running scheduled task: Fetching analytics events');
    main().catch(console.error);
  });
}
