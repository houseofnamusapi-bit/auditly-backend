const express = require("express");
const cors = require("cors");
const path = require("path");
const { runAudit } = require("./playwright/audit");
const { deleteAuditScreenshots } = require("./utils/cleanupAudit");
const app = express();

require("./cleanupJob");


/* ✅ CORS — MUST BE BEFORE ROUTES */
app.use(
  cors({
    origin: "*", // allow frontend requests
  })
);

app.use(express.json());

/* ✅ Serve screenshots publicly */
app.use(
  "/screenshots",
  express.static(path.join(__dirname, "screenshots"))
);

/* ✅ Audit API */
app.post("/api/audit", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const result = await runAudit(url);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ✅ Dynamic port for deployment */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

app.post("/api/audit/cleanup", (req, res) => {
  const { auditId } = req.body;

  deleteAuditScreenshots(auditId);

  res.json({ success: true });
});
