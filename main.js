// A file server.

const { createServer } = require("http");

const methods = Object.create(null);
const port = 8000;

createServer((req, resp) => {
  let handler = methods[req.method] || notAllowed;
  handler(req)
    .catch((e) => {
      if (e.status != null) return e;
      return { body: String(e), status: 500 };
    })
    .then(({ body, status = 200, type = "text/plain" }) => {
      resp.writeHead(status, { "Content-Type": type });
      if (body && body.pipe) body.pipe(resp);
      else resp.end(body);
    });
}).listen(port);

console.log(`Started on *:${port}`);

async function notAllowed(req) {
  return {
    status: 405,
    body: `Method ${req.method} not allowd`,
  };
}
