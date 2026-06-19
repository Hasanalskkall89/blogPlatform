const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create images directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to create test image
function createTestImage(fileName, text) {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Light gray background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 800, 400);

    // Blue text
    ctx.fillStyle = '#0066cc';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 400, 200);

    // Save image
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(path.join(uploadsDir, fileName), buffer);
}

// Create 6 test images
for (let i = 1; i <= 6; i++) {
    createTestImage(`blog${i}.jpg`, `Test Image ${i}`);
}

console.log('Test images created successfully!');
