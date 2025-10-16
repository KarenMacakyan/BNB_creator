# 🚀 Vercel Deployment Guide

Полное руководство по деплою BNB Creator Platform на Vercel для реального использования и монетизации.

## 📋 Подготовка

### 1. Создайте аккаунты

- ✅ [Vercel](https://vercel.com) - для хостинга
- ✅ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - для базы данных
- ✅ GitHub - для репозитория

### 2. Задеплойте Smart Contract

```bash
cd contracts

# Настройте .env
echo "PRIVATE_KEY=ваш_приватный_ключ" > .env

# Деплой на BSC Mainnet (для реального использования)
npx hardhat run scripts/deploy.js --network bsc_mainnet

# Сохраните адрес контракта!
# Пример: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
```

## 🗄️ Настройка MongoDB Atlas

### Шаг 1: Создание кластера

1. Зайдите на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Создайте новый проект "BNB Creator Platform"
3. Создайте FREE кластер (M0 Sandbox)
   - Выберите регион (рекомендуется AWS us-east-1)
   - Назовите кластер "BNBCreator"

### Шаг 2: Настройка доступа

1. Database Access → Add New Database User
   - Username: `bnbadmin`
   - Password: сгенерируйте сложный пароль
   - Role: `Atlas admin`

2. Network Access → Add IP Address
   - Выберите "Allow access from anywhere" (0.0.0.0/0)
   - Это нужно для Vercel

### Шаг 3: Получение Connection String

1. Clusters → Connect → Connect your application
2. Скопируйте connection string:
```
mongodb+srv://bnbadmin:<password>@bnbcreator.xxxxx.mongodb.net/bnb-creator-platform?retryWrites=true&w=majority
```
3. Замените `<password>` на ваш пароль

## 🎯 Деплой Backend на Vercel

### Шаг 1: Подготовка репозитория

```bash
cd /Users/macbook/Desktop/BNB

# Инициализация git (если ещё не сделано)
git init
git add .
git commit -m "Initial commit - BNB Creator Platform"

# Создайте репозиторий на GitHub и пушьте
git remote add origin https://github.com/your-username/bnb-creator-platform.git
git branch -M main
git push -u origin main
```

### Шаг 2: Деплой Backend

1. Зайдите на [Vercel](https://vercel.com)
2. New Project → Import Git Repository
3. Выберите ваш репозиторий
4. Настройте проект:

**Project Name:** `bnb-creator-backend`

**Root Directory:** `server`

**Environment Variables:**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://bnbadmin:PASSWORD@bnbcreator.xxxxx.mongodb.net/bnb-creator-platform
JWT_SECRET=генерируйте_очень_сложный_секрет_минимум_64_символа
CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc454e4438f44e
BSC_RPC_URL=https://bsc-dataseed.binance.org/
BSC_CHAIN_ID=56
FRONTEND_URL=https://bnb-creator.vercel.app
```

**Как сгенерировать JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

5. Deploy!

6. После деплоя скопируйте URL:
```
https://bnb-creator-backend.vercel.app
```

## 🎨 Деплой Frontend на Vercel

### Шаг 1: Настройка переменных

Создайте новый проект в Vercel:

**Project Name:** `bnb-creator`

**Root Directory:** `client`

**Build Command:** `npm run build`

**Environment Variables:**
```env
REACT_APP_CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc454e4438f44e
REACT_APP_API_URL=https://bnb-creator-backend.vercel.app
```

### Шаг 2: Обновите код frontend

Обновите `client/package.json`:
```json
{
  "proxy": "https://bnb-creator-backend.vercel.app"
}
```

Или обновите `client/src/index.js` для использования API_URL:
```javascript
// В начале файла
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;
```

### Шаг 3: Deploy

1. Deploy проект
2. Ваш сайт будет доступен по адресу:
```
https://bnb-creator.vercel.app
```

## 🔧 Настройка Custom Domain (опционально)

### Если у вас есть домен:

1. Vercel → Settings → Domains
2. Добавьте свой домен: `bnbcreator.io`
3. Настройте DNS записи у регистратора
4. Обновите `FRONTEND_URL` в backend env variables

## 💰 Монетизация

### 1. Комиссия платформы (1%)

Комиссия автоматически взимается смарт-контрактом при каждой выплате:
- Креатор получает 99%
- Платформа получает 1%

**Адрес для сбора комиссий:**
```solidity
// В смарт-контракте
address payable public feeCollector;
```

Это ваш wallet address, который вы указали при деплое контракта.

### 2. Мониторинг доходов

Создайте dashboard для отслеживания:

```javascript
// В backend добавьте эндпоинт
router.get('/api/admin/revenue', async (req, res) => {
  const totalRevenue = await Submission.aggregate([
    { $match: { status: 'winner' } },
    { $group: { _id: null, total: { $sum: '$bid.amount' } } }
  ]);
  
  const platformFee = totalRevenue[0].total * 0.01;
  res.json({ 
    totalRevenue: totalRevenue[0].total,
    platformFee,
    transactionCount: await Submission.countDocuments({ status: 'winner' })
  });
});
```

### 3. Проверка баланса кошелька

```bash
# Установите BSCScan API
npm install axios

# Проверьте баланс вашего feeCollector кошелька
curl "https://api.bscscan.com/api?module=account&action=balance&address=ВАШ_АДРЕС&apikey=YOUR_API_KEY"
```

### 4. Вывод заработанных средств

Средства накапливаются в смарт-контракте на адресе `feeCollector`. Для вывода:

```javascript
// Используйте функцию в контракте (если добавите)
function withdrawFees() external onlyOwner {
    payable(owner()).transfer(address(this).balance);
}
```

## 📊 Аналитика и мониторинг

### Google Analytics (опционально)

```bash
cd client
npm install react-ga4
```

```javascript
// В client/src/index.js
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
ReactGA.send("pageview");
```

### Мониторинг ошибок - Sentry

```bash
cd client
npm install @sentry/react

cd ../server
npm install @sentry/node
```

## 🔐 Безопасность

### 1. Rate Limiting

В `server/server.js` уже настроен rate limiting:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // макс 100 запросов
});
```

### 2. CORS

Обновите CORS в production:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 3. Переменные окружения

✅ Никогда не коммитьте `.env` файлы
✅ Используйте сложные JWT секреты
✅ Регулярно меняйте пароли MongoDB

## 📈 Масштабирование

### MongoDB Atlas - Upgrade при росте

- Free (M0): 512 MB - для тестирования
- M2: $9/месяц - 2GB - начальный трафик
- M5: $25/месяц - 5GB - средний трафик
- M10: $57/месяц - 10GB - высокий трафик

### Vercel - Pricing

- Hobby: FREE
  - 100GB bandwidth
  - Unlimited requests
  - Достаточно для старта

- Pro: $20/месяц
  - Больше bandwidth
  - Аналитика
  - Поддержка

## 🎉 Финальные шаги

1. ✅ Задеплойте smart contract на BSC Mainnet
2. ✅ Настройте MongoDB Atlas
3. ✅ Задеплойте backend на Vercel
4. ✅ Задеплойте frontend на Vercel
5. ✅ Протестируйте весь flow:
   - Подключение кошелька
   - Создание кампании
   - Отправка заявки
   - Выплата креатору
6. ✅ Добавьте свой кошелёк как feeCollector
7. ✅ Начните привлекать пользователей!

## 💵 Ожидаемый доход

**Пример расчёта:**
- 10 кампаний в месяц
- Средний бюджет: 1 BNB ($600)
- Комиссия: 1%
- **Доход: 0.1 BNB ($60) в месяц**

**При масштабировании:**
- 100 кампаний в месяц
- **Доход: 1 BNB ($600) в месяц**
- 1000 кампаний в месяц
- **Доход: 10 BNB ($6000) в месяц**

## 🚨 Troubleshooting

### Backend не запускается на Vercel

1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все env переменные установлены
3. Проверьте MongoDB connection string

### Frontend не подключается к backend

1. Проверьте CORS настройки
2. Убедитесь, что `REACT_APP_API_URL` правильный
3. Проверьте в DevTools → Network

### Транзакции не проходят

1. Проверьте адрес контракта
2. Убедитесь, что используете BSC Mainnet
3. Проверьте баланс BNB для gas

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи Vercel
2. Проверьте MongoDB Atlas logs
3. Проверьте BSCScan для транзакций

---

**Готово! Ваша платформа готова к запуску и монетизации!** 🚀💰

