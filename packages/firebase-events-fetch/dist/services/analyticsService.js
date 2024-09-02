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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsData = getEventsData;
exports.getUserMetricsByCountry = getUserMetricsByCountry;
const googleapis_1 = require("googleapis");
function getEventsData(authClient, propertyId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const analytics = googleapis_1.google.analyticsdata('v1beta');
        const response = yield analytics.properties.runReport({
            auth: authClient,
            property: `properties/${propertyId}`,
            requestBody: {
                dimensions: [{ name: 'eventName' }],
                metrics: [{ name: 'eventCount' }],
                dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            },
        });
        return (_a = response.data.rows) === null || _a === void 0 ? void 0 : _a.map(row => {
            var _a, _b, _c, _d;
            return ({
                eventName: ((_b = (_a = row.dimensionValues) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || 'Unknown',
                eventCount: ((_d = (_c = row.metricValues) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) || '0',
            });
        });
    });
}
function getUserMetricsByCountry(authClient, propertyId) {
    return __awaiter(this, void 0, void 0, function* () {
        const analyticsData = googleapis_1.google.analyticsdata('v1beta');
        // Fetch Total Users
        const totalUsersResponse = yield analyticsData.properties.runReport({
            property: `properties/${propertyId}`,
            auth: authClient,
            requestBody: {
                dimensions: [{ name: 'country' }],
                metrics: [{ name: 'totalUsers' }], // Fetch Total Users
                dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            },
        });
        // Fetch DAU and MAU
        const dauMauResponse = yield analyticsData.properties.runReport({
            property: `properties/${propertyId}`,
            auth: authClient,
            requestBody: {
                dimensions: [{ name: 'country' }],
                metrics: [
                    { name: 'dauPerMau' }, // Fetch DAU per MAU
                ],
                dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            },
        });
        const totalUsersRows = totalUsersResponse.data.rows || [];
        const dauMauRows = dauMauResponse.data.rows || [];
        return totalUsersRows.map((row, index) => {
            var _a, _b, _c, _d, _e, _f, _g;
            const country = ((_b = (_a = row.dimensionValues) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || 'Unknown';
            const totalUsers = ((_d = (_c = row.metricValues) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) || '0';
            const dau = ((_g = (_f = (_e = dauMauRows[index]) === null || _e === void 0 ? void 0 : _e.metricValues) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.value) || '0';
            const mau = (parseInt(totalUsers) * parseFloat(dau)).toFixed(0); // Calculate MAU using DAU per MAU ratio
            return {
                country,
                totalUsers,
                dau,
                mau,
            };
        });
    });
}
