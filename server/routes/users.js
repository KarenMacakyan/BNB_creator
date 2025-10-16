const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Получить или создать пользователя по wallet address
router.post('/auth', [
  body('walletAddress').isEthereumAddress().withMessage('Некорректный адрес кошелька'),
  body('role').isIn(['brand', 'creator']).withMessage('Роль должна быть brand или creator')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { walletAddress, role } = req.body;
    const normalizedAddress = walletAddress.toLowerCase();

    let user = await User.findOne({ walletAddress: normalizedAddress });

    if (!user) {
      user = new User({
        walletAddress: normalizedAddress,
        role
      });
      await user.save();
    }

    user.lastActive = Date.now();
    await user.save();

    res.json({ user });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Ошибка аутентификации' });
  }
});

// Обновить профиль
router.put('/profile', async (req, res) => {
  try {
    const { walletAddress, profile, social } = req.body;
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }
    
    if (social) {
      user.social = { ...user.social, ...social };
    }

    await user.save();

    res.json({ user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Ошибка обновления профиля' });
  }
});

// Получить профиль по адресу
router.get('/profile/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ 
      walletAddress: req.params.walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Ошибка получения профиля' });
  }
});

// Получить топ креаторов
router.get('/creators/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const creators = await User.find({ role: 'creator' })
      .sort({ 'stats.tiktokFollowers': -1 })
      .limit(limit);

    res.json({ creators });
  } catch (error) {
    console.error('Get top creators error:', error);
    res.status(500).json({ error: 'Ошибка получения креаторов' });
  }
});

// Поиск креаторов
router.get('/creators/search', async (req, res) => {
  try {
    const { query, minFollowers, platform } = req.query;
    
    let filter = { role: 'creator' };
    
    if (minFollowers) {
      filter['stats.tiktokFollowers'] = { $gte: parseInt(minFollowers) };
    }
    
    if (query) {
      filter.$or = [
        { 'profile.displayName': { $regex: query, $options: 'i' } },
        { 'profile.bio': { $regex: query, $options: 'i' } }
      ];
    }

    const creators = await User.find(filter).limit(50);

    res.json({ creators });
  } catch (error) {
    console.error('Search creators error:', error);
    res.status(500).json({ error: 'Ошибка поиска креаторов' });
  }
});

module.exports = router;

