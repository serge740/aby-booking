#!/bin/bash

# Go to backend folder (the actual project root)
cd "$(dirname "$0")"

export NODE_ENV=production

# Install clean dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Push schema to database (for development or non-migration-based workflow)
npx prisma db push   # ✅ replaced migrate deploy with db push

# Avoid memory crash during build
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Restart if running, otherwise start
pm2 restart backend || pm2 start dist/main.js --name backend
pm2 save
``