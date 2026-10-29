const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const User = require('./models/User');
const { login, getMe } = require('./controllers/authController');
const { protect } = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());

// Mount endpoints exactly as in server.js
app.post('/api/login', login);
app.post('/api/auth/login', login);
app.get('/api/me', protect, getMe);

async function runTests() {
  await connectDB();
  const server = app.listen(5099, async () => {
    console.log('[Test Server] Listening on http://localhost:5099');

    try {
      function postJson(urlPath, data) {
        return new Promise((resolve, reject) => {
          const body = JSON.stringify(data);
          const req = http.request(
            {
              hostname: 'localhost',
              port: 5099,
              path: urlPath,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
              },
            },
            res => {
              let resData = '';
              res.on('data', chunk => (resData += chunk));
              res.on('end', () => {
                resolve({ status: res.statusCode, data: JSON.parse(resData) });
              });
            }
          );
          req.on('error', reject);
          req.write(body);
          req.end();
        });
      }

      function getAuth(urlPath, token) {
        return new Promise((resolve, reject) => {
          const req = http.request(
            {
              hostname: 'localhost',
              port: 5099,
              path: urlPath,
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
            res => {
              let resData = '';
              res.on('data', chunk => (resData += chunk));
              res.on('end', () => {
                resolve({ status: res.statusCode, data: JSON.parse(resData) });
              });
            }
          );
          req.on('error', reject);
          req.end();
        });
      }

      console.log('\n--- TEST 1: POST /api/login with college email & studentId ---');
      const test1 = await postJson('/api/login', {
        email: 'chittorarp23.civil@coeptech.ac.in',
        studentId: 'chittorarp23',
      });
      console.log('Status:', test1.status);
      console.log('Success:', test1.data.success);
      console.log('Student Name:', test1.data.student?.name);
      console.log('Has Token:', Boolean(test1.data.token));
      if (test1.status !== 200 || !test1.data.token) throw new Error('Test 1 Failed');

      console.log('\n--- TEST 2: GET /api/me using the received JWT token ---');
      const test2 = await getAuth('/api/me', test1.data.token);
      console.log('Status:', test2.status);
      console.log('Authenticated User:', test2.data.user?.email);
      if (test2.status !== 200) throw new Error('Test 2 Failed');

      console.log('\n--- TEST 3: POST /api/login with incorrect studentId (Rejection Test) ---');
      const test3 = await postJson('/api/login', {
        email: 'chittorarp23.civil@coeptech.ac.in',
        studentId: 'wrong_id_9999',
      });
      console.log('Status (expect 401):', test3.status);
      console.log('Message:', test3.data.message);
      if (test3.status !== 401) throw new Error('Test 3 Failed');

      console.log('\n--- TEST 4: POST /api/auth/login with batch 2030 student ---');
      const test4 = await postJson('/api/auth/login', {
        email: 'giradsh25.comp@coeptech.ac.in',
        studentId: 'giradsh25',
      });
      console.log('Status:', test4.status);
      console.log('Student Name:', test4.data.student?.name);
      console.log('Batch:', test4.data.student?.batch);
      console.log('Department:', test4.data.student?.department);
      if (test4.status !== 200) throw new Error('Test 4 Failed');

      console.log('\n--- TEST 5: POST /api/login with Cafeteria Admin Credentials ---');
      const test5 = await postJson('/api/login', {
        email: 'admin@cafeteria.com',
        password: 'Admin@123',
      });
      console.log('Status:', test5.status);
      console.log('Admin Role:', test5.data.user?.role);
      if (test5.status !== 200) throw new Error('Test 5 Failed');

      console.log('\n🎉 ALL 5 BACKEND TESTS PASSED SUCCESSFULLY! 🎉\n');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('\n❌ Test Error:', err);
      server.close();
      process.exit(1);
    }
  });
}

runTests();
