import cron from 'node-cron';
import { fetchAnalyticsData } from '../main';

export function scheduleAnalyticsFetch() {
  cron.schedule('0 0 * * *', () => {
    console.log('Fetching daily analytics data...');
    fetchAnalyticsData().catch(console.error);
  });
}
