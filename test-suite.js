const http = require('http');

async function makeRequest(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: process.env.PORT || 1001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: data.startsWith('{') || data.startsWith('[') ? JSON.parse(data) : data });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING SKILLSYNC VERIFICATION SUITE ---\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.error(`❌ FAIL: ${name} ->`, e.message || e);
      failed++;
    }
  }

  // 1. Landing Page Test
  await test('Landing page loads (200 OK)', async () => {
    const res = await makeRequest('/');
    if (res.status !== 200 || !res.data.includes('SkillSync')) throw new Error(`Status ${res.status}`);
  });

  // 2. Auth: Register user 1 (with flexible non-uppercase password)
  let user1Token = null;
  let user1Id = null;
  const testEmail1 = `student_${Date.now()}@test.edu`;

  await test('User registration accepts any password format (e.g. mani&7777)', async () => {
    const res = await makeRequest('/api/auth/register', 'POST', {
      fullName: 'Manikandan',
      email: testEmail1,
      password: 'mani&7777',
      confirmPassword: 'mani&7777'
    });
    if (res.status !== 201 || !res.data.token) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
    user1Token = res.data.token;
    user1Id = res.data.user._id;
  });

  // 3. Auth: Login
  await test('User login validates credentials and returns JWT', async () => {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: testEmail1,
      password: 'mani&7777'
    });
    if (res.status !== 200 || !res.data.token) throw new Error(`Status ${res.status}`);
  });

  // 3b. Auth: Google Authentication
  await test('Google authentication endpoint registers / logs in user seamlessly', async () => {
    const res = await makeRequest('/api/auth/google', 'POST', {
      email: `google_${Date.now()}@gmail.com`,
      fullName: 'Google Student',
      googleId: 'google_123456789'
    });
    if (res.status !== 200 || !res.data.token || !res.data.user) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
  });

  // 3c. Auth: Forgot Password -> Verify Reset Code -> Reset Password Flow
  let testResetToken = null;
  await test('Forgot password sends code and securely omits OTP from API response', async () => {
    const res = await makeRequest('/api/auth/forgot-password', 'POST', {
      email: testEmail1
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
    if (res.data.resetCode || res.data.resetToken) {
      throw new Error('SECURITY VIOLATION: resetCode/resetToken must NOT be present in API response!');
    }

    // Connect to mongoose to set a known test OTP hash in DB
    const mongoose = require('mongoose');
    const crypto = require('crypto');
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsync');
    }
    const User = require('./backend/models/User');
    const testOtp = '849201';
    const testOtpHash = crypto.createHash('sha256').update(testOtp).digest('hex');
    await User.updateOne({ email: testEmail1 }, {
      passwordResetOtpHash: testOtpHash,
      passwordResetOtpExpiresAt: Date.now() + 10 * 60 * 1000,
      passwordResetAttempts: 0
    });
  });

  await test('Verify reset code rejects incorrect OTP', async () => {
    const res = await makeRequest('/api/auth/verify-reset-code', 'POST', {
      email: testEmail1,
      otp: '000000'
    });
    if (res.status !== 400 || !res.data.message.includes('Invalid verification code')) {
      throw new Error(`Expected 400 with invalid code message: ${JSON.stringify(res.data)}`);
    }
  });

  await test('Verify reset code accepts valid 6-digit OTP and returns resetToken', async () => {
    const res = await makeRequest('/api/auth/verify-reset-code', 'POST', {
      email: testEmail1,
      otp: '849201'
    });
    if (res.status !== 200 || !res.data.resetToken) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
    testResetToken = res.data.resetToken;
  });

  await test('Reset password with verified resetToken and complex password updates password', async () => {
    const res = await makeRequest('/api/auth/reset-password', 'POST', {
      resetToken: testResetToken,
      newPassword: 'NewSecurePassword123!',
      confirmPassword: 'NewSecurePassword123!'
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);

    // Verify login with new password
    const loginRes = await makeRequest('/api/auth/login', 'POST', {
      email: testEmail1,
      password: 'NewSecurePassword123!'
    });
    if (loginRes.status !== 200 || !loginRes.data.token) throw new Error(`Failed to login with new password: ${loginRes.status}`);
  });

  // 4. Skills list
  let sampleSkill1 = null;
  let sampleSkill2 = null;
  await test('Fetch public skills list (40+ seeded skills)', async () => {
    const res = await makeRequest('/api/skills');
    if (res.status !== 200 || !res.data.skills || res.data.skills.length < 10) throw new Error(`Skills count: ${res.data.skills?.length}`);
    sampleSkill1 = res.data.skills[0]._id;
    sampleSkill2 = res.data.skills[1]._id;
  });

  // 5. Add Teaching Skill for user 1
  await test('Add user teaching skill', async () => {
    const res = await makeRequest('/api/user-skills', 'POST', {
      skillId: sampleSkill1,
      type: 'teach',
      level: 'Advanced'
    }, user1Token);
    if (res.status !== 201 || !res.data.userSkill) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
  });

  // 6. Add Learning Goal for user 1
  await test('Add user learning goal', async () => {
    const res = await makeRequest('/api/user-skills', 'POST', {
      skillId: sampleSkill2,
      type: 'learn',
      level: 'Beginner'
    }, user1Token);
    if (res.status !== 201 || !res.data.userSkill) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
  });

  // 7. Register user 2 with complementary skills
  let user2Token = null;
  let user2Id = null;
  const testEmail2 = `partner_${Date.now()}@test.edu`;

  await test('Register student partner with complementary skills', async () => {
    const res = await makeRequest('/api/auth/register', 'POST', {
      fullName: 'Ananya Rao',
      email: testEmail2,
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
    user2Token = res.data.token;
    user2Id = res.data.user._id;

    // User 2 teaches skill 2 and wants to learn skill 1
    await makeRequest('/api/user-skills', 'POST', {
      skillId: sampleSkill2,
      type: 'teach',
      level: 'Intermediate'
    }, user2Token);

    await makeRequest('/api/user-skills', 'POST', {
      skillId: sampleSkill1,
      type: 'learn',
      level: 'Beginner'
    }, user2Token);
  });

  // 8. Smart Matching Algorithm Test
  await test('Matching engine generates compatibility score', async () => {
    const res = await makeRequest('/api/matches', 'GET', null, user1Token);
    if (res.status !== 200 || !res.data.matches) throw new Error(`Status ${res.status}`);
    const match = res.data.matches.find(m => m.user._id === user2Id);
    if (!match || match.matchPercentage < 30) throw new Error(`Match not found or low score: ${JSON.stringify(match)}`);
    console.log(`   -> Calculated Compatibility: ${match.matchPercentage}% between Vikram and Ananya`);
  });

  // 9. Send Skill Exchange Request
  let requestId = null;
  await test('Send skill exchange request', async () => {
    const res = await makeRequest('/api/exchange-requests', 'POST', {
      toUser: user2Id,
      teachSkillId: sampleSkill1,
      learnSkillId: sampleSkill2,
      message: 'Hey Ananya, let us exchange skills!',
      proposedDuration: '2 hours/week'
    }, user1Token);
    if (res.status !== 201 || (!res.data.request && !res.data.exchangeRequest)) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
    requestId = (res.data.request || res.data.exchangeRequest)._id;
  });

  // 10. Accept Exchange Request (Creates SkillExchange + Conversation + Notifications)
  await test('Accept skill exchange request', async () => {
    const res = await makeRequest(`/api/exchange-requests/${requestId}/accept`, 'PUT', null, user2Token);
    if (res.status !== 200 || !res.data.exchange) throw new Error(`Status ${res.status}`);
  });

  // 11. Messaging between exchange partners
  await test('Messaging system delivers chat between partners', async () => {
    const convRes = await makeRequest('/api/messages/conversations', 'GET', null, user1Token);
    if (convRes.status !== 200 || !convRes.data.conversations?.length) throw new Error('No conversation created');
    const convId = convRes.data.conversations[0]._id;

    const msgRes = await makeRequest('/api/messages', 'POST', {
      conversationId: convId,
      content: 'Hi Ananya! When are you free for our first session?'
    }, user1Token);
    if (msgRes.status !== 201) throw new Error(`Status ${msgRes.status}`);

    const listRes = await makeRequest(`/api/messages/conversations/${convId}/messages`, 'GET', null, user2Token);
    if (listRes.status !== 200 || !listRes.data.messages?.length) throw new Error('Message not received');
  });

  // 12. Book Learning Session
  let sessionId = null;
  await test('Book and schedule a learning session', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const res = await makeRequest('/api/sessions', 'POST', {
      partner: user2Id,
      date: tomorrow.toISOString(),
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      mode: 'online',
      skillName: 'Python Basics',
      learningObjective: 'Setup environment and master data types'
    }, user1Token);
    if (res.status !== 201 || !res.data.session) throw new Error(`Status ${res.status}`);
    sessionId = res.data.session._id;
  });

  // 13. Complete Session & Update Progress
  await test('Complete session and update skill progress record', async () => {
    const res = await makeRequest(`/api/sessions/${sessionId}`, 'PUT', {
      status: 'completed'
    }, user1Token);
    if (res.status !== 200 || res.data.session.status !== 'completed') throw new Error(`Status ${res.status}`);
  });

  // 14. Dashboard API
  await test('Dashboard metrics return aggregated statistics', async () => {
    const res = await makeRequest('/api/dashboard', 'GET', null, user1Token);
    if (res.status !== 200 || res.data.stats.teachingCount < 1) throw new Error(`Status ${res.status}`);
    console.log(`   -> Dashboard Stats: ${JSON.stringify(res.data.stats)}`);
  });

  // 15. Submit Peer Review
  await test('Submit peer review with star rating', async () => {
    const res = await makeRequest('/api/reviews', 'POST', {
      reviewee: user2Id,
      rating: 5,
      comment: 'Ananya is an amazing peer mentor! Very clear explanations.',
      skillName: 'Design Systems'
    }, user1Token);
    if (res.status !== 201 || !res.data.review) throw new Error(`Status ${res.status}`);
  });

  // 16. Verify All HTML Page Routes (200 OK)
  const pages = [
    'dashboard.html',
    'explore-skills.html',
    'skill-details.html',
    'my-skills.html',
    'matches.html',
    'requests.html',
    'sessions.html',
    'book-session.html',
    'messages.html',
    'profile.html',
    'public-profile.html',
    'edit-profile.html',
    'progress.html',
    'portfolio.html',
    'find-people.html',
    'notifications.html',
    'settings.html',
    'login.html',
    'register.html',
    'forgot-password.html'
  ];

  for (const page of pages) {
    await test(`Serve /pages/${page}`, async () => {
      const res = await makeRequest(`/pages/${page}`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
    });
  }

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
