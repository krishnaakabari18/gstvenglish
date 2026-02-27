#!/bin/bash

# Test Video Metadata Script
# This script tests if the server-side metadata is correct

echo "========================================="
echo "Testing Video Metadata"
echo "========================================="
echo ""

# Test URL
URL="https://www.gstv.in/videos/mavathu-in-panchmahal-unseasonal-rains-pose-a-threat-to-rabi-crops"

echo "Testing URL: $URL"
echo ""

echo "1. Fetching og:title..."
curl -s "$URL" | grep -o '<meta property="og:title" content="[^"]*"' | head -1
echo ""

echo "2. Fetching og:description..."
curl -s "$URL" | grep -o '<meta property="og:description" content="[^"]*"' | head -1
echo ""

echo "3. Fetching og:image..."
curl -s "$URL" | grep -o '<meta property="og:image" content="[^"]*"' | head -1
echo ""

echo "4. Fetching og:url..."
curl -s "$URL" | grep -o '<meta property="og:url" content="[^"]*"' | head -1
echo ""

echo "========================================="
echo "If og:image shows 'default-og.jpg', the server-side metadata is NOT working correctly."
echo "If og:image shows a video thumbnail URL, the server-side metadata IS working."
echo "========================================="
