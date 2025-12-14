#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Oumi RL Studio...\n');

// Check if .env.local exists, create if not
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envContent = `# Database
DATABASE_URL="file:./db/custom.db"

# Backend Service
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3002

# Features
USE_DATABASE=true
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local\n');
}

// Ensure db directory exists
const dbDir = path.join(process.cwd(), 'db');
if (!fs.existsSync(dbDir)) {
  console.log('📁 Creating db directory...');
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ Created db directory\n');
}

// Generate Prisma Client
console.log('🔧 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');
} catch (error) {
  console.error('❌ Failed to generate Prisma client');
  process.exit(1);
}

// Push database schema
console.log('💾 Setting up database schema...');
try {
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('✅ Database schema set up\n');
} catch (error) {
  console.error('❌ Failed to set up database schema');
  process.exit(1);
}

// Install backend service dependencies if needed
const backendServicePath = path.join(process.cwd(), 'mini-services', 'oumi-service');
if (fs.existsSync(backendServicePath)) {
  const backendPackageJson = path.join(backendServicePath, 'package.json');
  if (fs.existsSync(backendPackageJson)) {
    const backendNodeModules = path.join(backendServicePath, 'node_modules');
    if (!fs.existsSync(backendNodeModules)) {
      console.log('📦 Installing backend service dependencies...');
      try {
        execSync('npm install', { 
          cwd: backendServicePath, 
          stdio: 'inherit' 
        });
        console.log('✅ Backend service dependencies installed\n');
      } catch (error) {
        console.warn('⚠️  Failed to install backend service dependencies');
      }
    }
  }
}

console.log('✨ Setup complete! You can now run "npm run dev:all" to start everything.\n');

