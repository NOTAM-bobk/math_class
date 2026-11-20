const fs = require("fs");
const path = require("path");

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const filePath = path.join(process.cwd(), "version.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return res.status(200).send(data);
    }
  } catch {}

  return res.status(200).json({
    version: "1.7.2",
    buildIso: new Date().toISOString(),
    buildTime: Date.now(),
  });
};
