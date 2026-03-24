
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testFirestore() {
  console.log('--- Firestore Test Start ---');
  console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  
  if (!process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY.includes('YOUR_PRIVATE_KEY_HERE')) {
    console.error('❌ FIREBASE_PRIVATE_KEY is not set or has placeholder value');
    return;
  }

  try {
    const app = initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });

    const db = getFirestore(app);
    console.log('Attempting to list collections to verify database existence...');
    
    // Attempting a simple operation
    const collections = await db.listCollections();
    console.log('✅ Connected to Firestore. Collections found:', collections.length);
    collections.forEach(col => console.log(' -', col.id));
    
  } catch (err) {
    console.error('❌ Firestore Test Failed:');
    if (err.message && err.message.includes('NOT_FOUND')) {
      console.error('DATABASE_NOT_FOUND error encountered. This usually means the Firestore database has not been created.');
    } else {
      console.error(err);
    }
  }
  console.log('--- Firestore Test End ---');
}

testFirestore();
