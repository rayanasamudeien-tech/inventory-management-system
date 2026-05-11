# Inventory Management System

A comprehensive inventory and asset management system built with NestJS (backend) and Next.js (frontend).

## Features

- Asset tracking and management
- Stock inventory control
- User authentication and authorization
- Maintenance request system
- Reporting and analytics
- QR code generation for assets

## Tech Stack

- **Backend:** NestJS, Prisma ORM, PostgreSQL, JWT Authentication
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Database:** PostgreSQL

## Local Development

### Prerequisites

- Node.js 20.19+
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd inventory-management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Set up your DATABASE_URL in .env
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Default Admin Account

- **Email:** `admin@starhacs.edu`
- **Password:** `admin123`

## Deployment

This application can be deployed to various cloud platforms. Configure the following environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secure random string for JWT tokens
- `CORS_ORIGINS`: Allowed frontend origins (comma-separated)
- `NEXT_PUBLIC_API_URL`: Backend API URL for frontend
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