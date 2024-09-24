import cron from 'node-cron';
import { fetchAnalyticsDataForAllSources } from '../main';

export function scheduleAnalyticsFetch() {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled analytics fetch...');
    await fetchAnalyticsDataForAllSources();
  });
}
