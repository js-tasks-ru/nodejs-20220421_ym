const os = require("os");
const { Transform } = require("stream");

class LineSplitStream extends Transform {
  constructor(options) {
    super(options);
    this.leftOver = "";
  }

  _transform(chunk, _, callback) {
    const str = this.leftOver + chunk.toString("utf-8");
    const splitted = str.split(os.EOL);
    this.leftOver = splitted.pop();
    splitted.forEach((line) => {
      this.push(line, "utf-8");
    });
    callback();
  }

  _flush(callback) {
    this.push(this.leftOver, "utf-8");
    callback();
  }
}

module.exports = LineSplitStream;
