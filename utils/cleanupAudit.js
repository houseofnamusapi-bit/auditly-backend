const fs = require("fs");
const path = require("path");

const screenshotsDir = path.join(__dirname, "../screenshots");

function deleteAuditScreenshots(auditId) {
  if (!auditId) return;

  const auditDir = path.join(screenshotsDir, auditId);

  if (fs.existsSync(auditDir)) {
    fs.rmSync(auditDir, { recursive: true, force: true });
  }
}

module.exports = { deleteAuditScreenshots };
