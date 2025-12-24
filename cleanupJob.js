const fs = require("fs");
const path = require("path");

const screenshotsDir = path.join(__dirname, "screenshots");
const TTL = 15 * 60 * 1000; // 15 minutes

function cleanupOldAudits() {
  if (!fs.existsSync(screenshotsDir)) return;

  const now = Date.now();

  fs.readdirSync(screenshotsDir).forEach((auditId) => {
    const auditDir = path.join(screenshotsDir, auditId);

    if (!fs.existsSync(auditDir)) return;

    const stats = fs.statSync(auditDir);

    if (now - stats.mtimeMs > TTL) {
      fs.rmSync(auditDir, { recursive: true, force: true });
      console.log(`🧹 Deleted audit: ${auditId}`);
    }
  });
}

// Run every 5 minutes
setInterval(cleanupOldAudits, 5 * 60 * 1000);
