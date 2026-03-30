const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const port = Number(process.env.PORT) || 3000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function sendFile(filePath, res) {
  const extension = path.extname(filePath).toLowerCase();
  const type = mimeTypes[extension] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Erro interno ao servir o ficheiro.");
      return;
    }

    res.writeHead(200, { "Content-Type": type });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const cleanUrl = decodeURIComponent((req.url || "/").split("?")[0]);
  const relativePath = cleanUrl === "/" ? "/index.html" : cleanUrl;
  const requestedPath = path.normalize(path.join(rootDir, relativePath));

  if (!requestedPath.startsWith(rootDir)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Acesso negado.");
    return;
  }

  fs.stat(requestedPath, (error, stats) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Ficheiro não encontrado.");
      return;
    }

    if (stats.isDirectory()) {
      sendFile(path.join(requestedPath, "index.html"), res);
      return;
    }

    sendFile(requestedPath, res);
  });
});

server.listen(port, () => {
  console.log(`Servidor ativo em http://localhost:${port}`);
});
