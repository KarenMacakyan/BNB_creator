# BNB Creator Platform

Полноценная площадка-посредник для создателей контента (TikTok и X) с оплатой в BNB.

## 🚀 Особенности

- ⚡ **Низкая комиссия**: Всего 1% с транзакций
- 💰 **Прямые выплаты**: Креаторы получают BNB напрямую на кошелёк
- 🔒 **Безопасность**: Смарт-контракты на Binance Smart Chain
- 🎯 **Два типа кампаний**: Конкурсы и сделки
- 📊 **Аналитика**: Отслеживание метрик в реальном времени
- 🌐 **White-label**: Возможность создания собственных решений

## 📦 Структура проекта

```
BNB/
├── client/          # React frontend
├── server/          # Express backend + MongoDB
├── contracts/       # Solidity смарт-контракты
└── README.md
```

## 🛠 Технологии

### Frontend
- React 18
- Web3.js / Ethers.js
- React Router
- Axios
- React Toastify

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Web3 Integration

### Blockchain
- Solidity 0.8.20
- Hardhat
- OpenZeppelin Contracts
- Binance Smart Chain (BSC)

## 📋 Установка

### 1. Клонируйте репозиторий

```bash
cd BNB
```

### 2. Установите зависимости

```bash
npm run install-all
```

Эта команда установит зависимости для всех частей проекта:
- Корневого проекта
- Client (React)
- Server (Express)
- Contracts (Hardhat)

### 3. Настройте переменные окружения

#### Backend (.env в папке server/)

```bash
cd server
cp .env.example .env
```

Отредактируйте `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bnb-creator-platform
JWT_SECRET=ваш_секретный_ключ
CONTRACT_ADDRESS=адрес_задеплоенного_контракта
BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
BSC_CHAIN_ID=97
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env в папке client/)

```bash
cd client
echo "REACT_APP_CONTRACT_ADDRESS=адрес_задеплоенного_контракта" > .env
```

#### Smart Contracts (.env в папке contracts/)

```bash
cd contracts
cp .env.example .env
```

Отредактируйте `contracts/.env`:

```env
PRIVATE_KEY=ваш_приватный_ключ_без_0x
CONTRACT_ADDRESS=
```

### 4. Установите MongoDB

```bash
# macOS (с Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Windows
# Скачайте с https://www.mongodb.com/try/download/community
```

## 🚀 Запуск

### Разработка (все сервисы одновременно)

```bash
npm run dev
```

Это запустит:
- Frontend на http://localhost:3000
- Backend на http://localhost:5000

### Или запустите отдельно:

#### Frontend

```bash
cd client
npm start
```

#### Backend

```bash
cd server
npm run dev
```

## 📝 Деплой смарт-контракта

### 1. Компиляция

```bash
cd contracts
npx hardhat compile
```

### 2. Тестирование (опционально)

```bash
npx hardhat test
```

### 3. Деплой на BSC Testnet

```bash
npx hardhat run scripts/deploy.js --network bsc_testnet
```

После деплоя:
1. Скопируйте адрес контракта
2. Добавьте его в `server/.env` как `CONTRACT_ADDRESS`
3. Добавьте его в `client/.env` как `REACT_APP_CONTRACT_ADDRESS`

### 4. Деплой на BSC Mainnet

```bash
# Убедитесь, что у вас достаточно BNB на кошельке!
npx hardhat run scripts/deploy.js --network bsc_mainnet
```

## 🌐 Деплой на сервер

### Frontend (Vercel/Netlify)

#### Vercel

```bash
cd client
npm run build
vercel --prod
```

#### Netlify

```bash
cd client
npm run build
# Загрузите папку build/ через Netlify UI или CLI
```

### Backend (VPS/Heroku/Railway)

#### На VPS (Ubuntu)

```bash
# 1. Установите Node.js и MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb

# 2. Клонируйте репозиторий
git clone <your-repo-url>
cd BNB/server

# 3. Установите зависимости
npm install

# 4. Настройте .env
nano .env

# 5. Установите PM2
npm install -g pm2

# 6. Запустите сервер
pm2 start server.js --name bnb-creator-api
pm2 save
pm2 startup
```

#### Heroku

```bash
cd server
heroku create your-app-name
heroku addons:create mongolab
heroku config:set NODE_ENV=production
git push heroku main
```

#### Railway

1. Создайте проект на [Railway.app](https://railway.app)
2. Подключите GitHub репозиторий
3. Добавьте MongoDB addon
4. Настройте переменные окружения
5. Деплой происходит автоматически

## 🔧 Настройка MetaMask

### BSC Testnet

1. Откройте MetaMask
2. Networks → Add Network → Add Network Manually
3. Введите данные:
   - Network Name: BSC Testnet
   - RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545
   - Chain ID: 97
   - Currency Symbol: BNB
   - Block Explorer: https://testnet.bscscan.com

### Получите тестовые BNB

https://testnet.binance.org/faucet-smart

## 📖 API Документация

### Users

- `POST /api/users/auth` - Аутентификация / создание пользователя
- `PUT /api/users/profile` - Обновление профиля
- `GET /api/users/profile/:walletAddress` - Получить профиль
- `GET /api/users/creators/top` - Топ креаторов

### Campaigns

- `POST /api/campaigns` - Создать кампанию
- `GET /api/campaigns` - Получить все кампании
- `GET /api/campaigns/:id` - Получить кампанию
- `GET /api/campaigns/brand/:walletAddress` - Кампании бренда
- `PUT /api/campaigns/:id` - Обновить кампанию

### Submissions

- `POST /api/submissions` - Создать заявку
- `GET /api/submissions/campaign/:campaignId` - Заявки кампании
- `GET /api/submissions/creator/:walletAddress` - Заявки креатора
- `PUT /api/submissions/:id/status` - Обновить статус
- `PUT /api/submissions/:id/metrics` - Обновить метрики

### Creators

- `GET /api/creators` - Получить всех креаторов
- `GET /api/creators/:walletAddress/stats` - Статистика креатора

### Stats

- `GET /api/stats/platform` - Общая статистика платформы

## 🔐 Безопасность

1. **Приватные ключи**: Никогда не коммитьте приватные ключи в Git
2. **JWT Secret**: Используйте сложный и уникальный секрет
3. **Rate Limiting**: Включён для защиты от DDoS
4. **Helmet**: Добавлены заголовки безопасности
5. **CORS**: Настроен для production

## 🧪 Тестирование

```bash
# Backend тесты
cd server
npm test

# Frontend тесты
cd client
npm test

# Smart contract тесты
cd contracts
npx hardhat test
```

## 📊 Мониторинг

Рекомендуемые сервисы:
- **Frontend**: Vercel Analytics, Google Analytics
- **Backend**: PM2 Monitor, Datadog, New Relic
- **Blockchain**: BSCScan API, The Graph

## 🤝 Вклад в проект

1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - см. файл LICENSE

## 💬 Поддержка

Если у вас возникли вопросы:
- Создайте Issue на GitHub
- Напишите в Telegram: @your_telegram
- Email: your@email.com

## 🔗 Полезные ссылки

- [BSC Documentation](https://docs.binance.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

---

**Создано с ❤️ для Web3 коммьюнити**

