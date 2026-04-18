#!/bin/bash

echo "1️⃣  Removing node_modules from root..."
rm -rf ./node_modules

echo "2️⃣  Removing node_modules from apps..."
find ./apps -name "node_modules" -type d -prune -exec rm -rf {} +

echo "3️⃣  Removing node_modules from packages..."
find ./packages -name "node_modules" -type d -prune -exec rm -rf {} +

echo "4️⃣  Removing TanStack build artifacts from apps/app..."
rm -rf ./apps/app/.tanstack ./apps/app/dist

echo "✅ Project cleaned 🧹"
