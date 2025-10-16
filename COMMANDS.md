# 📝 Полезные команды

Шпаргалка по всем командам проекта.

## 🏁 Начало работы

```bash
# Установка всех зависимостей
npm run install-all

# Запуск dev окружения (frontend + backend)
npm run dev

# Запуск только frontend
npm run client

# Запуск только backend
npm run server
```

## 🔨 Smart Contracts

```bash
cd contracts

# Компиляция контрактов
npx hardhat compile

# Запуск тестов
npx hardhat test

# Деплой на BSC Testnet
npx hardhat run scripts/deploy.js --network bsc_testnet

# Деплой на BSC Mainnet
npx hardhat run scripts/deploy.js --network bsc_mainnet

# Верификация контракта на BscScan
npx hardhat verify --network bsc_mainnet АДРЕС_КОНТРАКТА

# Очистка артефактов
npx hardhat clean
```

## 💻 Backend

```bash
cd server

# Запуск dev режима (с auto-reload)
npm run dev

# Запуск production
npm start

# Установка зависимостей
npm install

# Установка только production зависимостей
npm ci --only=production
```

## 🎨 Frontend

```bash
cd client

# Запуск dev сервера
npm start

# Сборка для production
npm run build

# Запуск тестов
npm test

# Запуск линтера
npm run lint

# Установка зависимостей
npm install
```

## 🗄️ MongoDB

```bash
# Запуск MongoDB (macOS)
brew services start mongodb-community

# Остановка MongoDB (macOS)
brew services stop mongodb-community

# Запуск MongoDB (Linux)
sudo systemctl start mongod

# Остановка MongoDB (Linux)
sudo systemctl stop mongod

# Подключение к MongoDB
mongo
# или
mongosh

# Использование базы данных
use bnb-creator-platform

# Просмотр коллекций
show collections

# Очистка базы данных
db.dropDatabase()

# Создание бэкапа
mongodump --db=bnb-creator-platform --out=/backups/

# Восстановление из бэкапа
mongorestore --db=bnb-creator-platform /backups/bnb-creator-platform/
```

## 🐳 Docker

```bash
# Сборка и запуск всех сервисов
docker-compose up -d

# Остановка всех сервисов
docker-compose down

# Просмотр логов
docker-compose logs -f

# Пересборка образов
docker-compose build

# Остановка с удалением volumes
docker-compose down -v

# Запуск отдельного сервиса
docker-compose up mongodb
docker-compose up backend
docker-compose up frontend

# Просмотр запущенных контейнеров
docker ps

# Вход в контейнер
docker exec -it bnb-backend sh
docker exec -it bnb-mongodb mongo
```

## 🚀 Деплой

### Vercel (Frontend)

```bash
cd client

# Установка CLI
npm install -g vercel

# Логин
vercel login

# Деплой preview
vercel

# Деплой production
vercel --prod
```

### Heroku (Backend)

```bash
cd server

# Логин
heroku login

# Создание приложения
heroku create bnb-creator-api

# Деплой
git push heroku main

# Просмотр логов
heroku logs --tail

# Запуск команд
heroku run npm start

# Открыть приложение
heroku open
```

### PM2 (VPS Backend)

```bash
# Установка PM2
npm install -g pm2

# Запуск приложения
pm2 start server.js --name bnb-creator-api

# Остановка
pm2 stop bnb-creator-api

# Перезапуск
pm2 restart bnb-creator-api

# Удаление
pm2 delete bnb-creator-api

# Просмотр логов
pm2 logs bnb-creator-api

# Просмотр статуса
pm2 status

# Мониторинг
pm2 monit

# Сохранение конфигурации
pm2 save

# Автозапуск при перезагрузке
pm2 startup
```

## 🔍 Отладка

```bash
# Проверка открытых портов
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :27017 # MongoDB

# Убить процесс на порту
kill -9 $(lsof -t -i:3000)

# Просмотр переменных окружения
printenv | grep REACT_APP
printenv | grep NODE

# Проверка версий
node --version
npm --version
mongod --version

# Очистка npm кэша
npm cache clean --force

# Удаление node_modules и переустановка
rm -rf node_modules package-lock.json
npm install
```

## 📊 Мониторинг и логи

```bash
# Backend логи (PM2)
pm2 logs

# Frontend логи (dev)
# Открыть DevTools в браузере (F12)

# MongoDB логи (Linux)
sudo tail -f /var/log/mongodb/mongod.log

# Nginx логи
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Docker логи
docker logs -f bnb-backend
docker logs -f bnb-frontend
docker logs -f bnb-mongodb
```

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

# Покрытие тестами
npm test -- --coverage
```

## 🔒 Безопасность

```bash
# Проверка уязвимостей
npm audit

# Автоматическое исправление
npm audit fix

# Обновление зависимостей
npm update

# Проверка устаревших пакетов
npm outdated
```

## 🌐 Nginx

```bash
# Проверка конфигурации
sudo nginx -t

# Перезагрузка конфигурации
sudo systemctl reload nginx

# Перезапуск Nginx
sudo systemctl restart nginx

# Просмотр статуса
sudo systemctl status nginx

# Просмотр активных соединений
sudo nginx -V
```

## 📦 Git

```bash
# Первый коммит
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo.git
git push -u origin main

# Обновление
git add .
git commit -m "Your message"
git push

# Создание ветки
git checkout -b feature/new-feature

# Слияние веток
git checkout main
git merge feature/new-feature

# Просмотр истории
git log --oneline

# Отмена изменений
git checkout -- filename
git reset --hard HEAD
```

## 🔄 Обновление проекта

```bash
# Получить последние изменения
git pull origin main

# Обновить зависимости
npm run install-all

# Пересобрать frontend
cd client
npm run build

# Перезапустить backend
cd ../server
pm2 restart bnb-creator-api
```

## 🛠️ Troubleshooting

```bash
# Порт уже занят
lsof -ti:3000 | xargs kill -9

# MongoDB не запускается
sudo rm /var/lib/mongodb/mongod.lock
sudo mongod --repair
sudo systemctl start mongod

# npm install падает
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Проблемы с правами доступа
sudo chown -R $USER:$USER .

# Очистка всех кэшей и пересборка
rm -rf node_modules package-lock.json client/node_modules client/build server/node_modules contracts/node_modules contracts/artifacts contracts/cache
npm run install-all
cd client && npm run build
```

## 📱 Полезные алиасы

Добавьте в `~/.bashrc` или `~/.zshrc`:

```bash
# BNB Creator Platform aliases
alias bnb-dev="cd /path/to/BNB && npm run dev"
alias bnb-build="cd /path/to/BNB/client && npm run build"
alias bnb-deploy="cd /path/to/BNB/contracts && npx hardhat run scripts/deploy.js --network bsc_mainnet"
alias bnb-logs="pm2 logs bnb-creator-api"
alias bnb-restart="pm2 restart bnb-creator-api"
```

После добавления выполните:
```bash
source ~/.bashrc  # или ~/.zshrc
```

---

**💡 Совет:** Сохраните этот файл в закладки для быстрого доступа к командам!

