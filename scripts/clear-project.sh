#!/bin/bash

echo "1️⃣  Removing node_modules from root..."
find ./ -name "node_modules" -type d -prune -exec rm -rf {} +

echo "2️⃣  Removing node_modules and .next from apps..."
find ./apps \( -name "node_modules" -o -name ".next" \) -type d -prune -exec rm -rf {} +

echo "3️⃣  Removing node_modules from packages..."
find ./packages -name "node_modules" -type d -prune -exec rm -rf {} +

echo "✅ Project cleaned 🧹"
