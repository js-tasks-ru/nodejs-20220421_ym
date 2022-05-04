const fs = require("node:fs");
const path = require("node:path");

async function saveFile(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, "files", pathname);

  if (pathname.includes("/")) {
    res.statusCode = 400;
    res.end("Nested path doesn't supported");
    return;
  }

  try {
    await fs.promises.access(filepath);
  } catch (e) {
    res.statusCode = 404;
    res.end();
  }

  await fs.promises.unlink(filepath);
  res.statusCode = 200;
  res.end();
}

module.exports = saveFile;
