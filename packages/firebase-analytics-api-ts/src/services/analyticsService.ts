
import { getAnalyticsData } from '../utils/googleAnalyticsClient';


export const fetchAnalyticsData = async () => {
  try {
    const data = await getAnalyticsData();
    console.log('Fetched analytics data:', data);
    // Process and store the data as needed
  } catch (error) {
    console.error('Error fetching analytics data:', error);
  }
};
