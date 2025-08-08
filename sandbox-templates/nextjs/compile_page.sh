#!/bin/bash

# Build the Next.js app
echo "Building Next.js app..."
npx next build

# Start the production server in the background
echo "Starting Next.js server..."
npx next start &

# Wait for the server to respond with HTTP 200 on localhost:3000
counter=0
while true; do
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
  if [[ "$response" == "200" ]]; then
    echo "Server is up and running!"
    break
  fi

  ((counter++))
  if (( counter % 20 == 0 )); then
    echo "Waiting for server to start..."
  fi
  sleep 0.5
done