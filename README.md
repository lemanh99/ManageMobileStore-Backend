# MobileStore - Backend

# Contents
- [MobileStore - Backend](#mobileStore-Backend)
- [Contents](#contents)
  - [Prerequisites](#prerequisites)
  - [Installation Flow](#installation-flow)
  - [Environment variables](#environment-variables)

## Prerequisites

- NodeJS version is v14.15.4.
- Database: Mongodb

## Installation Flow
- Setup environment
```bash
npm install
```
- Connect to DB
  - Setup connectting [Mongodb](https://docs.cloudmanager.mongodb.com/tutorial/connect-to-mongodb/)
  
- Run server locally
```bash
npm start
```
- Run server locally development
```bash
npm run dev
```
## Environment variables
- See `.env-sample`
- Same with local however:
```dotenv
PORT = 
MONGO_DB_USER = 
MONGO_DB_PASSWORD = 
MONGO_DB_DATABASE = 
JWT_SECRET = MOBILESECRET
```

