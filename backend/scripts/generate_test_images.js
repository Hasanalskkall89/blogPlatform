/**
 * Test Image Generator Script
 * This script generates test images for development and testing purposes.
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    imageWidth: 800,
    imageHeight: 400,
    backgroundColor: '#f0f0f0',
    textColor: '#0066cc',
    font: '48px Arial',
    outputDir: path.join(__dirname, '../uploads/images'),
    numberOfImages: 6
};

/**
 * Ensures the output directory exists
 */
function ensureDirectoryExists() {
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
        console.log(`Created directory: ${CONFIG.outputDir}`);
    }
}

/**
 * Creates a test image with specified parameters
 * @param {string} fileName - Name of the output file
 * @param {string} text - Text to display on the image
 * @param {Object} options - Optional parameters for customization
 */
function createTestImage(fileName, text, options = {}) {
    const canvas = createCanvas(CONFIG.imageWidth, CONFIG.imageHeight);
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = options.backgroundColor || CONFIG.backgroundColor;
    ctx.fillRect(0, 0, CONFIG.imageWidth, CONFIG.imageHeight);

    // Draw border
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, CONFIG.imageWidth - 20, CONFIG.imageHeight - 20);

    // Draw text
    ctx.fillStyle = options.textColor || CONFIG.textColor;
    ctx.font = options.font || CONFIG.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, CONFIG.imageWidth / 2, CONFIG.imageHeight / 2);

    // Add timestamp
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(`Generated: ${new Date().toLocaleString()}`, CONFIG.imageWidth / 2, CONFIG.imageHeight - 30);

    // Save the image
    const buffer = canvas.toBuffer('image/jpeg');
    const filePath = path.join(CONFIG.outputDir, fileName);
    fs.writeFileSync(filePath, buffer);
    console.log(`Generated: ${fileName}`);
}

/**
 * Main execution
 */
function main() {
    try {
        console.log('Starting test image generation...');
        ensureDirectoryExists();

        // Generate test images with different themes
        const themes = [
            { text: 'Featured Post', backgroundColor: '#e3f2fd', textColor: '#1565c0' },
            { text: 'Breaking News', backgroundColor: '#fce4ec', textColor: '#c2185b' },
            { text: 'Technology', backgroundColor: '#e8f5e9', textColor: '#2e7d32' },
            { text: 'Sports Update', backgroundColor: '#fff3e0', textColor: '#ef6c00' },
            { text: 'Culture & Arts', backgroundColor: '#f3e5f5', textColor: '#7b1fa2' },
            { text: 'World News', backgroundColor: '#e0f2f1', textColor: '#00695c' }
        ];

        themes.forEach((theme, index) => {
            createTestImage(
                `test_image_${index + 1}.jpg`,
                theme.text,
                {
                    backgroundColor: theme.backgroundColor,
                    textColor: theme.textColor
                }
            );
        });

        console.log('\nTest image generation completed successfully!');
        console.log(`Location: ${CONFIG.outputDir}`);
    } catch (error) {
        console.error('Error generating test images:', error);
        process.exit(1);
    }
}

// Execute the script
main();
