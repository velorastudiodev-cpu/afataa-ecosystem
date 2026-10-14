import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage','--no-zygote']});
const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
await page.goto(process.env.AFATAA_URL||'http://127.0.0.1:4173',{waitUntil:'networkidle'});
const checks=[['hero crystal',page.locator('.crystal-stage')],['pedigree',page.locator('#pedigree')],['masterpieces',page.locator('#work')],['workspace',page.locator('#workspace')],['contact',page.locator('#contact')]];
for(const [name,locator] of checks){if(!await locator.count())throw new Error(`Missing ${name}`);}
await page.getByRole('button',{name:/Run Dijkstra/}).click();await page.waitForTimeout(300);if(!await page.locator('.cell.visited').count())throw new Error('Pathfinder did not animate');
await page.locator('#tab-tokens').click();if(!await page.locator('#panel-tokens').isVisible())throw new Error('Token tab did not open');
await page.locator('button[aria-label="Open Ikbar Barbershop interactive preview"]').click();if(!await page.locator('dialog.preview-dialog').isVisible())throw new Error('Preview dialog did not open');await page.locator('dialog.preview-dialog .icon-button').click();
await page.setViewportSize({width:390,height:844});await page.reload({waitUntil:'networkidle'});await page.locator('.menu-toggle').click();if((await page.locator('.nav-open').count())!==1)throw new Error('Mobile menu did not open');
console.log('Browser checks passed');await browser.close();
