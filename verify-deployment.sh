#!/bin/bash

# Verification Script - Check if deployment worked
# Run this AFTER deploying to verify the fix is live

echo "========================================="
echo "Verifying Video Metadata Deployment"
echo "========================================="
echo ""

# Test URL
URL="https://www.gstv.in/videos/video-ishaan-kishan-makes-cartoons-exercise-video-goes-viral"

echo "Testing URL: $URL"
echo ""

echo "1. Checking if og:image meta tag exists..."
OGIMAGE=$(curl -s "$URL" | grep -o '<meta property="og:image" content="[^"]*"' | head -1)

if [ -z "$OGIMAGE" ]; then
    echo "❌ FAILED: No og:image meta tag found!"
    echo "   This means the metadata is not being generated."
    echo "   The deployment did NOT work."
    echo ""
    echo "   Possible reasons:"
    echo "   - .next folder was not deleted"
    echo "   - Server was not restarted"
    echo "   - Code was not pushed to server"
    echo ""
    exit 1
else
    echo "✅ PASSED: og:image meta tag found"
    echo "   $OGIMAGE"
    echo ""
fi

echo "2. Checking if og:image is NOT default-og.jpg..."
if echo "$OGIMAGE" | grep -q "default-og.jpg"; then
    echo "❌ FAILED: og:image is still showing default-og.jpg"
    echo "   This means the API is returning empty image data."
    echo ""
    echo "   Check server logs for:"
    echo "   [Server Metadata] Raw video data from API: ..."
    echo ""
    echo "   The videoURL field is probably empty."
    exit 1
else
    echo "✅ PASSED: og:image is NOT default-og.jpg"
    echo ""
fi

echo "3. Checking if og:image is a video thumbnail..."
if echo "$OGIMAGE" | grep -q "video_small.jpg\|_video.jpg\|media/"; then
    echo "✅ PASSED: og:image appears to be a video thumbnail"
    echo ""
else
    echo "⚠️  WARNING: og:image might not be a video thumbnail"
    echo "   $OGIMAGE"
    echo ""
fi

echo "4. Checking og:title..."
OGTITLE=$(curl -s "$URL" | grep -o '<meta property="og:title" content="[^"]*"' | head -1)
if [ -z "$OGTITLE" ]; then
    echo "❌ FAILED: No og:title meta tag found"
else
    echo "✅ PASSED: og:title found"
    echo "   $OGTITLE"
fi
echo ""

echo "========================================="
echo "Summary"
echo "========================================="

if echo "$OGIMAGE" | grep -q "default-og.jpg"; then
    echo "❌ DEPLOYMENT FAILED"
    echo ""
    echo "The server is still showing default-og.jpg."
    echo ""
    echo "Action required:"
    echo "1. Check if you deleted .next folder"
    echo "2. Check if you restarted the server"
    echo "3. Check server logs: pm2 logs | grep 'Server Metadata'"
    echo ""
elif [ -z "$OGIMAGE" ]; then
    echo "❌ DEPLOYMENT FAILED"
    echo ""
    echo "No meta tags are being generated at all."
    echo ""
    echo "Action required:"
    echo "1. Verify code was pushed to server"
    echo "2. Delete .next folder: rm -rf .next"
    echo "3. Rebuild: npm run build"
    echo "4. Restart: pm2 restart all"
    echo ""
else
    echo "✅ DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "The metadata is being generated correctly."
    echo ""
    echo "Next steps:"
    echo "1. Test sharing on WhatsApp"
    echo "2. Test with Facebook Debugger"
    echo "3. Clear social media cache if needed"
    echo ""
fi

echo "========================================="
