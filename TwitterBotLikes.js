import puppeteer from 'puppeteer';
const delay = ms => new Promise(res => setTimeout(res, ms));
let CanBreak = false;

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args:['--start-maximized']
   });

  const page = await browser.newPage();

    // Navigate the page to a URL
  await page.goto('https://twitter.com/chouxmimouli/following');

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

  const ConfirmUnfollow = 'div[data-testid="confirmationSheetConfirm"]';

  while (true){ 
    while(CanBreak == false) {
      try {
        // Check if ConfirmUnfollow is visible; if it is, break out of the loop
        await page.waitForSelector(ConfirmUnfollow, {visible: true, timeout: 250 })
        await page.click(ConfirmUnfollow);
        await page.reload();
        //CanBreak = true
      } 
      catch (error) {
        await page.waitForSelector('div[data-testid="UserCell"]', { visible: true, timeout: 10000 });
        await page.click('div[data-testid="UserCell"] [role="button"]');
        console.log("try")
      }
    }
  }
})();