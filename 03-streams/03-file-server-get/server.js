const http = require("http");
const getFile = require("./getFile");

const server = new http.Server();

server.on("request", (req, res) => {
  try {
    if (req.method === "GET") {
      return getFile(req, res);
    }

    res.statusCode = 501;
    res.end("Not implemented");
  } catch (error) {
    res.statusCode = 500;
    res.end("Something went wrong");
  }
});
module.exports = server;
