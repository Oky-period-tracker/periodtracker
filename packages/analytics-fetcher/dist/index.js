"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchAnalyticsData_1 = __importDefault(require("./fetchAnalyticsData"));
const config_1 = require("./config");
const fetchAllAnalytics = async () => {
    for (const country of Object.keys(config_1.cmsConfig)) {
        try {
            const data = await (0, fetchAnalyticsData_1.default)(country);
            console.log(`Analytics data for ${country}:`, data);
        }
        catch (error) {
            console.error(`Failed to fetch analytics for ${country}`);
        }
    }
};
fetchAllAnalytics();
