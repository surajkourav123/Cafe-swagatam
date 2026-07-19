const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    } else {
      console.log('BROWSER LOG:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  console.log('Navigating to http://localhost:3000/admin/login...');
  try {
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (e) {
    console.log('Timeout or error on login page:', e.message);
  }

  console.log('Navigating to http://localhost:3000/admin/dashboard...');
  try {
    await page.goto('http://localhost:3000/admin/dashboard', { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (e) {
    console.log('Timeout or error on dashboard:', e.message);
  }

  await browser.close();
})();
