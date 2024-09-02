"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAnalyticsData = fetchAnalyticsData;
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const cronConfig_1 = require("./config/cronConfig");
const analyticsService_1 = require("./services/analyticsService");
const csv_writer_1 = require("csv-writer");
const fs_1 = __importDefault(require("fs"));
// Authenticate with Google Analytics API
function authenticate() {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: path_1.default.join(__dirname, '../credentials/client_secrets.json'),
            scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
        });
        return yield auth.getClient();
    });
}
function fetchAnalyticsData() {
    return __awaiter(this, void 0, void 0, function* () {
        const propertyId = '450226830'; // Replace with your actual property ID
        const authClient = yield authenticate();
        const eventsData = yield (0, analyticsService_1.getEventsData)(authClient, propertyId);
        const userMetricsByCountry = yield (0, analyticsService_1.getUserMetricsByCountry)(authClient, propertyId);
        // Get the current timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Ensure timestamp is safe for filenames
        console.log(`Data fetched at: ${timestamp}`);
        // Log data to the console
        console.log('Event Data (Last 30 Days):');
        eventsData === null || eventsData === void 0 ? void 0 : eventsData.forEach((event) => {
            console.log(`${event.eventName}: ${event.eventCount}`);
        });
        console.log('User Metrics by Country (Last 30 Days):');
        userMetricsByCountry === null || userMetricsByCountry === void 0 ? void 0 : userMetricsByCountry.forEach((metric) => {
            console.log(`Country: ${metric.country}, Total Users: ${metric.totalUsers}, DAU: ${metric.dau}, MAU: ${metric.mau}`);
        });
        // Write data to CSV files
        yield writeDataToCSV(eventsData, userMetricsByCountry, timestamp);
    });
}
// Function to write data to CSV files
function writeDataToCSV(eventsData, userMetrics, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        // Define paths for the CSV files
        const eventsCsvPath = path_1.default.join(__dirname, `../analytics_data/events_data_${timestamp}.csv`);
        const metricsCsvPath = path_1.default.join(__dirname, `../analytics_data/user_metrics_${timestamp}.csv`);
        // Ensure the directory exists
        fs_1.default.mkdirSync(path_1.default.dirname(eventsCsvPath), { recursive: true });
        // Write Event Data to CSV
        const eventsCsvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: eventsCsvPath,
            header: [
                { id: 'eventName', title: 'Event Name' },
                { id: 'eventCount', title: 'Event Count' },
            ],
        });
        if (eventsData) {
            yield eventsCsvWriter.writeRecords(eventsData);
            console.log(`Event data successfully written to ${eventsCsvPath}`);
        }
        // Write User Metrics Data to CSV
        const metricsCsvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: metricsCsvPath,
            header: [
                { id: 'country', title: 'Country' },
                { id: 'totalUsers', title: 'Total Users' },
                { id: 'dau', title: 'Daily Active Users (DAU)' },
                { id: 'mau', title: 'Monthly Active Users (MAU)' },
            ],
        });
        if (userMetrics) {
            yield metricsCsvWriter.writeRecords(userMetrics);
            console.log(`User metrics data successfully written to ${metricsCsvPath}`);
        }
    });
}
// Schedule the analytics fetch task
(0, cronConfig_1.scheduleAnalyticsFetch)();
// Run the main function for an immediate fetch
fetchAnalyticsData().catch(console.error);
