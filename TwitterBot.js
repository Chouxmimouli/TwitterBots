import puppeteer from 'puppeteer';
const delay = ms => new Promise(res => setTimeout(res, ms));
let PostDeleted = false;
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
  await page.goto('https://twitter.com/chouxmimouli');

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
  
  const buttonSelector = 'div[data-testid="primaryColumn"] div[data-testid="caret"]';
  const DeletePost = await page.$('xpath=//span[contains(text(), "Delete")]');
  const UnRetweet = 'div[data-testid="unretweet"]';
  const UnRetweetConfirm = 'div[data-testid="unretweetConfirm"]';

  while (true){
    // Find the "More options" menu
    await page.waitForSelector(buttonSelector, {visible: true, timeout: 10000 });
    await page.click(buttonSelector);

    // Wait for the menu to open
    await delay(200)

    if(await page.$('xpath=//span[contains(text(), "Delete")]')){
      console.log("Personal Post")
      await page.click('xpath=//span[contains(text(), "Delete")]');
      await page.waitForSelector('div[data-testid="confirmationSheetConfirm"]');
      await page.click('div[data-testid="confirmationSheetConfirm"]');
      PostDeleted = true;
    }
    
    if (PostDeleted == false) {
      while(CanBreak == false) {
        try {
          // Check if UnRetweetConfirm is visible; if it is, break out of the loop
          await page.waitForSelector(UnRetweetConfirm, { visible: true, timeout: 500 });
          CanBreak = true
        } 
        catch (error) {
          // UnRetweetConfirm is not visible, continue with UnRetweet
          await page.waitForSelector(UnRetweet, { visible: true, timeout: 10000 });
          await page.click(UnRetweet);
          await delay(250);
        }
      }
      await page.waitForSelector(UnRetweetConfirm, {visible: true, timeout: 10000 })
      await page.click(UnRetweetConfirm);
    }
    await delay(1000)
    PostDeleted = false;
    CanBreak = false
  }
})();