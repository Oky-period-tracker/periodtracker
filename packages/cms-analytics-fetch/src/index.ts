import axios, { AxiosResponse } from 'axios'
import dotenv from 'dotenv'
import qs from 'qs'

dotenv.config()

function getEnvVariable(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

const loginUrl = getEnvVariable('CMS_LOGIN_URL')
const username = getEnvVariable('CMS_USERNAME')
const password = getEnvVariable('CMS_PASSWORD')
const endpoint = 'https://cms.en.oky.greychaindesign.com/analytics-management' // Hardcoded endpoint

async function login(): Promise<string[]> {
  try {
    const payload = qs.stringify({
      username,
      password,
    })

    console.log('Sending login request to:', loginUrl);
    console.log('Login payload:', payload);

    const response: AxiosResponse = await axios.post(loginUrl, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      maxRedirects: 0, // Handle redirection manually
      validateStatus: (status) => status < 400 || status === 302, // Handle 302 redirects
    })

    if (response.status === 302) {
      console.log('Login successful, redirected to:', response.headers['location']);
    } else {
      console.log('Response:', response.data);
    }

    const cookies = response.headers['set-cookie']
    if (!cookies) {
      throw new Error('No cookies set after login')
    }
    return cookies
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message)
      if (error.response) {
        console.error('Status code:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    } else {
      console.error('Error logging in:', error)
    }
    throw error
  }
}

async function fetchAnalytics(cookies: string[]): Promise<any> {
  try {
    console.log(`Fetching analytics from ${endpoint}`);
    const response: AxiosResponse = await axios.get(endpoint, {
      headers: {
        Accept: 'application/json',
        Cookie: cookies.join('; '),
      },
      maxRedirects: 0, // For debugging purposes
    })
    console.log(`Status: ${response.status}`);
    console.log(`Headers: ${JSON.stringify(response.headers)}`);
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message)
      if (error.response) {
        console.error('Status code:', error.response.status)
        console.error('Response data:', error.response.data)
      }
    } else {
      console.error('Error fetching analytics data:', error)
    }
    return null
  }
}

async function main() {
  try {
    const cookies = await login()
    const data = await fetchAnalytics(cookies)
    console.log('Fetched Analytics Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
