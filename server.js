console.clear();

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const localtunnel = require('localtunnel');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function generatePassword(length = 16) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

function generateKey() {
  return crypto.randomBytes(32); // AES-256
}

function generateIV() {
  return crypto.randomBytes(16);
}

async function startServer() {
  const app = express();
  const port = 0; // dynamic port
  const filePath = path.resolve(await prompt("Enter the file path to share: "));
  const password = generatePassword();
  const encryptionKey = generateKey();
  const filename = path.basename(filePath);

  app.get('/download', (req, res) => {
    const userPassword = req.query.password;
    if (!userPassword || userPassword !== password) {
      return res.status(403).send('Forbidden: Invalid password');
    }

    const iv = generateIV();
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    const stream = fs.createReadStream(filePath);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}.enc"`);
    res.setHeader('X-IV', iv.toString('base64'));

    stream.pipe(cipher).pipe(res);
    console.log(`Served encrypted file to client`);
  });

  const server = app.listen(port, async () => {
    const actualPort = server.address().port;
    const tunnel = await localtunnel({ port: actualPort });

    console.log('\n=== Share These with the Client ===');
    console.log(`Download URL: ${tunnel.url}/download`);
    console.log(`Encryption Key (Base64): ${encryptionKey.toString('base64')}`);
    console.log(`Password: ${password}`);
    console.log(`Filename: ${filename}`);
    console.log('===================================\n');
  });
  while (true) {
  }
}

startServer();
