const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Создать кампанию
router.post('/', [
  body('title').notEmpty().withMessage('Название обязательно'),
  body('description').notEmpty().withMessage('Описание обязательно'),
  body('type').isIn(['contest', 'deal']).withMessage('Неверный тип'),
  body('category').notEmpty().withMessage('Категория обязательна'),
  body('contractId').isNumeric().withMessage('Contract ID обязателен')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const campaignData = req.body;
    
    // Найти пользователя-бренда
    const brand = await User.findOne({ 
      walletAddress: campaignData.brandWallet.toLowerCase() 
    });

    if (!brand || brand.role !== 'brand') {
      return res.status(403).json({ error: 'Только бренды могут создавать кампании' });
    }

    const campaign = new Campaign({
      ...campaignData,
      brand: brand._id
    });

    await campaign.save();

    res.status(201).json({ campaign });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Ошибка создания кампании' });
  }
});

// Получить все активные кампании
router.get('/', async (req, res) => {
  try {
    const { type, category, status } = req.query;
    
    let filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    else filter.status = 'active'; // По умолчанию только активные

    const campaigns = await Campaign.find(filter)
      .populate('brand', 'profile walletAddress')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ campaigns });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Ошибка получения кампаний' });
  }
});

// Получить кампанию по ID
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('brand', 'profile walletAddress social')
      .populate('winners.creator', 'profile walletAddress stats');

    if (!campaign) {
      return res.status(404).json({ error: 'Кампания не найдена' });
    }

    res.json({ campaign });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ error: 'Ошибка получения кампании' });
  }
});

// Получить кампании бренда
router.get('/brand/:walletAddress', async (req, res) => {
  try {
    const brand = await User.findOne({ 
      walletAddress: req.params.walletAddress.toLowerCase() 
    });

    if (!brand) {
      return res.status(404).json({ error: 'Бренд не найден' });
    }

    const campaigns = await Campaign.find({ brand: brand._id })
      .sort({ createdAt: -1 });

    res.json({ campaigns });
  } catch (error) {
    console.error('Get brand campaigns error:', error);
    res.status(500).json({ error: 'Ошибка получения кампаний бренда' });
  }
});

// Обновить кампанию
router.put('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ error: 'Кампания не найдена' });
    }

    res.json({ campaign });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: 'Ошибка обновления кампании' });
  }
});

// Добавить победителя
router.post('/:id/winners', async (req, res) => {
  try {
    const { creatorId, submissionId, place, amount } = req.body;

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ error: 'Кампания не найдена' });
    }

    campaign.winners.push({
      creator: creatorId,
      submission: submissionId,
      place,
      amount,
      paidAt: new Date()
    });

    await campaign.save();

    res.json({ campaign });
  } catch (error) {
    console.error('Add winner error:', error);
    res.status(500).json({ error: 'Ошибка добавления победителя' });
  }
});

module.exports = router;

