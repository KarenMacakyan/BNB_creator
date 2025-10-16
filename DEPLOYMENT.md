# Руководство по деплою

Подробное руководство по развёртыванию BNB Creator Platform на production.

## 📋 Чеклист перед деплоем

- [ ] MongoDB база данных настроена
- [ ] Смарт-контракт задеплоен на BSC
- [ ] Переменные окружения настроены
- [ ] Frontend собран (`npm run build`)
- [ ] Backend протестирован
- [ ] Domain/SSL настроены

## 1️⃣ Деплой смарт-контракта

### Подготовка

1. Получите BNB на кошелёк для оплаты gas:
   - Testnet: https://testnet.binance.org/faucet-smart
   - Mainnet: купите BNB на бирже

2. Настройте `contracts/.env`:

```env
PRIVATE_KEY=ваш_приватный_ключ_БЕЗ_0x
```

⚠️ **ВАЖНО**: Никогда не делитесь приватным ключом и не коммитьте его в Git!

### Компиляция и деплой

```bash
cd contracts

# Компиляция контрактов
npx hardhat compile

# Деплой на Testnet
npx hardhat run scripts/deploy.js --network bsc_testnet

# Деплой на Mainnet (после тестирования!)
npx hardhat run scripts/deploy.js --network bsc_mainnet
```

### После деплоя

1. Сохраните адрес контракта
2. Верифицируйте контракт на BscScan:

```bash
npx hardhat verify --network bsc_mainnet АДРЕС_КОНТРАКТА
```

## 2️⃣ Настройка MongoDB

### Вариант A: MongoDB Atlas (рекомендуется)

1. Создайте аккаунт на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Создайте новый кластер (Free tier достаточно для начала)
3. Настройте Network Access (разрешите доступ с IP вашего сервера)
4. Создайте Database User
5. Получите Connection String:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/bnb-creator-platform
   ```

### Вариант B: Собственный сервер

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y mongodb-org

# Запуск MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Создание пользователя
mongo
use bnb-creator-platform
db.createUser({
  user: "bnbadmin",
  pwd: "сложный_пароль",
  roles: ["readWrite"]
})
```

## 3️⃣ Деплой Backend

### Вариант A: VPS (DigitalOcean, Hetzner, etc.)

#### Настройка сервера

```bash
# 1. Обновление системы
sudo apt-get update
sudo apt-get upgrade -y

# 2. Установка Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Установка Nginx
sudo apt-get install -y nginx

# 4. Установка PM2
sudo npm install -g pm2
```

#### Загрузка проекта

```bash
# Клонирование репозитория
cd /var/www
sudo git clone https://github.com/your-username/bnb-creator-platform.git
cd bnb-creator-platform/server

# Установка зависимостей
npm install --production
```

#### Настройка окружения

```bash
# Создание .env файла
sudo nano .env
```

Вставьте:

```env
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bnb-creator-platform

# JWT
JWT_SECRET=сгенерируйте_сложный_секрет_минимум_32_символа

# Smart Contract
CONTRACT_ADDRESS=0x...
BSC_RPC_URL=https://bsc-dataseed.binance.org/
BSC_CHAIN_ID=56

# Frontend
FRONTEND_URL=https://your-domain.com
```

#### Запуск с PM2

```bash
# Запуск приложения
pm2 start server.js --name bnb-creator-api

# Сохранение конфигурации
pm2 save

# Автозапуск при перезагрузке
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

#### Настройка Nginx

```bash
sudo nano /etc/nginx/sites-available/bnb-creator-api
```

Вставьте:

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Активация конфигурации
sudo ln -s /etc/nginx/sites-available/bnb-creator-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Настройка SSL (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com
```

### Вариант B: Heroku

```bash
cd server

# Логин в Heroku
heroku login

# Создание приложения
heroku create bnb-creator-api

# Добавление MongoDB
heroku addons:create mongolab:sandbox

# Настройка переменных
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=ваш_секрет
heroku config:set CONTRACT_ADDRESS=0x...
heroku config:set BSC_RPC_URL=https://bsc-dataseed.binance.org/
heroku config:set BSC_CHAIN_ID=56
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app

# Деплой
git push heroku main
```

### Вариант C: Railway

1. Создайте аккаунт на [Railway.app](https://railway.app)
2. Создайте новый проект
3. Подключите GitHub репозиторий
4. Выберите папку `server` как root directory
5. Добавьте MongoDB plugin
6. Настройте переменные окружения в UI
7. Деплой происходит автоматически

## 4️⃣ Деплой Frontend

### Вариант A: Vercel (рекомендуется)

```bash
cd client

# Установка Vercel CLI
npm install -g vercel

# Логин
vercel login

# Деплой
vercel --prod
```

Или через GitHub:
1. Push код на GitHub
2. Импортируйте проект в Vercel
3. Настройте переменные окружения:
   - `REACT_APP_CONTRACT_ADDRESS`
   - `REACT_APP_API_URL` (если нужно)

### Вариант B: Netlify

```bash
cd client

# Build
npm run build

# Установка Netlify CLI
npm install -g netlify-cli

# Логин
netlify login

# Деплой
netlify deploy --prod --dir=build
```

### Вариант C: На том же VPS с Nginx

```bash
# Build проекта
cd /var/www/bnb-creator-platform/client
npm install
npm run build

# Настройка Nginx
sudo nano /etc/nginx/sites-available/bnb-creator-frontend
```

Вставьте:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/bnb-creator-platform/client/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование статики
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/bnb-creator-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d your-domain.com
```

## 5️⃣ Настройка домена

### DNS записи

Настройте A записи для вашего домена:

```
A     @              your-server-ip
A     www            your-server-ip
A     api            your-server-ip
```

Или CNAME для сервисов:

```
CNAME @              your-app.vercel.app
CNAME api            your-api.herokuapp.com
```

## 6️⃣ Мониторинг и обслуживание

### Логи PM2

```bash
# Просмотр логов
pm2 logs bnb-creator-api

# Перезапуск
pm2 restart bnb-creator-api

# Остановка
pm2 stop bnb-creator-api
```

### Обновление кода

```bash
cd /var/www/bnb-creator-platform
sudo git pull origin main

# Backend
cd server
npm install
pm2 restart bnb-creator-api

# Frontend
cd ../client
npm install
npm run build
```

### Бэкапы MongoDB

```bash
# Создание бэкапа
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/bnb-creator-platform" --out=/backups/$(date +%Y%m%d)

# Восстановление
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/bnb-creator-platform" /backups/20231201
```

### Автоматические бэкапы (cron)

```bash
sudo crontab -e
```

Добавьте:

```bash
# Бэкап каждый день в 3 AM
0 3 * * * mongodump --uri="your-mongodb-uri" --out=/backups/$(date +\%Y\%m\%d)

# Удаление старых бэкапов (старше 30 дней)
0 4 * * * find /backups -mtime +30 -delete
```

## 7️⃣ Безопасность

### Firewall (UFW)

```bash
# Установка
sudo apt-get install ufw

# Настройка правил
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Fail2Ban (защита от брутфорса)

```bash
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 8️⃣ Проверка

После деплоя проверьте:

- [ ] Frontend открывается и подключается к кошельку
- [ ] API отвечает на запросы
- [ ] Smart contract вызывается корректно
- [ ] MongoDB сохраняет данные
- [ ] SSL сертификаты работают
- [ ] Логи не содержат ошибок

## 🆘 Troubleshooting

### Backend не запускается

```bash
# Проверить логи PM2
pm2 logs bnb-creator-api

# Проверить порты
sudo netstat -tulpn | grep :5000
```

### MongoDB не подключается

```bash
# Проверить статус
sudo systemctl status mongod

# Проверить логи
sudo tail -f /var/log/mongodb/mongod.log
```

### Frontend не обновляется

```bash
# Очистить кэш сборки
cd client
rm -rf build node_modules
npm install
npm run build
```

## 📞 Поддержка

Если возникли проблемы, обратитесь за помощью или создайте Issue на GitHub.

---

**Удачного деплоя! 🚀**

