const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Создать заявку
router.post('/', [
  body('campaignId').notEmpty().withMessage('ID кампании обязателен'),
  body('creatorWallet').isEthereumAddress().withMessage('Некорректный адрес кошелька'),
  body('platform').isIn(['tiktok', 'twitter']).withMessage('Неверная платформа'),
  body('content.url').isURL().withMessage('Некорректный URL контента')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { campaignId, creatorWallet, platform, content, bid } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Кампания не найдена' });
    }

    if (campaign.status !== 'active') {
      return res.status(400).json({ error: 'Кампания неактивна' });
    }

    const creator = await User.findOne({ walletAddress: creatorWallet.toLowerCase() });
    if (!creator || creator.role !== 'creator') {
      return res.status(403).json({ error: 'Только креаторы могут отправлять заявки' });
    }

    // Проверка на дубликат
    const existingSubmission = await Submission.findOne({
      campaign: campaignId,
      creator: creator._id,
      'content.url': content.url
    });

    if (existingSubmission) {
      return res.status(400).json({ error: 'Эта заявка уже отправлена' });
    }

    const submission = new Submission({
      campaign: campaignId,
      creator: creator._id,
      platform,
      content,
      bid
    });

    await submission.save();

    // Обновить статистику кампании
    campaign.stats.totalSubmissions += 1;
    campaign.stats.totalParticipants = await Submission.distinct('creator', { campaign: campaignId }).length;
    await campaign.save();

    res.status(201).json({ submission });
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ error: 'Ошибка создания заявки' });
  }
});

// Получить заявки кампании
router.get('/campaign/:campaignId', async (req, res) => {
  try {
    const { status, sortBy } = req.query;
    
    let filter = { campaign: req.params.campaignId };
    if (status) filter.status = status;

    let sort = { submittedAt: -1 };
    if (sortBy === 'views') sort = { 'metrics.views': -1 };
    if (sortBy === 'engagement') sort = { 'metrics.engagementRate': -1 };

    const submissions = await Submission.find(filter)
      .populate('creator', 'profile walletAddress stats')
      .sort(sort);

    res.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Ошибка получения заявок' });
  }
});

// Получить заявки креатора
router.get('/creator/:walletAddress', async (req, res) => {
  try {
    const creator = await User.findOne({ 
      walletAddress: req.params.walletAddress.toLowerCase() 
    });

    if (!creator) {
      return res.status(404).json({ error: 'Креатор не найден' });
    }

    const submissions = await Submission.find({ creator: creator._id })
      .populate('campaign', 'title type budget status')
      .sort({ submittedAt: -1 });

    res.json({ submissions });
  } catch (error) {
    console.error('Get creator submissions error:', error);
    res.status(500).json({ error: 'Ошибка получения заявок креатора' });
  }
});

// Обновить статус заявки
router.put('/:id/status', async (req, res) => {
  try {
    const { status, feedback } = req.body;

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    submission.status = status;
    
    if (feedback) {
      submission.feedback = {
        ...feedback,
        reviewedAt: new Date()
      };
    }

    await submission.save();

    res.json({ submission });
  } catch (error) {
    console.error('Update submission status error:', error);
    res.status(500).json({ error: 'Ошибка обновления статуса заявки' });
  }
});

// Обновить метрики заявки
router.put('/:id/metrics', async (req, res) => {
  try {
    const { views, likes, comments, shares } = req.body;

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    if (views !== undefined) submission.metrics.views = views;
    if (likes !== undefined) submission.metrics.likes = likes;
    if (comments !== undefined) submission.metrics.comments = comments;
    if (shares !== undefined) submission.metrics.shares = shares;

    await submission.save();

    // Обновить общую статистику кампании
    const campaign = await Campaign.findById(submission.campaign);
    if (campaign) {
      const allSubmissions = await Submission.find({ campaign: campaign._id });
      campaign.stats.totalViews = allSubmissions.reduce((sum, sub) => sum + sub.metrics.views, 0);
      await campaign.save();
    }

    res.json({ submission });
  } catch (error) {
    console.error('Update metrics error:', error);
    res.status(500).json({ error: 'Ошибка обновления метрик' });
  }
});

module.exports = router;

