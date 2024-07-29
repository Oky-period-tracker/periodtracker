import * as fs from 'fs';

interface EventData {
  user_id: string;
  event_name: string;
  event_params: any; // Assuming event_params is an object
  event_timestamp: string;
}

// Read JSON data from a file
const rawData = fs.readFileSync('./dataset.json', 'utf8');
const data: EventData[] = JSON.parse(rawData);

const transformedData = data.map(record => ({
  user_id: record.user_id,
  event_name: record.event_name,
  event_params: record.event_params, // Or transform this if needed
  event_timestamp: new Date(record.event_timestamp).toISOString(),
}));

// Write transformed data back to a JSON file
fs.writeFileSync('transformed-data.json', JSON.stringify(transformedData, null, 2));

console.log('Transformation complete!');
