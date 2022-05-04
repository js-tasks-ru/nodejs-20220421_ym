const fs = require("fs");
const path = require("path");

function getFile(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, "files", pathname);

  if (pathname.includes("/")) {
    res.statusCode = 400;
    res.end("Nested path doesn't supported");
    return;
  }

  const fileStream = fs.createReadStream(filepath);
  fileStream.on("error", (err) => {
    res.statusCode = 404;
    res.end("Not found");
  });
  fileStream.pipe(res);
}

module.exports = getFile;
