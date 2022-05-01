const { Transform } = require("stream");
const LimitExceededError = require("./LimitExceededError");

class LimitSizeStream extends Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit ?? 64;
    this.currentSize = 0;
  }

  _transform(chunk, _, callback) {
    this.currentSize += chunk.byteLength;
    if (this.currentSize > this.limit)
      callback(new LimitExceededError());
    else callback(null, chunk);
  }
}

module.exports = LimitSizeStream;

// const makeLimitSizeStream = ({ limit = 64, encoding = "utf-8" }) => {
//   let size = 0;

//   return new Transform({
//     encoding,
//     transform(chunk, _, callback) {
//       size += chunk.byteLength;
//       let error = size > limit ? new LimitExceededError() : null;
//       callback(error, chunk);
//     },
//   });
// };

// module.exports = { makeLimitSizeStream };
