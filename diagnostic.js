
const { config } = require('dotenv');
const path = require('path');
const fs = require('fs');

console.log('--- Diagnostic Start ---');

// Check for .env files
const envFiles = ['.env', '.env.local', 'local.env'];
envFiles.forEach(file => {
  const exists = fs.existsSync(path.resolve(process.cwd(), file));
  console.log(`${file} exists: ${exists}`);
});

// Load .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

requiredVars.forEach(v => {
  const val = process.env[v];
  console.log(`${v}: ${val ? 'PRESENT (starts with ' + val.substring(0, 5) + '...)' : 'MISSING'}`);
});

console.log('--- Diagnostic End ---');
