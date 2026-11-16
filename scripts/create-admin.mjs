import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Read .env.local if present
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
}

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/urban_fit';
const dbName = process.env.MONGODB_DB || 'urban_fit';

const adminEmail = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@urbanfit.com';
const adminPassword = process.argv[3] || process.env.ADMIN_PASSWORD || 'urbanfit2026';
const adminName = process.argv[4] || 'Urban Fit Superadmin';

async function createAdmin() {
  console.log(`[URBAN FIT] Connecting to MongoDB: ${uri}`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const adminsCol = db.collection('admins');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const result = await adminsCol.updateOne(
      { email: adminEmail.toLowerCase() },
      {
        $set: {
          email: adminEmail.toLowerCase(),
          name: adminName,
          password: hashedPassword,
          role: 'admin',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log('\n===========================================');
    console.log('✓ Admin user configured successfully!');
    console.log(`Email:    ${adminEmail.toLowerCase()}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     admin`);
    console.log('===========================================\n');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

createAdmin();
