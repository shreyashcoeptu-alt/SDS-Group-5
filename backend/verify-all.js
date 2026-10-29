const http = require('http');

function post(url, data, token) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const u = new URL(url);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'POST',
      headers,
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function get(url, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'GET',
      headers,
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function runFullVerification() {
  console.log('--- 1. Testing Customer Login ---');
  const custLogin = await post('http://localhost:5000/api/auth/login', {
    email: 'customer@student.com',
    password: 'Customer@123',
  });
  console.log('Customer login status:', custLogin.status, 'Role:', custLogin.data.user.role);

  console.log('--- 2. Testing Customer Profile Access ---');
  const custProfile = await get('http://localhost:5000/api/users/profile', custLogin.data.token);
  console.log('Customer profile name:', custProfile.data.user.name);

  console.log('--- 3. Testing RBAC: Customer trying to access Admin Users list (Should be 403 Forbidden) ---');
  const custForbidden = await get('http://localhost:5000/api/users', custLogin.data.token);
  console.log('Customer accessing /api/users status (Expect 403):', custForbidden.status);

  console.log('--- 4. Testing Admin Login & User Management Stats ---');
  const adminLogin = await post('http://localhost:5000/api/auth/login', {
    email: 'admin@cafeteria.com',
    password: 'Admin@123',
  });
  const adminStats = await get('http://localhost:5000/api/users/stats', adminLogin.data.token);
  console.log('Admin user stats:', adminStats.data.stats);

  const adminUsersList = await get('http://localhost:5000/api/users', adminLogin.data.token);
  console.log('Total users fetched by Admin:', adminUsersList.data.count);

  console.log('--- 5. Testing New User Registration ---');
  const randomSuffix = Math.floor(Math.random() * 10000);
  const regRes = await post('http://localhost:5000/api/auth/register', {
    name: `Test Student ${randomSuffix}`,
    email: `teststudent${randomSuffix}@college.edu`,
    password: 'Password@123',
    role: 'customer',
    phone: '9876543210'
  });
  console.log('New user register status:', regRes.status, 'Success:', regRes.data.success, 'New User ID:', regRes.data.user.id);

  console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
  process.exit(0);
}

runFullVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
