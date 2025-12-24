const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { parseHtml } = require('../utils/parseHtml');

const screenshotsDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

async function runAudit(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const startTime = Date.now();
  await page.goto(url, { waitUntil: 'networkidle' });
  const loadTime = Date.now() - startTime;

  const desktopShot = `desktop-${Date.now()}.png`;
  await page.screenshot({ path: path.join(screenshotsDir, desktopShot), fullPage: true });

  // Mobile screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  const mobileShot = `mobile-${Date.now()}.png`;
  await page.screenshot({ path: path.join(screenshotsDir, mobileShot), fullPage: true });

  const html = await page.content();
  const parsed = parseHtml(html);

  await browser.close();

  return {
    url,
    loadTimeMs: loadTime,
    screenshots: { desktop: desktopShot, mobile: mobileShot },
    seo: parsed
  };
}

module.exports = { runAudit };
