// complete-pwa-generator.js
// Run with: node complete-pwa-generator.js
// Requires: npm install sharp


import fs from 'fs'
import sharp from 'sharp'
import path from 'path'

// Your source image path
const sourceImage = './public/logo/fresh_cart.png';

// Complete icon specifications for all platforms
const iconSpecs = {
    // Standard PWA icons (Android, Desktop)
    pwa: [
        { size: 72, name: 'pwa-72x72.png' },
        { size: 96, name: 'pwa-96x96.png' },
        { size: 128, name: 'pwa-128x128.png' },
        { size: 144, name: 'pwa-144x144.png' },
        { size: 152, name: 'pwa-152x152.png' },
        { size: 192, name: 'pwa-192x192.png' },
        { size: 384, name: 'pwa-384x384.png' },
        { size: 512, name: 'pwa-512x512.png' }
    ],
    
    // iOS Apple Touch Icons
    apple: [
        { size: 57, name: 'apple-touch-icon-57x57.png' },
        { size: 60, name: 'apple-touch-icon-60x60.png' },
        { size: 72, name: 'apple-touch-icon-72x72.png' },
        { size: 76, name: 'apple-touch-icon-76x76.png' },
        { size: 114, name: 'apple-touch-icon-114x114.png' },
        { size: 120, name: 'apple-touch-icon-120x120.png' },
        { size: 144, name: 'apple-touch-icon-144x144.png' },
        { size: 152, name: 'apple-touch-icon-152x152.png' },
        { size: 180, name: 'apple-touch-icon-180x180.png' },
        { size: 180, name: 'apple-touch-icon.png' } // Default
    ],
    
    // Android Maskable Icons
    maskable: [
        { size: 192, name: 'maskable-icon-192x192.png' },
        { size: 512, name: 'maskable-icon-512x512.png' }
    ],
    
    // Windows Tiles
    windows: [
        { size: 70, name: 'mstile-70x70.png' },
        { size: 144, name: 'mstile-144x144.png' },
        { size: 150, name: 'mstile-150x150.png' },
        { size: 310, name: 'mstile-310x310.png' },
        { width: 310, height: 150, name: 'mstile-310x150.png' }
    ],
    
    // Favicons
    favicons: [
        { size: 16, name: 'favicon-16x16.png' },
        { size: 32, name: 'favicon-32x32.png' },
        { size: 48, name: 'favicon-48x48.png' }
    ]
};

// iOS Splash Screen Specifications
const splashSpecs = [
    // iPhone
    { width: 640, height: 1136, name: 'apple-splash-640-1136.png', media: '(device-width: 320px) and (device-height: 568px)' },
    { width: 750, height: 1334, name: 'apple-splash-750-1334.png', media: '(device-width: 375px) and (device-height: 667px)' },
    { width: 828, height: 1792, name: 'apple-splash-828-1792.png', media: '(device-width: 414px) and (device-height: 896px)' },
    { width: 1125, height: 2436, name: 'apple-splash-1125-2436.png', media: '(device-width: 375px) and (device-height: 812px)' },
    { width: 1242, height: 2208, name: 'apple-splash-1242-2208.png', media: '(device-width: 414px) and (device-height: 736px)' },
    { width: 1242, height: 2688, name: 'apple-splash-1242-2688.png', media: '(device-width: 414px) and (device-height: 896px)' },
    { width: 1284, height: 2778, name: 'apple-splash-1284-2778.png', media: '(device-width: 428px) and (device-height: 926px)' },
    { width: 1170, height: 2532, name: 'apple-splash-1170-2532.png', media: '(device-width: 390px) and (device-height: 844px)' },
    
    // iPad
    { width: 1536, height: 2048, name: 'apple-splash-1536-2048.png', media: '(device-width: 768px) and (device-height: 1024px)' },
    { width: 1620, height: 2160, name: 'apple-splash-1620-2160.png', media: '(device-width: 810px) and (device-height: 1080px)' },
    { width: 1668, height: 2224, name: 'apple-splash-1668-2224.png', media: '(device-width: 834px) and (device-height: 1112px)' },
    { width: 1668, height: 2388, name: 'apple-splash-1668-2388.png', media: '(device-width: 834px) and (device-height: 1194px)' },
    { width: 2048, height: 2732, name: 'apple-splash-2048-2732.png', media: '(device-width: 1024px) and (device-height: 1366px)' }
];

async function generateAllAssets() {
    console.log('🚀 Generating comprehensive PWA assets for all platforms...\n');
    
    // Create directories
    const publicDir = './public';
    const splashDir = './public/splash';
    
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    if (!fs.existsSync(splashDir)) fs.mkdirSync(splashDir, { recursive: true });

    // Check source image
    if (!fs.existsSync(sourceImage)) {
        console.error(`❌ Source image not found: ${sourceImage}`);
        console.log('Please create a logo.png file in your public directory (1024x1024 recommended)');
        return;
    }

    try {
        // Generate standard PWA icons
        console.log('📱 Generating PWA icons...');
        for (const icon of iconSpecs.pwa) {
            await sharp(sourceImage)
                .resize(icon.size, icon.size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
                .png()
                .toFile(path.join(publicDir, icon.name));
            console.log(`✓ ${icon.name}`);
        }

        // Generate Apple Touch Icons
        console.log('\n🍎 Generating Apple Touch Icons...');
        for (const icon of iconSpecs.apple) {
            await sharp(sourceImage)
                .resize(icon.size, icon.size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
                .png()
                .toFile(path.join(publicDir, icon.name));
            console.log(`✓ ${icon.name}`);
        }

        // Generate Maskable Icons (Android adaptive)
        console.log('\n🤖 Generating Android Maskable Icons...');
        for (const icon of iconSpecs.maskable) {
            const padding = Math.floor(icon.size * 0.1);
            const iconSize = icon.size - (padding * 2);
            
            await sharp({
                create: {
                    width: icon.size,
                    height: icon.size,
                    channels: 4,
                    background: { r: 14, g: 165, b: 233, alpha: 1 } // Primary color
                }
            })
            .composite([{
                input: await sharp(sourceImage)
                    .resize(iconSize, iconSize, { fit: 'contain' })
                    .png()
                    .toBuffer(),
                top: padding,
                left: padding
            }])
            .png()
            .toFile(path.join(publicDir, icon.name));
            console.log(`✓ ${icon.name}`);
        }

        // Generate Windows Tiles
        console.log('\n🪟 Generating Windows Tiles...');
        for (const tile of iconSpecs.windows) {
            if (tile.width && tile.height) {
                // Rectangular tile
                await sharp(sourceImage)
                    .resize(tile.width, tile.height, { fit: 'contain', background: { r: 14, g: 165, b: 233, alpha: 1 } })
                    .png()
                    .toFile(path.join(publicDir, tile.name));
            } else {
                // Square tile
                await sharp(sourceImage)
                    .resize(tile.size, tile.size, { fit: 'contain', background: { r: 14, g: 165, b: 233, alpha: 1 } })
                    .png()
                    .toFile(path.join(publicDir, tile.name));
            }
            console.log(`✓ ${tile.name}`);
        }

        // Generate Favicons
        console.log('\n🔖 Generating Favicons...');
        for (const favicon of iconSpecs.favicons) {
            await sharp(sourceImage)
                .resize(favicon.size, favicon.size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
                .png()
                .toFile(path.join(publicDir, favicon.name));
            console.log(`✓ ${favicon.name}`);
        }

        // Generate ICO favicon
        await sharp(sourceImage)
            .resize(32, 32)
            .png()
            .toFile(path.join(publicDir, 'favicon.ico'));
        console.log('✓ favicon.ico');

        // Generate iOS Splash Screens
        console.log('\n🌊 Generating iOS Splash Screens...');
        for (const splash of splashSpecs) {
            const iconSize = Math.min(splash.width, splash.height) * 0.25; // 25% of smaller dimension
            
            await sharp({
                create: {
                    width: splash.width,
                    height: splash.height,
                    channels: 4,
                    background: { r: 240, g: 249, b: 255, alpha: 1 } // Primary-50 background
                }
            })
            .composite([{
                input: await sharp(sourceImage)
                    .resize(Math.floor(iconSize), Math.floor(iconSize), { fit: 'contain' })
                    .png()
                    .toBuffer(),
                gravity: 'center'
            }])
            .png()
            .toFile(path.join(splashDir, splash.name));
            console.log(`✓ ${splash.name} (${splash.width}x${splash.height})`);
        }

        console.log('\n🎉 All assets generated successfully!');
        console.log('\n📊 Generated:');
        console.log(`- ${iconSpecs.pwa.length} PWA icons`);
        console.log(`- ${iconSpecs.apple.length} Apple Touch icons`);
        console.log(`- ${iconSpecs.maskable.length} Android Maskable icons`);
        console.log(`- ${iconSpecs.windows.length} Windows tiles`);
        console.log(`- ${iconSpecs.favicons.length + 1} Favicons`);
        console.log(`- ${splashSpecs.length} iOS splash screens`);
        
    } catch (error) {
        console.error('❌ Error generating assets:', error);
    }
}

generateAllAssets();