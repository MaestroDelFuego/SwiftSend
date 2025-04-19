console.clear();

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function formatBytes(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

async function startClient() {
  const saveDir = path.resolve(await prompt('Enter directory to save file: '));
  const downloadUrl = await prompt('Enter the full download URL (e.g., https://xyz.loca.lt/download): ');
  const encryptionKeyBase64 = await prompt('Enter the Base64 encryption key: ');
  const password = await prompt('Enter the password: ');

  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
  }

  const outputFileName = await prompt('Enter the name to save the file as (e.g., document.pdf): ');
  const filePath = path.join(saveDir, outputFileName);
  const encryptionKey = Buffer.from(encryptionKeyBase64, 'base64');
  const url = new URL(downloadUrl);
  url.searchParams.append('password', password);

  https.get(url.toString(), (res) => {
    if (res.statusCode !== 200) {
      console.error(`Failed to download file: ${res.statusCode}`);
      rl.close();
      return;
    }

    const totalSize = parseInt(res.headers['content-length'], 10);
    const ivBase64 = res.headers['x-iv'];
    if (!ivBase64) {
      console.error('No IV received from server');
      rl.close();
      return;
    }

    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
    const writeStream = fs.createWriteStream(filePath);

    let downloaded = 0;
    const startTime = Date.now();

    res.on('data', (chunk) => {
      downloaded += chunk.length;
      const percent = ((downloaded / totalSize) * 100).toFixed(2);
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      const speed = downloaded / elapsed; // bytes/sec
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`Downloading: ${percent}% | ${formatBytes(speed)}/s | Elapsed: ${elapsed.toFixed(1)}s`);
    });

    res.pipe(decipher).pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`\n✅ Decrypted file saved to ${filePath}`);
      rl.close();
    });

    res.on('error', (err) => {
      console.error(`\nResponse error: ${err.message}`);
      rl.close();
    });
  }).on('error', (err) => {
    console.error(`\nRequest failed: ${err.message}`);
    rl.close();
  });
}

startClient();
