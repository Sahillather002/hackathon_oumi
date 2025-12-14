#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting all services...\n');

const processes = [];
let shutdown = false;

function cleanup() {
  if (shutdown) return;
  shutdown = true;
  console.log('\n🛑 Shutting down all services...');
  processes.forEach(proc => {
    try {
      proc.kill();
    } catch (e) {
      // Ignore
    }
  });
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start backend service
const backendServicePath = path.join(process.cwd(), 'mini-services', 'oumi-service');
if (fs.existsSync(backendServicePath)) {
  console.log('🔧 Starting backend service on port 3001...');
  const backend = spawn('npm', ['run', 'dev'], {
    cwd: backendServicePath,
    stdio: 'inherit',
    shell: true
  });
  processes.push(backend);
  
  backend.on('error', (err) => {
    console.error('❌ Backend service error:', err);
  });
}

// Wait a bit for backend to start
setTimeout(() => {
  // Start Next.js dev server
  console.log('🌐 Starting Next.js dev server on port 3000...');
  const nextjs = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  processes.push(nextjs);
  
  nextjs.on('error', (err) => {
    console.error('❌ Next.js error:', err);
  });
  
  console.log('\n✅ All services starting!');
  console.log('📱 Frontend: http://localhost:3000');
  console.log('🔧 Backend API: http://localhost:3001');
  console.log('🔌 WebSocket: ws://localhost:3002');
  console.log('\nPress Ctrl+C to stop all services\n');
}, 2000);

