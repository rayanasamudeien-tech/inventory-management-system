# Inventory Management System - Deployment Guide

This application is configured for deployment on Railway with a backend API, frontend, and PostgreSQL database.

## 🚀 Quick Deploy to Railway

### Prerequisites
1. Create a [Railway.app](https://railway.app) account
2. Connect your GitHub repository

### Deployment Steps

1. **Fork/Clone this repository to GitHub**

2. **Deploy on Railway:**
   - Go to [Railway Dashboard](https://railway.app)
   - Create a new project and connect your GitHub repository
   - Add a PostgreSQL plugin to the project
   - Add a web service for the backend using the `/backend` directory
   - Add a web service for the frontend using the `/frontend` directory

3. **Environment variables:**
   - Set `DATABASE_URL` from the Railway Postgres plugin
   - Set `JWT_SECRET` to a secure random string
   - Set `PORT` for the backend service if needed (Railway will auto-assign)
   - Set `NEXT_PUBLIC_API_URL` to the deployed backend URL
   - Set `CORS_ORIGINS` to allowed frontend origins, for example:
     - `https://your-app.up.railway.app,http://localhost:3000`

### Manual Database Setup

After deployment, run these commands in the backend shell:

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

### Default Admin Account

After seeding, you can login with:
- **Email:** `admin@starhacs.edu`
- **Password:** `admin123`

### Services URLs

After deployment, you'll have:
- **Frontend:** `https://your-app.up.railway.app`
- **Backend API:** `https://your-backend.up.railway.app`
- **Database:** Railway PostgreSQL plugin URL

### Troubleshooting

1. **Build Failures:**
   - Check Railway build logs
   - Ensure Node.js version is 18+ in `backend/package.json`

2. **Database Connection:**
   - Verify `DATABASE_URL` is set correctly
   - Confirm the PostgreSQL plugin is attached to the project

3. **API Calls Failing:**
   - Ensure `NEXT_PUBLIC_API_URL` points to the backend deployment URL
   - Set `CORS_ORIGINS` to allow the frontend origin

## 🔧 Local Development

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
/
├── backend/          # NestJS API
├── frontend/         # Next.js App
└── README.md         # This file
```