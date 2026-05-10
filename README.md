# Inventory Management System - Deployment Guide

This application is configured for deployment on Render.com with a multi-service setup including backend API, frontend, and PostgreSQL database.

## 🚀 Quick Deploy to Render

### Prerequisites
1. Create a [Render.com](https://render.com) account
2. Connect your GitHub repository

### Deployment Steps

1. **Fork/Clone this repository to your GitHub**

2. **Deploy on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Or deploy services individually:**
   - **Database:** Create a PostgreSQL database service
   - **Backend:** Create a Web Service pointing to `/backend` directory
   - **Frontend:** Create a Web Service pointing to `/frontend` directory

### Environment Variables

The `render.yaml` file automatically configures:
- **Backend:**
  - `DATABASE_URL`: Auto-generated from PostgreSQL service
  - `JWT_SECRET`: Auto-generated secure secret
  - `NODE_ENV=production`
  - `PORT=10000`

- **Frontend:**
  - `NEXT_PUBLIC_API_URL`: Auto-generated from backend service
  - `NODE_ENV=production`

### Manual Database Setup

After deployment, run these commands in the backend service shell:

```bash
# Navigate to backend directory
cd backend

# Run database migrations
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

### Default Admin Account

After seeding, you can login with:
- **Email:** `admin@starhacs.edu`
- **Password:** `admin123`

### Services URLs

After deployment, you'll have:
- **Frontend:** `https://your-app-name.onrender.com`
- **Backend API:** `https://your-backend-name.onrender.com`
- **Database:** Internal PostgreSQL instance

### Troubleshooting

1. **Build Failures:**
   - Check build logs in Render dashboard
   - Ensure Node.js version is 18+

2. **Database Connection:**
   - Verify `DATABASE_URL` is set correctly
   - Check database service is running

3. **API Calls Failing:**
   - Ensure `NEXT_PUBLIC_API_URL` points to backend service
   - Check CORS settings in backend

### Production Notes

- JWT secrets are auto-generated for security
- Database is configured with free tier (upgrade as needed)
- Both services auto-scale based on traffic
- Logs are available in Render dashboard

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
├── render.yaml       # Render deployment config
└── README.md         # This file
```