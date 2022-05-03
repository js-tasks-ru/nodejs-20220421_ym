const http = require("http");
const saveFile = require("./saveFile");

const server = new http.Server();

server.on("request", async (req, res) => {
  try {
    if (req.method === "POST") {
      await saveFile(req, res);
      return;
    }

    res.statusCode = 501;
    res.end("Not implemented");
  } catch (error) {
    console.warn(error);
    res.statusCode = 500;
    res.end("Something went wrong");
  }
});

module.exports = server;
