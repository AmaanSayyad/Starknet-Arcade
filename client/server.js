const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, turbo: true });
const handle = app.getRequestHandler();

// Check if certificates exist
let httpsOptions = {};

try {
  // Try to use existing certificates if available
  httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certificates/localhost-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certificates/localhost.pem')),
  };
} catch (e) {
  console.warn('⚠️ HTTPS certificates not found. WebAuthn features might not work.');
  console.warn('To fix this, install mkcert and run:');
  console.warn('mkcert -install');
  console.warn('mkcert localhost');
  console.warn('Then move the generated files to the client/certificates folder');
}

const PORT = 3000;

app.prepare().then(() => {
  // Only use HTTPS if we have certificates
  if (Object.keys(httpsOptions).length > 0) {
    createServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://localhost:${PORT}`);
    });
  } else {
    // Fallback to regular next dev
    console.log('Falling back to standard Next.js server (no HTTPS)');
    const { exec } = require('child_process');
    exec(`npx next dev --port ${PORT} --turbopack`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(stdout);
      console.error(stderr);
    });
  }
}); 