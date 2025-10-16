# Структура проекта BNB Creator Platform

## 📁 Общая структура

```
BNB/
├── client/                      # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Компоненты
│   │   │   ├── layout/
│   │   │   │   ├── Header.js
│   │   │   │   ├── Header.css
│   │   │   │   ├── Footer.js
│   │   │   │   └── Footer.css
│   │   │   └── modals/
│   │   │       ├── RoleSelectionModal.js
│   │   │       └── Modal.css
│   │   ├── context/             # React Context
│   │   │   ├── Web3Context.js   # Web3/Blockchain
│   │   │   └── UserContext.js   # Пользователь
│   │   ├── pages/               # Страницы
│   │   │   ├── HomePage.js
│   │   │   ├── HomePage.css
│   │   │   ├── ExplorePage.js
│   │   │   ├── ExplorePage.css
│   │   │   ├── CampaignDetailsPage.js
│   │   │   ├── CampaignDetailsPage.css
│   │   │   ├── CreateCampaignPage.js
│   │   │   ├── CreateCampaignPage.css
│   │   │   ├── ProfilePage.js
│   │   │   ├── ProfilePage.css
│   │   │   ├── CreatorsPage.js
│   │   │   ├── CreatorsPage.css
│   │   │   ├── DashboardPage.js
│   │   │   └── DashboardPage.css
│   │   ├── contracts/           # ABI контрактов
│   │   │   └── CreatorPlatform.json
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── .env.example
│
├── server/                      # Express Backend
│   ├── models/                  # Mongoose модели
│   │   ├── User.js
│   │   ├── Campaign.js
│   │   └── Submission.js
│   ├── routes/                  # API роуты
│   │   ├── users.js
│   │   ├── campaigns.js
│   │   ├── submissions.js
│   │   ├── creators.js
│   │   └── stats.js
│   ├── server.js                # Главный файл
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── contracts/                   # Smart Contracts
│   ├── contracts/
│   │   └── CreatorPlatform.sol  # Основной контракт
│   ├── scripts/
│   │   └── deploy.js            # Скрипт деплоя
│   ├── hardhat.config.js
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml           # Docker конфигурация
├── .dockerignore
├── .gitignore
├── package.json                 # Root package.json
├── README.md                    # Основная документация
├── QUICKSTART.md                # Быстрый старт
├── DEPLOYMENT.md                # Руководство по деплою
└── PROJECT_STRUCTURE.md         # Этот файл
```

## 🔧 Ключевые технологии

### Frontend
- **React 18**: UI framework
- **React Router 6**: Навигация
- **Ethers.js**: Web3 интеграция
- **Axios**: HTTP клиент
- **React Toastify**: Уведомления
- **React Icons**: Иконки
- **Framer Motion**: Анимации

### Backend
- **Express**: Web framework
- **MongoDB + Mongoose**: База данных
- **JWT**: Аутентификация
- **Web3.js**: Blockchain интеграция
- **Helmet**: Безопасность
- **CORS**: Cross-origin requests
- **Morgan**: Логирование

### Blockchain
- **Solidity 0.8.20**: Язык смарт-контрактов
- **Hardhat**: Development framework
- **OpenZeppelin**: Стандартные контракты
- **Binance Smart Chain**: Блокчейн сеть

## 📋 Основные компоненты

### Smart Contract (CreatorPlatform.sol)

**Функции:**
- `createCampaign()` - Создание кампании с депозитом BNB
- `createPayout()` - Создание выплаты креатору
- `completePayout()` - Выполнение выплаты (1% комиссия)
- `closeCampaign()` - Закрытие кампании с возвратом средств
- `getCampaign()` - Получение данных кампании

**События:**
- `CampaignCreated` - Создана кампания
- `PayoutCreated` - Создана выплата
- `PayoutCompleted` - Выплата выполнена

### Backend API

**Эндпоинты:**

#### Users (`/api/users`)
- `POST /auth` - Аутентификация/регистрация
- `PUT /profile` - Обновление профиля
- `GET /profile/:address` - Получить профиль
- `GET /creators/top` - Топ креаторов

#### Campaigns (`/api/campaigns`)
- `POST /` - Создать кампанию
- `GET /` - Список кампаний
- `GET /:id` - Детали кампании
- `GET /brand/:address` - Кампании бренда
- `PUT /:id` - Обновить кампанию

#### Submissions (`/api/submissions`)
- `POST /` - Создать заявку
- `GET /campaign/:id` - Заявки кампании
- `GET /creator/:address` - Заявки креатора
- `PUT /:id/status` - Обновить статус
- `PUT /:id/metrics` - Обновить метрики

#### Creators (`/api/creators`)
- `GET /` - Список креаторов с фильтрами
- `GET /:address/stats` - Статистика креатора
- `PUT /:address/followers` - Обновить подписчиков

#### Stats (`/api/stats`)
- `GET /platform` - Общая статистика
- `GET /campaigns/top` - Топ кампаний
- `GET /activity/recent` - Последняя активность

### Frontend Страницы

#### HomePage
- Hero секция с CTA
- Статистика платформы
- Особенности
- Как это работает
- CTA секция

#### ExplorePage
- Список всех кампаний
- Фильтры по типу, категории, статусу
- Карточки кампаний

#### CampaignDetailsPage
- Детальная информация о кампании
- Требования
- Призы
- Список заявок
- Форма подачи заявки

#### CreateCampaignPage
- Форма создания кампании
- Настройка бюджета
- Настройка призов
- Требования к креаторам
- Web3 интеграция

#### ProfilePage
- Информация о пользователе
- Статистика креатора/бренда
- Редактирование профиля

#### CreatorsPage
- База креаторов
- Фильтры
- Карточки с статистикой

#### DashboardPage
- Личный кабинет
- Мои кампании (для брендов)
- Мои заявки (для креаторов)
- Статистика

## 🗄️ База данных (MongoDB)

### Collections

#### users
```javascript
{
  walletAddress: String,
  role: String, // 'brand' | 'creator'
  profile: {
    displayName: String,
    bio: String,
    avatar: String,
    website: String,
    email: String
  },
  social: {
    tiktok: String,
    twitter: String
  },
  stats: {
    tiktokFollowers: Number,
    twitterFollowers: Number,
    totalEarned: Number,
    successfulSubmissions: Number
  },
  isVerified: Boolean,
  createdAt: Date
}
```

#### campaigns
```javascript
{
  contractId: Number,
  brand: ObjectId,
  brandWallet: String,
  title: String,
  description: String,
  type: String, // 'contest' | 'deal'
  category: String,
  budget: {
    total: Number,
    remaining: Number,
    currency: String
  },
  prizes: [{
    place: Number,
    amount: Number,
    description: String
  }],
  requirements: {
    platforms: [String],
    minFollowers: Number,
    contentType: String,
    guidelines: String,
    hashtags: [String]
  },
  duration: {
    startDate: Date,
    endDate: Date
  },
  status: String, // 'active' | 'completed' | 'cancelled'
  stats: {
    totalSubmissions: Number,
    totalViews: Number
  }
}
```

#### submissions
```javascript
{
  campaign: ObjectId,
  creator: ObjectId,
  platform: String, // 'tiktok' | 'twitter'
  content: {
    url: String,
    videoUrl: String,
    title: String
  },
  metrics: {
    views: Number,
    likes: Number,
    comments: Number,
    shares: Number,
    engagementRate: Number
  },
  status: String, // 'pending' | 'approved' | 'rejected' | 'winner'
  submittedAt: Date
}
```

## 🔐 Безопасность

### Smart Contract
- ✅ ReentrancyGuard от OpenZeppelin
- ✅ Ownable для административных функций
- ✅ Pausable для аварийной остановки
- ✅ Проверки на overflow/underflow

### Backend
- ✅ Helmet для HTTP заголовков
- ✅ Rate limiting
- ✅ JWT аутентификация
- ✅ Валидация входных данных
- ✅ CORS конфигурация

### Frontend
- ✅ Web3 подключение только по запросу
- ✅ Валидация MetaMask
- ✅ Проверка сети
- ✅ Обработка ошибок

## 🚀 Деплой

### Development
```bash
npm run dev
```

### Production

**Docker:**
```bash
docker-compose up -d
```

**Раздельно:**
- Frontend: Vercel/Netlify
- Backend: VPS/Heroku/Railway
- Database: MongoDB Atlas

## 📊 Workflow

### Создание кампании (Бренд)
1. Пользователь создаёт кампанию через форму
2. Frontend вызывает `createCampaign()` в смарт-контракте
3. BNB блокируются в контракте
4. Backend сохраняет данные в MongoDB
5. Кампания появляется в списке

### Подача заявки (Креатор)
1. Креатор создаёт контент в TikTok/X
2. Отправляет заявку с ссылкой
3. Backend сохраняет в MongoDB
4. Бренд видит заявку в своём дашборде

### Выплата (Бренд)
1. Бренд выбирает победителей
2. Frontend вызывает `createPayout()` + `completePayout()`
3. Смарт-контракт переводит BNB креатору (минус 1%)
4. 1% идёт в feeCollector адрес
5. Backend обновляет статус

## 🔄 Будущие улучшения

- [ ] Интеграция с TikTok/Twitter API для автоматического сбора метрик
- [ ] Система рейтингов и отзывов
- [ ] Мультиязычность
- [ ] Push-уведомления
- [ ] Чат между брендами и креаторами
- [ ] Advanced аналитика и графики
- [ ] NFT сертификаты для победителей
- [ ] Staking механизм
- [ ] DAO для управления платформой

## 📞 Поддержка

Документация:
- [README.md](README.md) - Основная документация
- [QUICKSTART.md](QUICKSTART.md) - Быстрый старт
- [DEPLOYMENT.md](DEPLOYMENT.md) - Руководство по деплою

---

**Версия:** 1.0.0  
**Дата обновления:** 2024  
**Лицензия:** MIT

