// Такое норм? Мне кажутся префиксы хорошей идеей
const fs = require("node:fs");
const path = require("node:path");
const LimitSizeStream = require("./LimitSizeStream");

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
    res.statusCode = 409;
    res.end("File already exist");
    // Нужен ли return, если мы сразу отдаем ответ?
    return;
  } catch (e) {}

  const limitedStream = new LimitSizeStream({ limit: 1024 * 1024 });
  const writeStream = fs.createWriteStream(filepath);

  // Почему событие "end" не срабатывает
  // на limitedStream если нет pipe или on("data", ...) ?
  req.pipe(limitedStream).pipe(writeStream);

  req.on("error", () => {
    fs.promises.unlink(filepath);

    // Нужно ли удалять стримы?
    limitedStream.destroy();
    writeStream.destroy();

    // Нужно ли что-то возвращать? По идее уже нет соединения
  });

  limitedStream.on("error", () => {
    console.info(`🔥 error`);
    fs.promises.unlink(filepath);
    // Нужно ли удалять стрим?
    limitedStream.destroy();
    res.statusCode = 413;
    res.end("File is too big");
  });

  // writeStream или нужно сохранить весь пайп и слушать события у него?
  writeStream.on("finish", () => {
    console.info(`🔥 finish`);
    res.statusCode = 201;
    res.end("Ok");
  });
}

module.exports = saveFile;
