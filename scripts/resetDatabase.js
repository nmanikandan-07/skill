/**
 * SkillSync Database & Runtime Data Reset Script
 * 
 * DEVELOPMENT-ONLY UTILITY:
 * Safely clears all documents from all collections in the SkillSync database
 * and clears user uploaded files while preserving schemas, indexes, configurations,
 * and project source code.
 * 
 * Safety: Strictly validates that target database name is "skillsync".
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('../backend/config');

// Require all models to ensure schemas and indexes are registered
const Achievement = require('../backend/models/Achievement');
const ActivityLog = require('../backend/models/ActivityLog');
const Conversation = require('../backend/models/Conversation');
const ExchangeRequest = require('../backend/models/ExchangeRequest');
const Message = require('../backend/models/Message');
const Notification = require('../backend/models/Notification');
const Progress = require('../backend/models/Progress');
const Review = require('../backend/models/Review');
const SavedProfile = require('../backend/models/SavedProfile');
const Session = require('../backend/models/Session');
const Skill = require('../backend/models/Skill');
const SkillExchange = require('../backend/models/SkillExchange');
const User = require('../backend/models/User');
const UserAchievement = require('../backend/models/UserAchievement');
const UserSkill = require('../backend/models/UserSkill');

const EXPECTED_DB_NAME = 'skillsync';

function getDatabaseNameFromUri(uri) {
  if (!uri) return null;
  try {
    const cleanedUri = uri.split('?')[0];
    const slashParts = cleanedUri.split('/');
    return slashParts[slashParts.length - 1] || null;
  } catch {
    return null;
  }
}

async function clearUploads() {
  const uploadsDir = path.join(__dirname, '..', config.uploadDir || 'uploads');
  let deletedFilesCount = 0;

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    return deletedFilesCount;
  }

  const items = fs.readdirSync(uploadsDir);
  for (const item of items) {
    const itemPath = path.join(uploadsDir, item);
    const stat = fs.statSync(itemPath);
    if (stat.isFile() && item !== '.gitkeep') {
      fs.unlinkSync(itemPath);
      deletedFilesCount++;
    } else if (stat.isDirectory()) {
      fs.rmSync(itemPath, { recursive: true, force: true });
      deletedFilesCount++;
    }
  }

  return deletedFilesCount;
}

async function resetDatabase() {
  console.log('====================================================');
  console.log('       SkillSync Database & Data Reset Utility       ');
  console.log('====================================================\n');

  const mongoUri = process.env.MONGODB_URI || config.mongoUri || 'mongodb://localhost:27017/skillsync';
  const uriDbName = getDatabaseNameFromUri(mongoUri);

  console.log(`[Safety Check] Inspecting target database URI...`);
  console.log(`[Safety Check] Configured Database Name: "${uriDbName}"`);

  if (!uriDbName || uriDbName.toLowerCase() !== EXPECTED_DB_NAME) {
    console.error(`\n❌ [SAFETY ABORT] Target database "${uriDbName}" does NOT match required database "${EXPECTED_DB_NAME}".`);
    console.error(`Operation cancelled to prevent accidental deletion of other databases.\n`);
    process.exit(1);
  }

  console.log(`[Safety Check] ✅ Database name matches "${EXPECTED_DB_NAME}". Connecting to MongoDB...`);

  try {
    const conn = await mongoose.connect(mongoUri);
    const activeDbName = conn.connection.name;

    if (!activeDbName || activeDbName.toLowerCase() !== EXPECTED_DB_NAME) {
      console.error(`\n❌ [SAFETY ABORT] Connected database name "${activeDbName}" is not "${EXPECTED_DB_NAME}".`);
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log(`[Database] Connected to host: ${conn.connection.host}, database: ${activeDbName}`);
    console.log(`[Database] Clearing data from all collections while preserving schemas & indexes...\n`);

    const registeredModels = [
      { name: 'Users', model: User },
      { name: 'Skills', model: Skill },
      { name: 'UserSkills', model: UserSkill },
      { name: 'SkillExchanges', model: SkillExchange },
      { name: 'ExchangeRequests', model: ExchangeRequest },
      { name: 'Sessions', model: Session },
      { name: 'Messages', model: Message },
      { name: 'Conversations', model: Conversation },
      { name: 'Reviews', model: Review },
      { name: 'Progress', model: Progress },
      { name: 'Notifications', model: Notification },
      { name: 'ActivityLogs', model: ActivityLog },
      { name: 'SavedProfiles', model: SavedProfile },
      { name: 'Achievements', model: Achievement },
      { name: 'UserAchievements', model: UserAchievement },
    ];

    let totalDeletedDocs = 0;
    const clearedCollections = new Set();

    console.log('--- Collection Reset Details ---');
    for (const item of registeredModels) {
      const result = await item.model.deleteMany({});
      const count = result.deletedCount || 0;
      totalDeletedDocs += count;
      clearedCollections.add(item.model.collection.collectionName);
      console.log(` • ${item.name.padEnd(20)} (${item.model.collection.collectionName}): ${count} document(s) deleted`);
    }

    // Also inspect any other dynamic collections in the database
    const dbCollections = await conn.connection.db.collections();
    for (const col of dbCollections) {
      if (!clearedCollections.has(col.collectionName) && !col.collectionName.startsWith('system.')) {
        const result = await col.deleteMany({});
        const count = result.deletedCount || 0;
        totalDeletedDocs += count;
        console.log(` • [Dynamic] ${col.collectionName.padEnd(20)}: ${count} document(s) deleted`);
      }
    }

    // Clear uploads
    console.log('\n--- Storage Reset Details ---');
    const filesDeleted = await clearUploads();
    console.log(` • Uploads folder: ${filesDeleted} user file(s) removed (uploads/ preserved)`);

    // Verify final counts
    console.log('\n--- Final Verification Check ---');
    let allEmpty = true;
    for (const item of registeredModels) {
      const count = await item.model.countDocuments();
      if (count > 0) {
        allEmpty = false;
        console.warn(` ⚠️ ${item.name}: ${count} remaining`);
      }
    }

    if (allEmpty) {
      console.log(' ✅ All collections verified with 0 documents');
      console.log(' ✅ No fake or default users inserted');
      console.log(' ✅ Database is in clean empty initial state');
    }

    console.log('\n====================================================');
    console.log(`🎉 Reset Completed Successfully!`);
    console.log(`Total documents cleared: ${totalDeletedDocs}`);
    console.log(`Total upload files cleared: ${filesDeleted}`);
    console.log('====================================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Reset error:', error);
    try {
      await mongoose.connection.close();
    } catch (_) {}
    process.exit(1);
  }
}

if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;
