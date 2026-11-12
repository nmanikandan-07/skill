const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 1001;

function makeRequest(urlPath, method = 'GET', body = null, token = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const isFormData = body instanceof Buffer || (typeof body === 'string' && headers['Content-Type']?.includes('multipart'));
    const defaultHeaders = isFormData
      ? headers
      : { 'Content-Type': 'application/json', ...headers };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path: urlPath,
      method: method,
      headers: defaultHeaders
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      if (typeof body === 'object' && !isFormData) {
        req.write(JSON.stringify(body));
      } else {
        req.write(body);
      }
    }
    req.end();
  });
}

// Multipart helper for profile image upload
function createMultipartFormData(fields, fileField) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const crlf = '\r\n';
  let body = '';

  for (const [key, value] of Object.entries(fields)) {
    body += `--${boundary}${crlf}`;
    body += `Content-Disposition: form-data; name="${key}"${crlf}${crlf}`;
    body += `${value}${crlf}`;
  }

  if (fileField) {
    body += `--${boundary}${crlf}`;
    body += `Content-Disposition: form-data; name="${fileField.name}"; filename="${fileField.filename}"${crlf}`;
    body += `Content-Type: ${fileField.contentType}${crlf}${crlf}`;
    body += fileField.content;
    body += `${crlf}`;
  }

  body += `--${boundary}--${crlf}`;

  return {
    boundary,
    buffer: Buffer.from(body, 'binary'),
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    }
  };
}

async function runProfileVerification() {
  console.log('\n======================================================');
  console.log('   SKILLSYNC STUDENT PROFILE ENHANCEMENT TEST SUITE   ');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(title, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${title}`);
      passed++;
    } catch (e) {
      console.error(`❌ FAIL: ${title} ->`, e.message || e);
      failed++;
    }
  }

  const timestamp = Date.now();
  const testEmail1 = `priya_${timestamp}@student.annauniv.edu`;
  const testEmail2 = `partner_${timestamp}@student.annauniv.edu`;
  let user1Token = null;
  let user1Id = null;
  let user2Token = null;
  let user2Id = null;

  // 1. Register User 1
  await test('Register User 1 with initial credentials', async () => {
    const res = await makeRequest('/api/auth/register', 'POST', {
      fullName: 'Priyadharshan',
      email: testEmail1,
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
    if (res.status !== 201 || !res.data.token) {
      throw new Error(`Expected 201 Created: ${JSON.stringify(res.data)}`);
    }
    user1Token = res.data.token;
    user1Id = res.data.user._id;
  });

  // 2. Fetch profile via /api/users/me
  let initialCompletion = 0;
  await test('GET /api/users/me loads authenticated student profile & auto-assigns username', async () => {
    const res = await makeRequest('/api/users/me', 'GET', null, user1Token);
    if (res.status !== 200 || !res.data.user) {
      throw new Error(`Expected 200 OK: ${JSON.stringify(res.data)}`);
    }
    const u = res.data.user;
    if (!u.username) throw new Error('Username should be auto-assigned if missing');
    if (u.email !== testEmail1) throw new Error(`Email mismatch: ${u.email}`);
    initialCompletion = u.profileCompletion;
    console.log(`   -> Initial Username: @${u.username}, Completion: ${initialCompletion}%`);
  });

  // 3. Update complete profile details
  const chosenUsername = `priyadharshan_${timestamp.toString().slice(-4)}`;
  await test('PUT /api/users/me updates all profile details (phone, college, department, year, bio, goals, social links)', async () => {
    const res = await makeRequest('/api/users/me', 'PUT', {
      fullName: 'Priyadharshan M',
      username: chosenUsername,
      phone: '+91 98765 43210',
      college: 'Anna University, Chennai',
      department: 'Computer Science and Engineering',
      year: '3rd Year',
      location: 'Chennai, Tamil Nadu',
      availability: 'Flexible',
      bio: 'Passionate full-stack developer passionate about Python, Node.js, and modern UI engineering.',
      learningGoals: 'Mastering React design systems, Docker containers, and Cloud DevOps.',
      linkedin: 'https://linkedin.com/in/priyadharshan-demo',
      github: 'https://github.com/priyadharshan-demo',
      portfolio: 'https://priyadharshan.dev'
    }, user1Token);

    if (res.status !== 200 || !res.data.user) {
      throw new Error(`Expected 200 OK: ${JSON.stringify(res.data)}`);
    }
    const u = res.data.user;
    if (u.fullName !== 'Priyadharshan M') throw new Error(`Full name not updated: ${u.fullName}`);
    if (u.username !== chosenUsername) throw new Error(`Username not updated: ${u.username}`);
    if (u.phone !== '+91 98765 43210') throw new Error(`Phone not updated: ${u.phone}`);
    if (u.college !== 'Anna University, Chennai') throw new Error(`College not updated: ${u.college}`);
    if (u.department !== 'Computer Science and Engineering') throw new Error(`Department not updated: ${u.department}`);
    if (u.year !== '3rd Year') throw new Error(`Year not updated: ${u.year}`);
    if (u.linkedin !== 'https://linkedin.com/in/priyadharshan-demo') throw new Error(`LinkedIn not updated: ${u.linkedin}`);
    if (u.github !== 'https://github.com/priyadharshan-demo') throw new Error(`GitHub not updated: ${u.github}`);
    if (u.portfolio !== 'https://priyadharshan.dev') throw new Error(`Portfolio not updated: ${u.portfolio}`);
    if (u.profileCompletion <= initialCompletion) throw new Error(`Completion score should increase: ${u.profileCompletion}`);
    console.log(`   -> Updated Completion score: ${u.profileCompletion}%`);
  });

  // 4. Persistence check: Reload /api/users/me to verify MongoDB saved permanently
  await test('Reload profile from MongoDB ensures updates are permanently saved', async () => {
    const res = await makeRequest('/api/users/me', 'GET', null, user1Token);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const u = res.data.user;
    if (u.username !== chosenUsername) throw new Error(`Persisted username mismatch: ${u.username}`);
    if (u.phone !== '+91 98765 43210') throw new Error(`Persisted phone mismatch: ${u.phone}`);
    if (u.college !== 'Anna University, Chennai') throw new Error(`Persisted college mismatch: ${u.college}`);
  });

  // 5. Register User 2 & verify duplicate username rejection
  await test('User 2 cannot take an already taken username (uniqueness enforcement)', async () => {
    const res2 = await makeRequest('/api/auth/register', 'POST', {
      fullName: 'Partner Student',
      email: testEmail2,
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
    user2Token = res2.data.token;
    user2Id = res2.data.user._id;

    // Attempt to rename User 2 to User 1's chosen username
    const conflictRes = await makeRequest('/api/users/me', 'PUT', {
      username: chosenUsername
    }, user2Token);

    if (conflictRes.status !== 400 || !conflictRes.data.message.toLowerCase().includes('already taken')) {
      throw new Error(`Expected 400 Conflict: ${JSON.stringify(conflictRes.data)}`);
    }
    console.log(`   -> Correctly rejected duplicate username with: "${conflictRes.data.message}"`);
  });

  // 6. Test Skills catalogue and linking
  let sampleSkill1 = null;
  let sampleSkill2 = null;
  await test('Fetch SkillSync catalogue & attach Teaching and Learning skills', async () => {
    const catRes = await makeRequest('/api/skills');
    if (!catRes.data.skills || catRes.data.skills.length < 2) throw new Error('Not enough skills in catalogue');
    sampleSkill1 = catRes.data.skills[0]._id;
    sampleSkill2 = catRes.data.skills[1]._id;

    // Add teach skill
    const addTeachRes = await makeRequest('/api/user-skills', 'POST', {
      skillId: sampleSkill1,
      type: 'teach',
      level: 'Expert'
    }, user1Token);
    if (addTeachRes.status !== 201) throw new Error(`Failed to add teach skill: ${JSON.stringify(addTeachRes.data)}`);

    // Add learn skill
    const addLearnRes = await makeRequest('/api/user-skills', 'POST', {
      skillId: sampleSkill2,
      type: 'learn',
      level: 'Beginner'
    }, user1Token);
    if (addLearnRes.status !== 201) throw new Error(`Failed to add learn skill: ${JSON.stringify(addLearnRes.data)}`);

    // Verify GET /api/users/me returns populated skills
    const meRes = await makeRequest('/api/users/me', 'GET', null, user1Token);
    if (meRes.data.teachSkills.length === 0 || meRes.data.learnSkills.length === 0) {
      throw new Error('Skills were not returned in /api/users/me');
    }
    console.log(`   -> User has ${meRes.data.teachSkills.length} teaching skill(s) & ${meRes.data.learnSkills.length} learning skill(s)`);
  });

  // 7. Privacy: Student Partner views User 1's profile -> Phone & Email masked
  await test('Public profile respects student privacy (Phone & Email omitted for other students by default)', async () => {
    const pubRes = await makeRequest(`/api/users/${user1Id}`, 'GET', null, user2Token);
    if (pubRes.status !== 200 || !pubRes.data.user) throw new Error(`Failed to fetch public profile: ${pubRes.status}`);
    const pubUser = pubRes.data.user;

    if (pubUser.email) {
      throw new Error(`PRIVACY VIOLATION: Email is visible to other students: ${pubUser.email}`);
    }
    if (pubUser.phone) {
      throw new Error(`PRIVACY VIOLATION: Phone is visible to other students: ${pubUser.phone}`);
    }
    if (pubUser.password || pubUser.passwordResetOtpHash) {
      throw new Error('SECURITY VIOLATION: Private account credentials exposed in public profile!');
    }
    console.log('   -> Verified: Email and Phone are strictly private by default.');
  });

  // 8. Profile Photo Upload via multipart/form-data
  await test('Profile Photo upload saves image reference to /uploads/ and updates user', async () => {
    // 1x1 transparent PNG binary
    const pngHex = '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082';
    const fakeImageBuffer = Buffer.from(pngHex, 'hex');

    const multipart = createMultipartFormData(
      { fullName: 'Priyadharshan M' },
      { name: 'profileImage', filename: 'student_avatar.png', contentType: 'image/png', content: fakeImageBuffer.toString('binary') }
    );

    const uploadRes = await makeRequest('/api/users/me', 'PUT', multipart.buffer, user1Token, multipart.headers);
    if (uploadRes.status !== 200 || !uploadRes.data.user) {
      throw new Error(`Upload failed: ${JSON.stringify(uploadRes.data)}`);
    }
    const uploadedImage = uploadRes.data.user.profileImage;
    if (!uploadedImage || !uploadedImage.startsWith('/uploads/')) {
      throw new Error(`Invalid profileImage path: ${uploadedImage}`);
    }
    console.log(`   -> Profile image saved at: ${uploadedImage}`);

    // Verify file exists on local disk
    const diskPath = path.join(__dirname, '..', uploadedImage.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) {
      throw new Error(`Uploaded file not found on disk at: ${diskPath}`);
    }
    console.log(`   -> Verified file exists on disk: ${diskPath}`);
  });

  // 9. Validation Rejections
  await test('Validation rejects invalid username characters and invalid URLs', async () => {
    const badUsernameRes = await makeRequest('/api/users/me', 'PUT', {
      username: 'bad username with spaces'
    }, user1Token);
    if (badUsernameRes.status !== 400) throw new Error(`Expected 400 for bad username: ${badUsernameRes.status}`);

    const badUrlRes = await makeRequest('/api/users/me', 'PUT', {
      linkedin: 'not-a-valid-url'
    }, user1Token);
    if (badUrlRes.status !== 400) throw new Error(`Expected 400 for bad LinkedIn URL: ${badUrlRes.status}`);
  });

  console.log('\n======================================================');
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runProfileVerification().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
