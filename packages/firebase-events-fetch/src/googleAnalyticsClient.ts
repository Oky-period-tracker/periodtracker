import { google } from 'googleapis';
import path from 'path';

const CREDENTIALS_PATH = path.join(__dirname, '../../credentials/client_secrets.json');

// Function to authenticate the Google Analytics client
export async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  return await auth.getClient();
}
