const fs = require('fs');
const path = require('path');

// Correct path inside 'Memory Game' folder to the images folder
const imageFolder = path.join(__dirname, 'assets', 'images');

// Check if the directory exists
if (!fs.existsSync(imageFolder)) {
    console.log('Directory not found:', imageFolder);
    process.exit(1); 
}

// Read all files in the directory
const imageFiles = fs.readdirSync(imageFolder);

// Generate the images array dynamically
const images = imageFiles
    .filter(file => file.endsWith('.png'))  
    .map(file => {
        const name = path.basename(file, path.extname(file)); // Extract the name without extension
        return {
            image: `./assets/images/${file}`, // Relative path to image
            name
        };
    });

// Prepare the content to write into images.js
const content = `export const images = ${JSON.stringify(images, null, 2)};\n`;

// Write the array to the images.js file
fs.writeFileSync('images.js', content, 'utf8');

console.log('images.js file has been generated!');
