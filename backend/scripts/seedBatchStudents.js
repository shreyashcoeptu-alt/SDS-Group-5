const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');

const BATCH_FILES = [
  { file: 'batch-2027.json', batchYear: '2027' },
  { file: 'batch-2028.json', batchYear: '2028' },
  { file: 'batch-2029.json', batchYear: '2029' },
  { file: 'batch-2030.json', batchYear: '2030' },
];

/**
 * Parses college email into studentId, department, and domain.
 * Example: 'chittorarp23.civil@coeptech.ac.in'
 * -> studentId: 'chittorarp23', department: 'civil', domain: 'coeptech.ac.in'
 */
function parseStudentEmail(email) {
  const cleanEmail = (email || '').toLowerCase().trim();
  const parts = cleanEmail.split('@');
  const userPart = parts[0] || '';
  const domain = parts[1] || '';

  let studentId = userPart;
  let department = '';

  if (userPart.includes('.')) {
    const subParts = userPart.split('.');
    studentId = subParts[0];
    department = subParts.slice(1).join('.');
  }

  return { studentId, department, domain, email: cleanEmail };
}

async function seedBatchStudents() {
  console.log('====================================================');
  console.log('🚀 MMI Live Voting Portal & Lunchroom User Seeder');
  console.log('   Target Database: Lunchroom');
  console.log('   Target Collection: users');
  console.log('====================================================\n');

  try {
    // Connect to MongoDB Atlas
    const conn = await connectDB();
    console.log(`[Database] Connected to: ${conn.connection.name}\n`);

    // Pre-compute standard password hash to avoid slow repeated hashing of 4,000+ entries
    console.log('[Setup] Pre-computing default student password hash...');
    const salt = await bcrypt.genSalt(10);
    const defaultHashedPassword = await bcrypt.hash('coep@123', salt);

    const candidates = [
      path.join(__dirname, '../data'),
      'C:\\Users\\Sarthak\\Downloads',
      path.join(__dirname, '../../data'),
    ];

    const studentMap = new Map();
    let totalLoaded = 0;

    for (const { file, batchYear } of BATCH_FILES) {
      let resolvedPath = null;
      for (const dir of candidates) {
        const p = path.join(dir, file);
        if (fs.existsSync(p)) {
          resolvedPath = p;
          break;
        }
      }

      if (!resolvedPath) {
        console.warn(`[Warning] Could not locate batch file: ${file}`);
        continue;
      }

      const raw = fs.readFileSync(resolvedPath, 'utf8');
      const students = JSON.parse(raw);
      console.log(`[Parse] Found ${students.length} records in ${file} (Batch ${batchYear})`);

      students.forEach(s => {
        const parsed = parseStudentEmail(s.email);
        if (parsed.email && !studentMap.has(parsed.email)) {
          studentMap.set(parsed.email, {
            name: (s.name || '').trim(),
            email: parsed.email,
            studentId: parsed.studentId,
            department: parsed.department,
            batch: batchYear,
            password: defaultHashedPassword,
            role: 'student',
            status: 'active',
          });
        }
      });

      totalLoaded += students.length;
    }

    console.log(`\n[Summary] Total records across all batches: ${totalLoaded}`);
    console.log(`[Summary] Unique students to upsert into 'users': ${studentMap.size}`);

    // Convert map to bulk upsert operations
    const bulkOps = [];
    for (const student of studentMap.values()) {
      bulkOps.push({
        updateOne: {
          filter: { email: student.email },
          update: {
            $set: {
              name: student.name,
              email: student.email,
              studentId: student.studentId,
              department: student.department,
              batch: student.batch,
              role: student.role,
              status: student.status,
            },
            $setOnInsert: {
              password: student.password,
              createdAt: new Date(),
            },
          },
          upsert: true,
        },
      });
    }

    // Also ensure demo admin and customer accounts exist for cafeteria testing
    const adminHashed = await bcrypt.hash('Admin@123', salt);
    const customerHashed = await bcrypt.hash('Customer@123', salt);

    bulkOps.push(
      {
        updateOne: {
          filter: { email: 'admin@cafeteria.com' },
          update: {
            $set: {
              name: 'Cafeteria Manager Admin',
              email: 'admin@cafeteria.com',
              role: 'cafeteria_admin',
              status: 'active',
              phone: '+1 (555) 019-2834',
            },
            $setOnInsert: { password: adminHashed, createdAt: new Date() },
          },
          upsert: true,
        },
      },
      {
        updateOne: {
          filter: { email: 'customer@student.com' },
          update: {
            $set: {
              name: 'Jordan Rivera (Demo Student)',
              email: 'customer@student.com',
              studentId: 'studentdemo',
              role: 'customer',
              status: 'active',
              phone: '+1 (555) 349-8812',
            },
            $setOnInsert: { password: customerHashed, createdAt: new Date() },
          },
          upsert: true,
        },
      }
    );

    // Execute bulk write in chunks of 1000
    const CHUNK_SIZE = 1000;
    let processed = 0;
    console.log(`\n[Database] Seeding into 'Lunchroom.users' in chunks of ${CHUNK_SIZE}...`);

    for (let i = 0; i < bulkOps.length; i += CHUNK_SIZE) {
      const chunk = bulkOps.slice(i, i + CHUNK_SIZE);
      const res = await User.bulkWrite(chunk, { ordered: false });
      processed += chunk.length;
      console.log(
        `[Progress] Processed ${processed}/${bulkOps.length} ops (Inserted: ${res.upsertedCount}, Modified: ${res.modifiedCount})`
      );
    }

    const totalInDB = await User.countDocuments();
    console.log(`\n====================================================`);
    console.log(`✅ Seeding Complete!`);
    console.log(`   Total documents in 'users' collection: ${totalInDB}`);
    console.log(`====================================================\n`);

    console.log('📌 Verification Details:');
    console.log('- Students can authenticate via POST /api/login or POST /api/auth/login');
    console.log('- Example Request Payload:');
    console.log('  {');
    console.log('    "email": "chittorarp23.civil@coeptech.ac.in",');
    console.log('    "studentId": "chittorarp23"');
    console.log('  }');
    console.log('  OR with password "coep@123"\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
}

seedBatchStudents();
