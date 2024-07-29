"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Read JSON data from a file
var rawData = fs.readFileSync('./dataset.json', 'utf8');
var data = JSON.parse(rawData);
var transformedData = data.map(function (record) { return ({
    user_id: record.user_id,
    event_name: record.event_name,
    event_params: record.event_params, // Or transform this if needed
    event_timestamp: new Date(record.event_timestamp).toISOString(),
}); });
// Write transformed data back to a JSON file
fs.writeFileSync('transformed-data.json', JSON.stringify(transformedData, null, 2));
console.log('Transformation complete!');
