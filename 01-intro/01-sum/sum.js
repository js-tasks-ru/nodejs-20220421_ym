function sum(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    const message = "First or second argument is not a finite number";
    throw new TypeError(message);
  }
  return a + b;
}

module.exports = sum;
