import puppeteer from 'puppeteer';
const delay = ms => new Promise(res => setTimeout(res, ms));
let CanBreak = false;
let UnlikeCount = 0;

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args:['--start-maximized']
   });

  const page = await browser.newPage();

    // Navigate the page to a URL
  await page.goto('https://twitter.com/chouxmimouli/likes');

  // Select login input and type username
  await page.waitForSelector('[autocomplete="username"]');
  await page.focus('[autocomplete="username"]');
  await page.type('[autocomplete="username"]','Chouxmimouli');
  await page.keyboard.press('Enter');

  // Select password input and type password
  await page.waitForSelector('[autocomplete="current-password"]');
  await page.focus('[autocomplete="current-password"]');
  await page.type('[autocomplete="current-password"]','Twenty2parrot');
  await page.keyboard.press('Enter');

  const RefuseCookies = 'xpath=//span[contains(text(), "Refuse non-essential cookies")]';
  await page.waitForSelector(RefuseCookies, {visible: true, timeout: 10000 })
  await page.click(RefuseCookies);

  const Unlike = 'div[data-testid="unlike"]';

  while (true) {
    await page.waitForSelector(Unlike, {visible: true, timeout: 10000 })
    await page.click(Unlike);
    UnlikeCount++;
    console.log(`The number of tweets unliked is: ${UnlikeCount}`);
  }
})();