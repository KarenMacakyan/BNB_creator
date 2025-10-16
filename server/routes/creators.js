const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');

// Получить всех креаторов с фильтрами
router.get('/', async (req, res) => {
  try {
    const { 
      platform, 
      minFollowers, 
      maxFollowers,
      category,
      region,
      verified,
      limit = 50 
    } = req.query;

    let filter = { role: 'creator' };

    if (minFollowers) {
      filter['stats.tiktokFollowers'] = { $gte: parseInt(minFollowers) };
    }

    if (maxFollowers) {
      filter['stats.tiktokFollowers'] = { 
        ...filter['stats.tiktokFollowers'], 
        $lte: parseInt(maxFollowers) 
      };
    }

    if (verified === 'true') {
      filter.isVerified = true;
    }

    const creators = await User.find(filter)
      .sort({ 'stats.tiktokFollowers': -1 })
      .limit(parseInt(limit));

    res.json({ creators, total: creators.length });
  } catch (error) {
    console.error('Get creators error:', error);
    res.status(500).json({ error: 'Ошибка получения креаторов' });
  }
});

// Получить статистику креатора
router.get('/:walletAddress/stats', async (req, res) => {
  try {
    const creator = await User.findOne({ 
      walletAddress: req.params.walletAddress.toLowerCase() 
    });

    if (!creator || creator.role !== 'creator') {
      return res.status(404).json({ error: 'Креатор не найден' });
    }

    // Получить все заявки креатора
    const submissions = await Submission.find({ creator: creator._id })
      .populate('campaign', 'title type');

    // Подсчитать статистику
    const stats = {
      profile: creator.profile,
      social: creator.social,
      totalSubmissions: submissions.length,
      approvedSubmissions: submissions.filter(s => s.status === 'approved').length,
      winnerSubmissions: submissions.filter(s => s.status === 'winner').length,
      totalViews: submissions.reduce((sum, s) => sum + s.metrics.views, 0),
      totalLikes: submissions.reduce((sum, s) => sum + s.metrics.likes, 0),
      avgEngagementRate: submissions.length > 0 
        ? submissions.reduce((sum, s) => sum + s.metrics.engagementRate, 0) / submissions.length 
        : 0,
      totalEarned: creator.stats.totalEarned,
      joinedDate: creator.createdAt,
      recentSubmissions: submissions.slice(0, 5)
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get creator stats error:', error);
    res.status(500).json({ error: 'Ошибка получения статистики креатора' });
  }
});

// Обновить статистику подписчиков креатора
router.put('/:walletAddress/followers', async (req, res) => {
  try {
    const { tiktokFollowers, twitterFollowers } = req.body;

    const creator = await User.findOne({ 
      walletAddress: req.params.walletAddress.toLowerCase() 
    });

    if (!creator || creator.role !== 'creator') {
      return res.status(404).json({ error: 'Креатор не найден' });
    }

    if (tiktokFollowers !== undefined) {
      creator.stats.tiktokFollowers = tiktokFollowers;
    }

    if (twitterFollowers !== undefined) {
      creator.stats.twitterFollowers = twitterFollowers;
    }

    await creator.save();

    res.json({ creator });
  } catch (error) {
    console.error('Update followers error:', error);
    res.status(500).json({ error: 'Ошибка обновления подписчиков' });
  }
});

module.exports = router;

