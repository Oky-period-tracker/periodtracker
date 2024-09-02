"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleAnalyticsFetch = scheduleAnalyticsFetch;
// Import the `cron` module, which allows us to schedule tasks to run at specific intervals.
const node_cron_1 = __importDefault(require("node-cron"));
// Import the `fetchAnalyticsData` function from the main module, which is responsible for fetching the analytics data.
const main_1 = require("../main");
/**
 * Function to schedule the daily fetching of analytics data.
 * This function sets up a cron job that runs once a day at midnight.
 */
function scheduleAnalyticsFetch() {
    // Schedule a cron job using `node-cron`.
    // The cron expression '0 0 * * *' means the job will run at midnight (00:00) every day.
    node_cron_1.default.schedule('0 0 * * *', () => {
        // Log a message to the console to indicate that the daily fetch is starting.
        console.log('Fetching daily analytics data...');
        // Call the `fetchAnalyticsData` function to fetch the data.
        // If an error occurs during data fetching, it will be caught and logged to the console.
        (0, main_1.fetchAnalyticsData)().catch(console.error);
    });
}
