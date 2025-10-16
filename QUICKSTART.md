# 🚀 Быстрый старт

Запустите проект за 5 минут!

## Предварительные требования

- Node.js 16+ ([скачать](https://nodejs.org/))
- MongoDB ([установка](https://www.mongodb.com/docs/manual/installation/))
- MetaMask ([установить](https://metamask.io/))
- Git

## Шаг 1: Клонирование и установка

```bash
# Перейдите в папку проекта
cd /Users/macbook/Desktop/BNB

# Установите все зависимости
npm run install-all
```

## Шаг 2: Запуск MongoDB

### macOS
```bash
brew services start mongodb-community
```

### Linux
```bash
sudo systemctl start mongod
```

### Windows
```bash
# MongoDB должна запуститься автоматически после установки
# Или запустите через Services
```

## Шаг 3: Настройка Backend

```bash
cd server

# Создайте .env файл
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bnb-creator-platform
JWT_SECRET=my_super_secret_key_for_development_only
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
BSC_CHAIN_ID=97
FRONTEND_URL=http://localhost:3000
EOF
```

## Шаг 4: Настройка Frontend

```bash
cd ../client

# Создайте .env файл
echo "REACT_APP_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000" > .env
```

## Шаг 5: Запуск

### Вариант A: Запустить всё вместе

```bash
# Из корневой папки
cd ..
npm run dev
```

### Вариант B: Запустить отдельно

Терминал 1 (Backend):
```bash
cd server
npm run dev
```

Терминал 2 (Frontend):
```bash
cd client
npm start
```

## Шаг 6: Настройка MetaMask

1. Откройте MetaMask
2. Добавьте BSC Testnet:
   - Network Name: `BSC Testnet`
   - RPC URL: `https://data-seed-prebsc-1-s1.binance.org:8545`
   - Chain ID: `97`
   - Currency Symbol: `BNB`
   - Block Explorer: `https://testnet.bscscan.com`

3. Получите тестовые BNB:
   - Перейдите на https://testnet.binance.org/faucet-smart
   - Вставьте адрес вашего кошелька
   - Получите 0.5 BNB

## Шаг 7: Открытие приложения

Откройте браузер и перейдите по адресу:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Шаг 8: Первый вход

1. Нажмите "Подключить кошелёк"
2. Подтвердите подключение в MetaMask
3. Выберите роль (Бренд или Креатор)
4. Начинайте работать с платформой!

## 🎯 Что дальше?

### Если вы Бренд:
1. Перейдите в "Создать кампанию"
2. Заполните форму
3. Отправьте транзакцию (используйте тестовые BNB)

### Если вы Креатор:
1. Перейдите в "Кампании"
2. Найдите интересную кампанию
3. Подайте заявку

## 🐛 Проблемы?

### Приложение не открывается

```bash
# Проверьте, что порты свободны
lsof -i :3000
lsof -i :5000

# Убейте процессы если нужно
kill -9 <PID>
```

### MongoDB не запущена

```bash
# macOS
brew services restart mongodb-community

# Linux
sudo systemctl restart mongod
```

### MetaMask не подключается

1. Убедитесь, что выбрана правильная сеть (BSC Testnet)
2. Обновите страницу
3. Переподключите кошелёк

### Backend выдаёт ошибки

```bash
# Проверьте логи
cd server
npm run dev
```

## 📚 Полезные команды

```bash
# Остановить все процессы
# Ctrl + C в каждом терминале

# Очистить кэш и пересобрать
cd client
rm -rf node_modules build
npm install
npm start

# Сбросить базу данных
mongo
use bnb-creator-platform
db.dropDatabase()
```

## ✅ Готово!

Теперь у вас запущена полноценная площадка для создателей контента!

Для деплоя на production смотрите [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Нужна помощь?** Создайте Issue на GitHub или напишите в поддержку.

