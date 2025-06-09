#!/bin/bash

echo "🧪 Starting Backend API Tests..."
echo "=================================="

# Make sure containers are running
echo "📦 Checking Docker containers..."
docker-compose ps

echo ""
echo "🚀 Running tests in Docker container..."
docker-compose exec nodeserver npm test

echo ""
echo "✅ Tests completed!" 