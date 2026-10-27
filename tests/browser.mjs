import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH&&{executablePath:process.env.CHROMIUM_PATH})});
const url=process.env.AFATAA_URL||'http://127.0.0.1:4173';
const fail=(m)=>{throw new Error(m);};
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.goto(url,{waitUntil:'networkidle'});
for(const id of ['hero','work','pedigree','process','lab','contact'])if(!await page.locator(`#${id}`).count())fail(`Missing #${id}`);
if(!await page.locator('canvas.graph-field').count())fail('Hero graph missing');

// Lab: race both algorithms and check A* explores less.
await page.getByRole('button',{name:'Mulai Balapan'}).click();
await page.waitForFunction(()=>/lebih hemat|Tidak ada rute/.test(document.querySelector('.lab-summary')?.textContent||''),null,{timeout:10000});
if(!await page.locator('.lane.is-winner').count())fail('A* did not win the race');

// Token studio tab: radius slider updates the CSS output.
await page.locator('#tab-tokens').click();
await page.locator('#radius').fill('30');
if(!(await page.locator('.token-code pre').textContent()).includes('--radius: 30px'))fail('Token studio did not update');
await page.locator('#tab-race').click();

// Project preview dialog opens and closes with Escape.
await page.getByRole('button',{name:'Pratinjau'}).first().click();
if(!await page.locator('dialog.preview-dialog').isVisible())fail('Preview dialog did not open');
await page.keyboard.press('Escape');
if(await page.locator('dialog').count())fail('Dialog did not close');

// Contact: choosing a topic rewrites the untouched draft and the WhatsApp link.
await page.getByText('Dasbor CMS mandiri').click();
if(!(await page.locator('#brief-message').inputValue()).includes('dasbor cms'))fail('Topic did not update message');
if(!(await page.getByRole('link',{name:/Kirim via WhatsApp/}).getAttribute('href')).includes(encodeURIComponent('dasbor cms')))fail('WhatsApp link not prefilled');

// Mobile: no horizontal overflow, menu opens.
await page.setViewportSize({width:390,height:844});await page.reload({waitUntil:'networkidle'});
const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(overflow>0)fail(`Mobile overflows by ${overflow}px`);
// Open the menu after scrolling: the blurred nav must not trap the fixed menu panel.
await page.evaluate(()=>scrollTo({top:1500,behavior:'instant'}));await page.waitForTimeout(300);
await page.locator('.menu-toggle').click();await page.locator('.nav.is-open .nav-links').waitFor({state:'visible',timeout:3000});
const menuHeight=await page.locator('.nav-links').evaluate(e=>e.getBoundingClientRect().height);if(menuHeight<600)fail(`Mobile menu collapsed to ${menuHeight}px`);
if(errors.length)fail(`Page errors: ${errors.join('; ')}`);
console.log('Browser checks passed');await browser.close();
