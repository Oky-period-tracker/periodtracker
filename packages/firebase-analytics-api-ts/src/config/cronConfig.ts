// src/config/cronConfig.ts
import cron from 'node-cron';

const scheduleAnalyticsFetch = () => {
  console.log('Scheduling analytics fetch...');
  cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled task...');
    await fetchAnalyticsData();
  });
  console.log('Scheduled analytics fetch.');
};

async function fetchAnalyticsData() {
  console.log('Starting data fetch...');
  // Add your data fetching logic here
  console.log('Data fetch complete.');
}


export { scheduleAnalyticsFetch };
