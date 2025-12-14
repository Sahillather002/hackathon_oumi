#!/bin/bash

echo "🚀 Setting up Oumi RL Studio..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Database
DATABASE_URL="file:./db/custom.db"

# Backend Service
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3002

# Features
USE_DATABASE=true
EOF
    echo "✅ Created .env.local"
    echo ""
fi

# Ensure db directory exists
if [ ! -d db ]; then
    echo "📁 Creating db directory..."
    mkdir -p db
    echo "✅ Created db directory"
    echo ""
fi

# Generate Prisma Client
echo "🔧 Generating Prisma client..."
npx prisma generate || {
    echo "❌ Failed to generate Prisma client"
    exit 1
}
echo "✅ Prisma client generated"
echo ""

# Push database schema
echo "💾 Setting up database schema..."
npx prisma db push --accept-data-loss || {
    echo "❌ Failed to set up database schema"
    exit 1
}
echo "✅ Database schema set up"
echo ""

# Install backend service dependencies if needed
if [ -d "mini-services/oumi-service" ]; then
    if [ -f "mini-services/oumi-service/package.json" ]; then
        if [ ! -d "mini-services/oumi-service/node_modules" ]; then
            echo "📦 Installing backend service dependencies..."
            cd mini-services/oumi-service
            npm install || echo "⚠️  Failed to install backend service dependencies"
            cd ../..
            echo "✅ Backend service dependencies installed"
            echo ""
        fi
    fi
fi

echo "✨ Setup complete! You can now run 'npm run dev:all' to start everything."
echo ""

