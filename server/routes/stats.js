const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Submission = require('../models/Submission');

// Получить общую статистику платформы
router.get('/platform', async (req, res) => {
  try {
    const [
      totalCampaigns,
      activeCampaigns,
      totalCreators,
      totalBrands,
      totalSubmissions
    ] = await Promise.all([
      Campaign.countDocuments(),
      Campaign.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'creator' }),
      User.countDocuments({ role: 'brand' }),
      Submission.countDocuments()
    ]);

    // Подсчитать общий бюджет и просмотры
    const campaigns = await Campaign.find();
    const submissions = await Submission.find();

    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget.total, 0);
    const totalViews = submissions.reduce((sum, s) => sum + s.metrics.views, 0);

    res.json({
      totalCampaigns,
      activeCampaigns,
      totalCreators,
      totalBrands,
      totalSubmissions,
      totalBudget,
      totalViews
    });
  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({ error: 'Ошибка получения статистики платформы' });
  }
});

// Получить топ кампаний по просмотрам
router.get('/campaigns/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const campaigns = await Campaign.find({ status: 'active' })
      .populate('brand', 'profile')
      .sort({ 'stats.totalViews': -1 })
      .limit(limit);

    res.json({ campaigns });
  } catch (error) {
    console.error('Get top campaigns error:', error);
    res.status(500).json({ error: 'Ошибка получения топ кампаний' });
  }
});

// Получить недавнюю активность
router.get('/activity/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const [recentCampaigns, recentSubmissions] = await Promise.all([
      Campaign.find()
        .populate('brand', 'profile')
        .sort({ createdAt: -1 })
        .limit(limit),
      Submission.find()
        .populate('creator', 'profile')
        .populate('campaign', 'title')
        .sort({ submittedAt: -1 })
        .limit(limit)
    ]);

    res.json({
      recentCampaigns,
      recentSubmissions
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ error: 'Ошибка получения последней активности' });
  }
});

module.exports = router;

