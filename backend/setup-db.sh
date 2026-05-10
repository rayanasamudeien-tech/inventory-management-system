#!/bin/bash

# Database setup script for Render deployment
echo "Setting up database..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Seed the database
echo "Seeding database..."
npx prisma db seed

echo "Database setup complete!"