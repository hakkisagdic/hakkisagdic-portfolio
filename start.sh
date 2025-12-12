#!/bin/sh
set -e

echo "Running database migrations..."
./node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma || echo "Migration failed or already applied"

echo "Starting Next.js server..."
exec node server.js
