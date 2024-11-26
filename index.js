import puppeteer from 'puppeteer';
import fs from 'fs/promises'; // Use fs/promises for async file reading
import { setTimeout } from 'timers/promises';

async function loadCookies(filePath) {
  try {
    const cookiesJSON = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(cookiesJSON);
  } catch (error) {
    console.error('Error reading cookies:', error);
    return [];
  }
}

const launchProdConfig = {
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
  ignoreHTTPSErrors: true,
};


async function run() {
  const browser = await puppeteer.launch(launchProdConfig);

  const page = await browser.newPage();

  // Load cookies from the file
  const cookies = await loadCookies('./cookies.json');
  if (cookies.length > 0) {
    await page.setCookie(...cookies);
    console.log('Cookies Loaded!');
  } else {
    console.log('No cookies loaded');
  }

  const targetUrl = 'https://www.dubaievisaservices.com/visa/applyVisa.jsf';

  while (true) {
    try {
      // Navigate to the target URL
      await page.goto(targetUrl, { waitUntil: 'networkidle0' });

      if (page.url().includes('login')) {
        console.log('Session Expired');
        // await browser.close()
        // break;
      } else {
        console.log('Page reloaded');
      }

      // Wait for 5 minutes (300,000 milliseconds)
      await setTimeout(30000);
    } catch (error) {
      console.log('Error during page reload:', error);
      await browser.close()
      break;
    }
  }
}

run();
