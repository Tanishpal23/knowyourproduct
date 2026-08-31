/**
 * updateImages.js  (v2)
 * Uses Open Food Facts API (live response) to pull real front-image URLs.
 * Falls back to curated stable CDN URLs for products without OFF entries.
 * Run: node seed/updateImages.js
 */
try { require('@dotenvx/dotenvx').config(); } catch { require('dotenv').config(); }
const https = require('https');
const { Product } = require('../models/Product');
const connectDB = require('../config/db');

// Curated stable image URLs — using Open Food Facts CDN directly
// Format: https://images.openfoodfacts.org/images/products/BARCODE_PATH/front_en.N.400.jpg
// For products not on OFF, use Google User Content or other stable CDNs
const FALLBACK_IMAGES = {
  // ── ORIGINAL 6 ────────────────────────────────────────────────────────────
  'Coca-Cola Classic':
    'https://images.openfoodfacts.org/images/products/004/900/002/8911/front_en.21.400.jpg',
  'Oreo Original Sandwich Cookies':
    'https://images.openfoodfacts.org/images/products/004/400/003/2784/front_en.8.400.jpg',
  "Lay's Classic Potato Chips":
    'https://images.openfoodfacts.org/images/products/002/840/009/0094/front_en.10.400.jpg',
  'Maggi 2-Minute Noodles':
    'https://images.openfoodfacts.org/images/products/890/105/800/7944/front_en.8.400.jpg',
  'Tropicana Pure Premium Orange Juice':
    'https://images.openfoodfacts.org/images/products/004/850/020/2050/front_en.8.400.jpg',
  'Quaker Old Fashioned Rolled Oats':
    'https://images.openfoodfacts.org/images/products/003/000/001/0297/front_en.14.400.jpg',
  // ── BEVERAGES ──────────────────────────────────────────────────────────────
  'Pepsi Cola':
    'https://images.openfoodfacts.org/images/products/001/200/000/1413/front_en.16.400.jpg',
  'Mountain Dew':
    'https://images.openfoodfacts.org/images/products/001/200/000/0010/front_en.3.400.jpg',
  'Red Bull Energy Drink':
    'https://images.openfoodfacts.org/images/products/900/249/010/0070/front_en.6.400.jpg',
  'Sprite':
    'https://images.openfoodfacts.org/images/products/004/900/002/8928/front_en.12.400.jpg',
  'Bournvita Chocolate Malt Drink':
    'https://images.openfoodfacts.org/images/products/890/103/073/0115/front_en.4.400.jpg',
  // ── SNACKS & COOKIES ───────────────────────────────────────────────────────
  'Parle-G Original Glucose Biscuits':
    'https://images.openfoodfacts.org/images/products/890/171/910/0016/front_en.3.400.jpg',
  'Britannia Good Day Butter Cookies':
    'https://images.openfoodfacts.org/images/products/890/106/390/0015/front_en.3.400.jpg',
  'KitKat Milk Chocolate':
    'https://images.openfoodfacts.org/images/products/002/800/020/4700/front_en.19.400.jpg',
  'Britannia NutriChoice Digestive':
    'https://images.openfoodfacts.org/images/products/890/106/392/5018/front_en.3.400.jpg',
  // ── SNACKS & CHIPS ─────────────────────────────────────────────────────────
  'Doritos Nacho Cheese':
    'https://images.openfoodfacts.org/images/products/002/840/009/0018/front_en.11.400.jpg',
  'Pringles Original':
    'https://images.openfoodfacts.org/images/products/003/800/008/4503/front_en.8.400.jpg',
  'Kurkure Masala Munch':
    'https://images.openfoodfacts.org/images/products/890/149/112/1614/front_en.3.400.jpg',
  // ── INSTANT NOODLES ────────────────────────────────────────────────────────
  'Top Ramen Curry Noodles':
    'https://images.openfoodfacts.org/images/products/890/189/110/3056/front_en.3.400.jpg',
  // ── JUICES ─────────────────────────────────────────────────────────────────
  'Minute Maid Pulpy Orange':
    'https://images.openfoodfacts.org/images/products/544/900/026/7382/front_en.3.400.jpg',
  'Real Fruit Power Apple':
    'https://images.openfoodfacts.org/images/products/890/120/700/3981/front_en.3.400.jpg',
  // ── BREAKFAST & GRAINS ─────────────────────────────────────────────────────
  "Kellogg's Corn Flakes":
    'https://images.openfoodfacts.org/images/products/003/800/059/6209/front_en.8.400.jpg',
  'Saffola Gold Oats':
    'https://images.openfoodfacts.org/images/products/890/120/700/3981/front_en.3.400.jpg',
  "Kellogg's Chocos Chocolate Wheat Flakes":
    'https://images.openfoodfacts.org/images/products/890/149/900/2340/front_en.5.400.jpg',
};

// Fetch image from Open Food Facts API (live)
function fetchOFFImage(barcode) {
  return new Promise((resolve) => {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    const req = https.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          const img = j?.product?.image_front_url || j?.product?.image_url || null;
          resolve(img);
        } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

async function run() {
  await connectDB();
  const products = await Product.find({});
  console.log(`\n🔍 Updating images for ${products.length} products...\n`);
  let updated = 0, skipped = 0;

  for (const p of products) {
    let imageUrl = null;

    // 1. Try live Open Food Facts API
    if (p.barcode) {
      imageUrl = await fetchOFFImage(p.barcode);
      if (imageUrl) console.log(`✅ [off-api] ${p.productName}`);
    }

    // 2. Fall back to curated CDN map
    if (!imageUrl) {
      imageUrl = FALLBACK_IMAGES[p.productName];
      if (imageUrl) console.log(`✅ [cdn-map] ${p.productName}`);
    }

    if (imageUrl) {
      await Product.findByIdAndUpdate(p._id, { image: imageUrl });
      updated++;
    } else {
      console.log(`⚠️  No image for: ${p.productName}`);
      skipped++;
    }
  }

  console.log(`\n🎉 Done — ${updated} updated, ${skipped} skipped.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
