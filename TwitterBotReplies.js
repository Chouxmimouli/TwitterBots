import puppeteer from 'puppeteer';
const delay = ms => new Promise(res => setTimeout(res, ms));
let CanBreak = false;

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    args: ["--force-device-scale-factor=0.5"],
    headless: false,
    defaultViewport: null,
    args:['--start-maximized']
   });

  const page = await browser.newPage();

    // Navigate the page to a URL
  await page.goto('https://twitter.com/chouxmimouli/with_replies');

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
  
  ///////////////////////////////////////////////////////////////////////////////////////

  const buttonSelector = 'div[data-testid="primaryColumn"] div[data-testid="caret"]';

  await page.waitForSelector(buttonSelector, {visible: true, timeout: 10000 })
  
  // Get all the buttons matching the selector
  const buttons = await page.$$(buttonSelector);

  // Loop through the buttons and click on them in order
  for (let i = 0; i < buttons.length; i++) {
    while(CanBreak == false) {
      try {
        console.log("try")
        await page.waitForSelector('div[data-testid="tweetEngagements"]', {visible: true, timeout: 250 });
        // If the div is found, move to the next button
        i++;
        console.log("Found")
        CanBreak = true;
      } 
      catch (error) {
        console.log("Not Found")
        // If the div is not found within the timeout, continue clicking the current button
        await buttons[i].click();
        console.log(i)
      }
      await delay(1000)
    }
    CanBreak = false;
  }
})();