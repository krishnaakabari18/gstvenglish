// Test script to check what the API returns for a specific video
// Run with: node test-api-response.js

const fetch = require('node:fetch');

const API_ENDPOINT = 'https://www.gstv.in/backend2/api/v11/mobile/videoDetail';
const VIDEO_SLUG = 'credit-card-holders-beware'; // Change this to test different videos

async function testAPI() {
  console.log('Testing API for video:', VIDEO_SLUG);
  console.log('API Endpoint:', API_ENDPOINT);
  console.log('---');

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: 'videos',
        subslug: VIDEO_SLUG,
        pageNumber: 1,
        device_id: 'server',
        user_id: ''
      }),
    });

    if (!response.ok) {
      console.error('❌ API request failed:', response.status, response.statusText);
      return;
    }

    const data = await response.json();
    const video = data?.videos?.data?.[0] || data?.data?.[0];

    if (!video) {
      console.error('❌ No video found in API response');
      console.log('Response structure:', Object.keys(data));
      return;
    }

    console.log('✅ Video found!');
    console.log('---');
    console.log('Title:', video.title);
    console.log('Slug:', video.slug);
    console.log('---');
    console.log('Image fields in API response:');
    console.log('  videoURL:', video.videoURL || '(empty)');
    console.log('  featureImage:', video.featureImage || '(empty)');
    console.log('  thumbnail:', video.thumbnail || '(empty)');
    console.log('  imageURL:', video.imageURL || '(empty)');
    console.log('  image:', video.image || '(empty)');
    console.log('---');
    
    // Determine which image would be used
    let selectedImage = '';
    let source = '';
    
    if (video.videoURL && video.videoURL.trim() !== '') {
      const videoUrl = video.videoURL.trim();
      if (videoUrl.includes('_video_small.jpg')) {
        selectedImage = videoUrl;
        source = 'videoURL (already has _video_small.jpg)';
      } else if (videoUrl.includes('.mp4')) {
        selectedImage = videoUrl.replace('.mp4', '_video_small.jpg');
        source = 'videoURL (converted from .mp4)';
      } else {
        selectedImage = videoUrl;
        source = 'videoURL (as-is)';
      }
    } else if (video.featureImage && video.featureImage.trim() !== '') {
      selectedImage = video.featureImage;
      source = 'featureImage';
    } else if (video.thumbnail && video.thumbnail.trim() !== '') {
      selectedImage = video.thumbnail;
      source = 'thumbnail';
    } else if (video.imageURL && video.imageURL.trim() !== '') {
      selectedImage = video.imageURL;
      source = 'imageURL';
    } else if (video.image && video.image.trim() !== '') {
      selectedImage = video.image;
      source = 'image';
    } else {
      selectedImage = 'https://www.gstv.in/default-og.jpg';
      source = 'default (no image found)';
    }
    
    console.log('Selected image:', selectedImage);
    console.log('Source:', source);
    console.log('---');
    
    // Check if image URL is absolute
    if (!selectedImage.startsWith('http')) {
      console.log('⚠️ Image URL is relative, will be made absolute');
      const absoluteUrl = `https://www.gstv.in${selectedImage.startsWith('/') ? selectedImage : '/' + selectedImage}`;
      console.log('Absolute URL:', absoluteUrl);
    } else {
      console.log('✅ Image URL is already absolute');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
