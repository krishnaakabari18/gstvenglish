#!/bin/bash

# Production startup script for GSTV Next.js application
# This script ensures the application starts correctly and stays running

cd /var/www/html/gstvnext

# Kill any existing Next.js processes
pkill -f "next-server"
pkill -f "npm run start"

# Wait a moment for processes to terminate
sleep 2

# Start the production server
echo "Starting GSTV Next.js production server..."
npm run start > /var/log/gstv-next.log 2>&1 &

# Get the process ID
PID=$!
echo "Started with PID: $PID"

# Save PID to file for later management
echo $PID > /var/run/gstv-next.pid

echo "GSTV Next.js server started successfully!"
echo "Logs: /var/log/gstv-next.log"
echo "PID file: /var/run/gstv-next.pid"
