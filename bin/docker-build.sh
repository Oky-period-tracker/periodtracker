#!/bin/bash
set -e

echo "🔄 Ensuring submodules are initialized..."
git submodule update --init --recursive

echo "🏗️  Building Docker images..."
docker-compose build

echo "✅ Build complete!"
