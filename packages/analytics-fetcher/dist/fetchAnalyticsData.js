"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const loginAndFetchData = async (country) => {
    try {
        const { loginUrl, dataUrl, credentials } = config_1.cmsConfig[country];
        // Log in
        const loginResponse = await axios_1.default.post(loginUrl, new URLSearchParams({
            username: credentials.username,
            password: credentials.password,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            withCredentials: true, // Required to handle cookies
        });
        // Check login success
        if (loginResponse.status !== 200) {
            throw new Error('Login failed');
        }
        // Fetch analytics data using the session
        const dataResponse = await axios_1.default.get(dataUrl, {
            headers: {
                'Accept': 'application/json',
            },
            withCredentials: true, // Required to send cookies
        });
        return dataResponse.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error(`Axios error: ${error.response?.status} ${error.response?.statusText}`);
        }
        else {
            console.error(`Error: ${`error.message`}`);
        }
        throw error;
    }
};
exports.default = loginAndFetchData;
