import cron from 'node-cron';
import { main } from '../main';

export function scheduleAnalyticsFetch() {
  cron.schedule('0 0 * * *', () => {
    console.log('Fetching daily analytics data...');
    main().catch(console.error);
  });
}
