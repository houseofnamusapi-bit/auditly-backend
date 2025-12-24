const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { parseHtml } = require("../utils/parseHtml");
const crypto = require("crypto");

const screenshotsDir = path.join(__dirname, "../screenshots");
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

async function runAudit(url) {
  const auditId = crypto.randomUUID();
  const auditDir = path.join(screenshotsDir, auditId);

  fs.mkdirSync(auditDir);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const startTime = Date.now();
  await page.goto(url, { waitUntil: "networkidle" });
  const loadTime = Date.now() - startTime;

  const desktopShot = "desktop.jpg";
  await page.screenshot({
    path: path.join(auditDir, desktopShot),
    fullPage: true,
    type: "jpeg",
    quality: 70
  });

  await page.setViewportSize({ width: 375, height: 812 });

  const mobileShot = "mobile.jpg";
  await page.screenshot({
    path: path.join(auditDir, mobileShot),
    fullPage: true,
    type: "jpeg",
    quality: 70
  });

  const html = await page.content();
  const parsed = parseHtml(html);

  await browser.close();

  return {
    auditId,
    url,
    loadTimeMs: loadTime,
    screenshots: {
      desktop: `${auditId}/desktop.jpg`,
      mobile: `${auditId}/mobile.jpg`
    },
    seo: parsed
  };
}

module.exports = { runAudit };
