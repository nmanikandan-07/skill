const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Change password
// @route   PUT /api/settings/password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update privacy settings
// @route   PUT /api/settings/privacy
const updatePrivacy = async (req, res, next) => {
  try {
    const { profileVisibility, showEmail, showLocation } = req.body;
    
    const updates = {};
    if (profileVisibility) updates['privacySettings.profileVisibility'] = profileVisibility;
    if (showEmail !== undefined) updates['privacySettings.showEmail'] = showEmail;
    if (showLocation !== undefined) updates['privacySettings.showLocation'] = showLocation;
    
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    
    res.json({ message: 'Privacy settings updated', privacySettings: user.privacySettings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update notification preferences
// @route   PUT /api/settings/notifications
const updateNotificationPrefs = async (req, res, next) => {
  try {
    const prefs = req.body;
    const updates = {};
    
    for (const [key, value] of Object.entries(prefs)) {
      updates[`notificationPreferences.${key}`] = value;
    }
    
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    
    res.json({ message: 'Notification preferences updated', notificationPreferences: user.notificationPreferences });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account
// @route   DELETE /api/settings/account
const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }
    
    await User.findByIdAndDelete(req.user._id);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { changePassword, updatePrivacy, updateNotificationPrefs, deleteAccount };
