try { require('@dotenvx/dotenvx').config(); } catch { require('dotenv').config(); }
const mongoose = require('mongoose');
const { Product } = require('../models/Product');
const connectDB = require('../config/db');

const products = [
  // ── BEVERAGES ─────────────────────────────────────────────────────────────
  {
    productName: 'Pepsi Cola', brand: 'PepsiCo', barcode: '0012000001413',
    category: 'Beverages', country: 'USA', servingSize: '355ml (1 can)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pepsi_logo_2014.svg/200px-Pepsi_logo_2014.svg.png',
    allergens: [], processingLevel: 'highly-processed', concernScore: 6.9,
    scoreBreakdown: { nutritionScore: 7.5, ingredientScore: 5.5, additiveScore: 6.5, allergenRisk: 1.0, processingScore: 8.0, overallScore: 6.9 },
    keyWarnings: ['High added sugar (39g per can)', 'Contains phosphoric acid', 'Contains caffeine (38mg)', 'No nutritional value'],
    positives: ['Allergen-free', 'No artificial sweeteners in classic formula', 'No trans fat'],
    analysisNotes: 'Pepsi Cola is nutritionally nearly identical to Coca-Cola. High sugar content and phosphoric acid are the main concerns. Occasional consumption is unlikely to cause harm.',
    nutrition: { calories: 150, totalFat: 0, saturatedFat: 0, transFat: 0, carbohydrates: 41, totalSugar: 41, addedSugar: 41, protein: 0, fiber: 0, sodium: 30, servingSize: '355ml', servingSizeG: 355 },
    ingredients: [
      { name: 'Carbonated Water', category: 'natural', purpose: 'Base', simpleExplanation: 'Water with CO2 dissolved.', evidenceSummary: 'Safe.', concernLevel: 'low', regulatoryNotes: 'Approved worldwide', foundIn: ['sodas'], evidenceLevel: 'high' },
      { name: 'High Fructose Corn Syrup', category: 'sweetener', purpose: 'Sweetener', simpleExplanation: 'Liquid sweetener from corn starch.', evidenceSummary: 'Linked to obesity and diabetes at high intake.', concernLevel: 'high', regulatoryNotes: 'FDA GRAS', foundIn: ['sodas','processed foods'], evidenceLevel: 'high' },
      { name: 'Caramel Color', category: 'coloring', purpose: 'Color', simpleExplanation: 'Dark brown color from heated sugar.', evidenceSummary: 'Class IV contains 4-MEI which may be of concern at very high levels.', concernLevel: 'moderate', regulatoryNotes: 'FDA permitted', foundIn: ['colas'], evidenceLevel: 'moderate' },
      { name: 'Phosphoric Acid', category: 'additive', purpose: 'Acidulant', simpleExplanation: 'Gives tangy taste, preserves flavor.', evidenceSummary: 'May affect bone density with high consumption.', concernLevel: 'moderate', regulatoryNotes: 'E338, FDA permitted', foundIn: ['colas'], evidenceLevel: 'moderate' },
      { name: 'Caffeine', category: 'additive', purpose: 'Stimulant', simpleExplanation: 'Mild stimulant, ~38mg per can.', evidenceSummary: 'Safe for most adults at normal levels.', concernLevel: 'moderate', regulatoryNotes: 'FDA: up to 400mg/day safe', foundIn: ['sodas','coffee'], evidenceLevel: 'high' },
    ]
  },
  {
    productName: 'Mountain Dew', brand: 'PepsiCo', barcode: '0012000000010',
    category: 'Beverages', country: 'USA', servingSize: '355ml (1 can)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Mountain_Dew_logo.svg/200px-Mountain_Dew_logo.svg.png',
    allergens: [], processingLevel: 'highly-processed', concernScore: 7.8,
    scoreBreakdown: { nutritionScore: 8.0, ingredientScore: 7.0, additiveScore: 7.5, allergenRisk: 1.0, processingScore: 8.0, overallScore: 7.8 },
    keyWarnings: ['Extremely high sugar (46g per can)', 'Contains Yellow 5 artificial dye', 'High caffeine (54mg)', 'Contains BVO (brominated vegetable oil) in some markets', 'No nutritional value'],
    positives: ['Allergen-free', 'No trans fat'],
    analysisNotes: 'Mountain Dew has even higher sugar content than regular colas and contains artificial yellow dye (Yellow 5/tartrazine). It also contains significantly more caffeine. One of the less nutritious soda options available.',
    nutrition: { calories: 170, totalFat: 0, saturatedFat: 0, transFat: 0, carbohydrates: 46, totalSugar: 46, addedSugar: 46, protein: 0, fiber: 0, sodium: 65, servingSize: '355ml', servingSizeG: 355 },
    ingredients: [
      { name: 'Carbonated Water', category: 'natural', purpose: 'Base', simpleExplanation: 'Fizzy water base.', evidenceSummary: 'Safe.', concernLevel: 'low', regulatoryNotes: 'Approved worldwide', foundIn: ['sodas'], evidenceLevel: 'high' },
      { name: 'High Fructose Corn Syrup', category: 'sweetener', purpose: 'Sweetener', simpleExplanation: 'Very high sugar content.', evidenceSummary: 'Linked to obesity and metabolic disease.', concernLevel: 'high', regulatoryNotes: 'FDA GRAS', foundIn: ['sodas'], evidenceLevel: 'high' },
      { name: 'Yellow 5 (Tartrazine)', category: 'coloring', purpose: 'Artificial yellow dye', simpleExplanation: 'Synthetic dye giving Mountain Dew its bright yellow-green color.', evidenceSummary: 'Some studies link it to hyperactivity in children. EU requires warning label. Generally safe at normal levels for most adults.', concernLevel: 'moderate', regulatoryNotes: 'FDA approved; EU requires "may have adverse effect on activity" label', foundIn: ['sodas','candies','snacks'], evidenceLevel: 'moderate' },
      { name: 'Citric Acid', category: 'additive', purpose: 'Acidulant', simpleExplanation: 'Sour taste from citrus.', evidenceSummary: 'Generally safe, but can contribute to dental erosion.', concernLevel: 'low', regulatoryNotes: 'FDA GRAS', foundIn: ['sodas','juices'], evidenceLevel: 'high' },
    ]
  },
  {
    productName: 'Red Bull Energy Drink', brand: 'Red Bull GmbH', barcode: '9002490100070',
    category: 'Beverages', country: 'Austria', servingSize: '250ml (1 can)',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Red_Bull_enhanced_can_2022.webp/200px-Red_Bull_enhanced_can_2022.webp.png',
    allergens: [], processingLevel: 'highly-processed', concernScore: 7.0,
    scoreBreakdown: { nutritionScore: 6.5, ingredientScore: 6.5, additiveScore: 7.5, allergenRisk: 1.0, processingScore: 8.0, overallScore: 7.0 },
    keyWarnings: ['High caffeine (80mg per can — equivalent to a cup of coffee)', 'High sugar (27g)', 'Not suitable for children, pregnant women, or people sensitive to caffeine', 'Taurine and glucuronolactone effects under high-caffeine conditions not fully studied', 'Can mask signs of alcohol intoxication when mixed with alcohol'],
    positives: ['B-vitamins (B3, B6, B12)', 'Provides short-term energy boost', 'Small serving size (250ml)'],
    analysisNotes: 'Red Bull contains caffeine, taurine, B-vitamins, and sugar. The caffeine content is similar to a regular coffee. Main risks are overconsumption and mixing with alcohol. Not suitable for children or people with heart conditions.',
    nutrition: { calories: 112, totalFat: 0, saturatedFat: 0, transFat: 0, carbohydrates: 28, totalSugar: 27, addedSugar: 27, protein: 0, fiber: 0, sodium: 105, servingSize: '250ml', servingSizeG: 250 },
    ingredients: [
      { name: 'Carbonated Water', category: 'natural', purpose: 'Base', simpleExplanation: 'Fizzy water.', evidenceSummary: 'Safe.', concernLevel: 'low', regulatoryNotes: 'Approved', foundIn: ['sodas'], evidenceLevel: 'high' },
      { name: 'Sucrose & Glucose', category: 'sweetener', purpose: 'Sweetener', simpleExplanation: 'Table sugar and simple sugar for quick energy.', evidenceSummary: 'Quick energy spike followed by crash.', concernLevel: 'high', regulatoryNotes: 'Standard', foundIn: ['energy drinks'], evidenceLevel: 'high' },
      { name: 'Caffeine', category: 'additive', purpose: 'Stimulant (80mg)', simpleExplanation: '80mg — similar to one espresso. Enhances alertness.', evidenceSummary: 'Safe for adults at moderate levels. Not suitable for children.', concernLevel: 'moderate', regulatoryNotes: 'FDA: 400mg/day limit', foundIn: ['energy drinks','coffee'], evidenceLevel: 'high' },
      { name: 'Taurine', category: 'additive', purpose: 'Amino acid supplement', simpleExplanation: 'Amino acid claimed to boost energy and performance.', evidenceSummary: 'Generally safe at amounts in energy drinks. Interaction with very high caffeine not fully studied.', concernLevel: 'low', regulatoryNotes: 'FDA GRAS', foundIn: ['energy drinks'], evidenceLevel: 'moderate' },
      { name: 'B-Vitamins (B3, B6, B12)', category: 'natural', purpose: 'Nutritional supplement', simpleExplanation: 'Water-soluble vitamins for energy metabolism.', evidenceSummary: 'Beneficial. Water soluble so excess is excreted.', concernLevel: 'low', regulatoryNotes: 'Standard vitamins', foundIn: ['energy drinks','supplements'], evidenceLevel: 'high' },
    ]
  },
  {
    productName: 'Sprite', brand: 'The Coca-Cola Company', barcode: '0049000028928',
    category: 'Beverages', country: 'USA', servingSize: '355ml (1 can)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Sprite_2022.svg/200px-Sprite_2022.svg.png',
    allergens: [], processingLevel: 'highly-processed', concernScore: 6.5,
    scoreBreakdown: { nutritionScore: 7.0, ingredientScore: 4.5, additiveScore: 4.0, allergenRisk: 1.0, processingScore: 7.0, overallScore: 6.5 },
    keyWarnings: ['High sugar (38g per can)', 'No nutritional value', 'Citric acid can damage tooth enamel with frequent consumption'],
    positives: ['No caffeine', 'No artificial colors', 'Allergen-free', 'Clear/transparent — no caramel color', 'No phosphoric acid'],
    analysisNotes: 'Sprite is a caffeine-free lemon-lime soda. Compared to colas, it has no caramel color or phosphoric acid. Its main concern is high sugar content. A slightly better soda choice for those avoiding caffeine.',
    nutrition: { calories: 140, totalFat: 0, saturatedFat: 0, transFat: 0, carbohydrates: 38, totalSugar: 38, addedSugar: 38, protein: 0, fiber: 0, sodium: 65, servingSize: '355ml', servingSizeG: 355 },
    ingredients: [
      { name: 'Carbonated Water', category: 'natural', purpose: 'Base', simpleExplanation: 'Fizzy water.', evidenceSummary: 'Safe.', concernLevel: 'low', regulatoryNotes: 'Approved', foundIn: ['sodas'], evidenceLevel: 'high' },
      { name: 'High Fructose Corn Syrup', category: 'sweetener', purpose: 'Sweetener', simpleExplanation: 'Main sweetener.', evidenceSummary: 'High intake linked to obesity and metabolic disease.', concernLevel: 'high', regulatoryNotes: 'FDA GRAS', foundIn: ['sodas'], evidenceLevel: 'high' },
      { name: 'Citric Acid', category: 'additive', purpose: 'Acidulant / lemony flavor', simpleExplanation: 'Provides the tart, lemon taste.', evidenceSummary: 'Safe but can erode tooth enamel over time.', concernLevel: 'low', regulatoryNotes: 'FDA GRAS', foundIn: ['sodas','juices'], evidenceLevel: 'high' },
      { name: 'Natural Flavors', category: 'flavor', purpose: 'Lemon-lime flavoring', simpleExplanation: 'Natural lemon and lime flavor extracts.', evidenceSummary: 'FDA regulated, generally safe.', concernLevel: 'low', regulatoryNotes: '21 CFR 101.22', foundIn: ['beverages'], evidenceLevel: 'moderate' },
    ]
  },

  // ── SNACKS & COOKIES ──────────────────────────────────────────────────────
  {
    productName: 'Parle-G Original Glucose Biscuits', brand: 'Parle Products', barcode: '8901719100016',
    category: 'Snacks & Cookies', country: 'India', servingSize: '43g (approx 7 biscuits)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Parle_G_packs.jpg/200px-Parle_G_packs.jpg',
    allergens: ['Wheat', 'Milk'], processingLevel: 'processed', concernScore: 4.2,
    scoreBreakdown: { nutritionScore: 4.5, ingredientScore: 3.5, additiveScore: 3.0, allergenRisk: 4.0, processingScore: 5.0, overallScore: 4.2 },
    keyWarnings: ['Refined wheat (maida) — low fiber, high glycemic index', 'Contains added sugar', 'Palm oil (high saturated fat)', 'Contains wheat and milk allergens'],
    positives: ['Very affordable and accessible', 'Provides quick energy from carbohydrates', 'Low in fat compared to cream biscuits', 'No artificial colors or preservatives', 'Long shelf life without refrigeration'],
    analysisNotes: 'Parle-G is one of the world\'s most popular biscuits. Made with refined flour and simple ingredients, it\'s a moderate-concern snack. The simple ingredient list is a positive, though the refined flour and sugar are nutritional negatives.',
    nutrition: { calories: 182, totalFat: 6, saturatedFat: 2.5, transFat: 0, carbohydrates: 30, totalSugar: 10, addedSugar: 9, protein: 3, fiber: 0.5, sodium: 110, servingSize: '43g', servingSizeG: 43 },
    ingredients: [
      { name: 'Wheat Flour (Maida)', category: 'natural', purpose: 'Base', simpleExplanation: 'Refined white wheat flour.', evidenceSummary: 'High GI, low fiber. Contains gluten.', concernLevel: 'low', regulatoryNotes: 'Common ingredient', foundIn: ['biscuits','bread'], evidenceLevel: 'high' },
      { name: 'Sugar', category: 'sweetener', purpose: 'Sweetener', simpleExplanation: 'Table sugar for sweetness.', evidenceSummary: 'Added sugar should be limited.', concernLevel: 'moderate', regulatoryNotes: 'Standard', foundIn: ['biscuits'], evidenceLevel: 'high' },
      { name: 'Palm Oil', category: 'natural', purpose: 'Fat/texture', simpleExplanation: 'Vegetable oil for crispness.', evidenceSummary: 'High in saturated fat. Environmental concerns.', concernLevel: 'moderate', regulatoryNotes: 'Food-grade permitted', foundIn: ['biscuits','snacks'], evidenceLevel: 'moderate' },
      { name: 'Milk Solids', category: 'natural', purpose: 'Flavor/texture', simpleExplanation: 'Dried milk powder for mild dairy flavor.', evidenceSummary: 'Nutritious but allergen for lactose intolerant.', concernLevel: 'low', regulatoryNotes: 'Allergen: Milk', foundIn: ['biscuits','sweets'], evidenceLevel: 'high' },
    ]
  },
  {
    productName: 'Britannia Good Day Butter Cookies', brand: 'Britannia Industries', barcode: '8901063900015',
    category: 'Snacks & Cookies', country: 'India', servingSize: '40g',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Britannia_logo.svg/200px-Britannia_logo.svg.png',
    allergens: ['Wheat', 'Milk'], processingLevel: 'processed', concernScore: 5.5,
    scoreBreakdown: { nutritionScore: 5.5, ingredientScore: 5.0, additiveScore: 4.5, allergenRisk: 4.0, processingScore: 5.5, overallScore: 5.5 },
    keyWarnings: ['High in saturated fat from butter', 'Contains refined flour (low fiber)', 'Significant added sugar', 'Contains wheat and milk allergens'],
    positives: ['Real butter used (no hydrogenated fats)', 'No artificial colors', 'Good source of carbohydrate energy'],
    analysisNotes: 'Good Day cookies use real butter which is better than partially hydrogenated oils found in cheaper alternatives. However they remain a high-calorie, low-fiber snack with significant sugar and saturated fat.',
    nutrition: { calories: 196, totalFat: 9, saturatedFat: 4.5, transFat: 0, carbohydrates: 27, totalSugar: 12, addedSugar: 11, protein: 3, fiber: 0.5, sodium: 130, servingSize: '40g', servingSizeG: 40 },
    ingredients: [
      { name: 'Refined Wheat Flour', category: 'natural', purpose: 'Base structure', simpleExplanation: 'White flour for the cookie body.', evidenceSummary: 'Low fiber, high GI. Contains gluten.', concernLevel: 'low', regulatoryNotes: 'Standard', foundIn: ['cookies','biscuits'], evidenceLevel: 'high' },
      { name: 'Sugar', category: 'sweetener', purpose: 'Sweetness', simpleExplanation: 'Table sugar.', evidenceSummary: 'Should be limited in diet.', concernLevel: 'moderate', regulatoryNotes: 'Standard', foundIn: ['cookies'], evidenceLevel: 'high' },
      { name: 'Butter', category: 'natural', purpose: 'Fat/flavor', simpleExplanation: 'Real dairy butter for rich flavor.', evidenceSummary: 'High in saturated fat. Better than partially hydrogenated oils (trans fats).', concernLevel: 'moderate', regulatoryNotes: 'Natural dairy fat', foundIn: ['cookies','pastries'], evidenceLevel: 'high' },
      { name: 'Invert Syrup', category: 'sweetener', purpose: 'Humectant/sweetener', simpleExplanation: 'Sugar broken down into glucose and fructose. Keeps cookies moist.', evidenceSummary: 'Another form of added sugar.', concernLevel: 'moderate', regulatoryNotes: 'Permitted', foundIn: ['baked goods'], evidenceLevel: 'moderate' },
    ]
  },
  {
    productName: 'KitKat Milk Chocolate', brand: 'Nestlé', barcode: '0028000204700',
    category: 'Snacks & Cookies', country: 'Switzerland', servingSize: '42g (1 package, 4 fingers)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/KitKat_Logo.svg/200px-KitKat_Logo.svg.png',
    allergens: ['Milk', 'Wheat', 'Soy'], processingLevel: 'highly-processed', concernScore: 6.3,
    scoreBreakdown: { nutritionScore: 6.5, ingredientScore: 5.5, additiveScore: 5.0, allergenRisk: 5.0, processingScore: 7.0, overallScore: 6.3 },
    keyWarnings: ['High in sugar (22g per package)', 'High in saturated fat (7g)', 'Contains multiple allergens (milk, wheat, soy)', 'Artificial flavors', 'Low nutritional value'],
    positives: ['Contains some cocoa (antioxidants)', 'Portion-controlled format', 'No artificial colors'],
    analysisNotes: 'KitKat is a crispy wafer covered in milk chocolate. Like most chocolate snacks, it is high in sugar and saturated fat with limited nutritional benefit. Best enjoyed as an occasional treat.',
    nutrition: { calories: 218, totalFat: 11, saturatedFat: 7, transFat: 0, carbohydrates: 28, totalSugar: 22, addedSugar: 21, protein: 3, fiber: 0.5, sodium: 45, servingSize: '42g', servingSizeG: 42 },
    ingredients: [
      { name: 'Sugar', category: 'sweetener', purpose: 'Sweetener', simpleExplanation: 'Main sweetener.', evidenceSummary: 'High sugar intake linked to obesity and dental issues.', concernLevel: 'high', regulatoryNotes: 'Standard', foundIn: ['chocolate','candy'], evidenceLevel: 'high' },
      { name: 'Wheat Flour', category: 'natural', purpose: 'Wafer base', simpleExplanation: 'Flour for crispy wafer layers.', evidenceSummary: 'Contains gluten.', concernLevel: 'low', regulatoryNotes: 'Allergen: Wheat', foundIn: ['wafers','biscuits'], evidenceLevel: 'high' },
      { name: 'Cocoa Butter', category: 'natural', purpose: 'Chocolate fat', simpleExplanation: 'Natural fat from cocoa beans. Gives chocolate its melt-in-mouth feel.', evidenceSummary: 'High in saturated fat but contains stearic acid which does not raise LDL cholesterol like other saturated fats.', concernLevel: 'low', regulatoryNotes: 'Natural ingredient', foundIn: ['chocolate'], evidenceLevel: 'high' },
      { name: 'Skimmed Milk Powder', category: 'natural', purpose: 'Dairy content of milk chocolate', simpleExplanation: 'Dried skim milk adds creaminess.', evidenceSummary: 'Nutritious dairy ingredient. Allergen for lactose intolerant.', concernLevel: 'low', regulatoryNotes: 'Allergen: Milk', foundIn: ['milk chocolate'], evidenceLevel: 'high' },
      { name: 'Soy Lecithin', category: 'emulsifier', purpose: 'Emulsifier (keeps chocolate smooth)', simpleExplanation: 'Keeps fat and water from separating.', evidenceSummary: 'Safe at food levels.', concernLevel: 'low', regulatoryNotes: 'FDA GRAS; Allergen: Soy', foundIn: ['chocolate','baked goods'], evidenceLevel: 'high' },
    ]
  },
  {
    productName: 'Britannia NutriChoice Digestive', brand: 'Britannia Industries', barcode: '8901063925018',
    category: 'Snacks & Cookies', country: 'India', servingSize: '30g',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Britannia_logo.svg/200px-Britannia_logo.svg.png',
    allergens: ['Wheat'], processingLevel: 'processed', concernScore: 3.5,
    scoreBreakdown: { nutritionScore: 3.5, ingredientScore: 3.0, additiveScore: 3.0, allergenRisk: 2.0, processingScore: 4.0, overallScore: 3.5 },
    keyWarnings: ['Contains wheat (gluten)', 'Some added sugar', 'Moderate saturated fat'],
    positives: ['Whole wheat — good source of fiber (3g per serving)', 'Lower sugar than regular biscuits', 'No artificial colors', 'Good source of iron and B-vitamins', 'Lower glycemic index than refined flour biscuits'],
    analysisNotes: 'NutriChoice Digestive biscuits are a significantly healthier alternative to regular biscuits. Made with whole wheat and lower sugar, they provide more fiber and nutrients. A reasonable choice for a biscuit snack.',
    nutrition: { calories: 135, totalFat: 5.5, saturatedFat: 2.5, transFat: 0, carbohydrates: 20, totalSugar: 5, addedSugar: 4, protein: 3, fiber: 3, sodium: 120, servingSize: '30g', servingSizeG: 30 },
    ingredients: [
      { name: 'Whole Wheat Flour', category: 'natural', purpose: 'Base/fiber source', simpleExplanation: 'Flour from whole grain wheat — retains fiber and nutrients.', evidenceSummary: 'Much better than refined flour. Good source of fiber, associated with lower heart disease risk.', concernLevel: 'low', regulatoryNotes: 'Contains gluten', foundIn: ['digestive biscuits','bread'], evidenceLevel: 'high' },
      { name: 'Sugar', category: 'sweetener', purpose: 'Sweetener', simpleExplanation: 'Modest amount of sugar for palatability.', evidenceSummary: 'Lower amount than regular biscuits.', concernLevel: 'low', regulatoryNotes: 'Standard', foundIn: ['biscuits'], evidenceLevel: 'high' },
      { name: 'Palm Oil', category: 'natural', purpose: 'Fat', simpleExplanation: 'Vegetable oil for texture.', evidenceSummary: 'High in saturated fat. Environmental concerns.', concernLevel: 'moderate', regulatoryNotes: 'Permitted', foundIn: ['biscuits'], evidenceLevel: 'moderate' },
    ]
  },

  // ── SNACKS & CHIPS ────────────────────────────────────────────────────────
  {
    productName: 'Doritos Nacho Cheese', brand: 'Frito-Lay (PepsiCo)', barcode: '0028400090018',
    category: 'Snacks & Chips', country: 'USA', servingSize: '28g (about 11 chips)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Doritos_logo.svg/200px-Doritos_logo.svg.png',
    allergens: ['Milk'], processingLevel: 'highly-processed', concernScore: 6.2,
    scoreBreakdown: { nutritionScore: 6.0, ingredientScore: 6.5, additiveScore: 6.0, allergenRisk: 3.0, processingScore: 6.5, overallScore: 6.2 },
    keyWarnings: ['Long ingredient list with many additives', 'Contains artificial flavors and colors (Red 40, Yellow 6)', 'High sodium (210mg)', 'Contains MSG and multiple flavor enhancers', 'Contains milk allergen'],
    positives: ['Allergen: milk declared clearly', 'Contains some protein (2g)', 'Portion-sized packaging available'],
    analysisNotes: 'Doritos contain a relatively long ingredient list with multiple artificial additives including dyes and MSG. The cheese flavoring involves multiple chemical flavor compounds. A moderate-concern chip compared to plain varieties.',
    nutrition: { calories: 140, totalFat: 7, saturatedFat: 1, transFat: 0, carbohydrates: 18, totalSugar: 1, addedSugar: 0, protein: 2, fiber: 1, sodium: 210, servingSize: '28g', servingSizeG: 28 },
    ingredients: [
      { name: 'Corn', category: 'natural', purpose: 'Base ingredient', simpleExplanation: 'Whole corn ground into masa for chip base.', evidenceSummary: 'Natural base ingredient.', concernLevel: 'low', regulatoryNotes: 'Natural', foundIn: ['corn chips'], evidenceLevel: 'high' },
      { name: 'Vegetable Oil', category: 'natural', purpose: 'Frying', simpleExplanation: 'Sunflower or canola oil for frying.', evidenceSummary: 'Generally healthy fat at moderate levels.', concernLevel: 'low', regulatoryNotes: 'Standard', foundIn: ['fried snacks'], evidenceLevel: 'moderate' },
      { name: 'Cheddar Cheese Powder', category: 'natural', purpose: 'Flavor', simpleExplanation: 'Dehydrated real cheddar cheese for flavor.', evidenceSummary: 'Real cheese, but processed form.', concernLevel: 'low', regulatoryNotes: 'Allergen: Milk', foundIn: ['cheese snacks'], evidenceLevel: 'high' },
      { name: 'Monosodium Glutamate (MSG)', category: 'additive', purpose: 'Flavor enhancer', simpleExplanation: 'Enhances savory/umami flavors.', evidenceSummary: 'Safe at food levels according to FDA and WHO.', concernLevel: 'moderate', regulatoryNotes: 'FDA GRAS', foundIn: ['snacks','seasoning'], evidenceLevel: 'high' },
      { name: 'Red 40 & Yellow 6', category: 'coloring', purpose: 'Artificial color for appearance', simpleExplanation: 'Synthetic dyes to give orange color.', evidenceSummary: 'Some studies link to hyperactivity in children. EU requires warning label. FDA approved.', concernLevel: 'moderate', regulatoryNotes: 'FDA approved; EU requires advisory label', foundIn: ['snacks','candies'], evidenceLevel: 'moderate' },
    ]
  },
  {
    productName: 'Pringles Original', brand: 'Kellogg\'s', barcode: '0038000845031',
    category: 'Snacks & Chips', country: 'USA', servingSize: '28g (about 14 crisps)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Pringles_logo_%282020%29.svg/200px-Pringles_logo_%282020%29.svg.png',
    allergens: ['Wheat'], processingLevel: 'processed', concernScore: 5.0,
    scoreBreakdown: { nutritionScore: 5.5, ingredientScore: 4.5, additiveScore: 3.5, allergenRisk: 2.0, processingScore: 5.5, overallScore: 5.0 },
    keyWarnings: ['Contains wheat (not potato-only like regular chips)', 'High in fat (8g)', 'Acrylamide risk from high-temperature cooking', 'Moderate sodium (150mg)'],
    positives: ['Uniform portion makes it easier to track intake', 'No artificial colors or flavors (Original variety)', 'No MSG in Original', 'Allergen transparent labeling'],
    analysisNotes: 'Pringles are made from dehydrated potato and wheat flour pressed into uniform shapes — technically they are not pure potato chips. They are a processed snack with moderate concern. The Original flavor has a relatively cleaner ingredient list compared to flavored varieties.',
    nutrition: { calories: 150, totalFat: 9, saturatedFat: 2.5, transFat: 0, carbohydrates: 15, totalSugar: 0, addedSugar: 0, protein: 1, fiber: 1, sodium: 150, servingSize: '28g', servingSizeG: 28 },
    ingredients: [
      { name: 'Dried Potatoes', category: 'natural', purpose: 'Main ingredient', simpleExplanation: 'Dehydrated potatoes reconstituted into the chip shape.', evidenceSummary: 'Natural potato, but processed form.', concernLevel: 'low', regulatoryNotes: 'Natural', foundIn: ['potato snacks'], evidenceLevel: 'high' },
      { name: 'Wheat Starch', category: 'natural', purpose: 'Binder', simpleExplanation: 'Helps hold the Pringle shape together.', evidenceSummary: 'Contains gluten. Common thickener.', concernLevel: 'low', regulatoryNotes: 'Allergen: Wheat', foundIn: ['snacks','thickeners'], evidenceLevel: 'high' },
      { name: 'Vegetable Oil', category: 'natural', purpose: 'Fat for texture', simpleExplanation: 'Corn, cottonseed, or sunflower oil.', evidenceSummary: 'Moderate fat content.', concernLevel: 'low', regulatoryNotes: 'Standard', foundIn: ['chips'], evidenceLevel: 'moderate' },
      { name: 'Salt', category: 'natural', purpose: 'Seasoning', simpleExplanation: 'Standard table salt.', evidenceSummary: 'Contributes to sodium intake.', concernLevel: 'moderate', regulatoryNotes: 'Standard', foundIn: ['snacks'], evidenceLevel: 'high' },
    ]
  },
  {
    productName: 'Kurkure Masala Munch', brand: 'Frito-Lay (PepsiCo)', barcode: '8901491121614',
    category: 'Snacks & Chips', country: 'India', servingSize: '26g',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Kurkure-Masala-Munch_1.jpg/200px-Kurkure-Masala-Munch_1.jpg',
    allergens: ['Milk'], processingLevel: 'highly-processed', concernScore: 6.8,
    scoreBreakdown: { nutritionScore: 6.5, ingredientScore: 6.5, additiveScore: 7.0, allergenRisk: 3.0, processingScore: 7.0, overallScore: 6.8 },
    keyWarnings: ['Very high sodium (400mg+ per serving—17% daily limit)', 'Multiple artificial colors and flavors', 'Contains MSG and flavor enhancers', 'Palm oil (high saturated fat)', 'Highly processed extruded snack'],
    positives: ['Contains some protein (2g) from rice and corn', 'Small serving size'],
    analysisNotes: 'Kurkure is an extruded corn puff snack highly popular in India. It contains multiple additives, very high sodium, and artificial colors. Like most masala-flavored snacks it is high-concern for regular consumption.',
    nutrition: { calories: 130, totalFat: 7, saturatedFat: 3, transFat: 0, carbohydrates: 16, totalSugar: 1, addedSugar: 1, protein: 2, fiber: 0.5, sodium: 430, servingSize: '26g', servingSizeG: 26 },
    ingredients: [
      { name: 'Rice Meal', category: 'natural', purpose: 'Base/structure', simpleExplanation: 'Ground rice forms the extruded snack base.', evidenceSummary: 'Common base ingredient. Refined, low fiber.', concernLevel: 'low', regulatoryNotes: 'Standard', foundIn: ['extruded snacks'], evidenceLevel: 'high' },
      { name: 'Edible Vegetable Oil (Palm)', category: 'natural', purpose: 'Frying', simpleExplanation: 'Palm oil for frying the extruded snack.', evidenceSummary: 'High saturated fat. Environmental concerns.', concernLevel: 'moderate', regulatoryNotes: 'Permitted', foundIn: ['fried snacks'], evidenceLevel: 'moderate' },
      { name: 'Spices & Salt', category: 'natural', purpose: 'Masala flavor', simpleExplanation: 'Mix of Indian spices for the classic masala taste.', evidenceSummary: 'Natural spices are beneficial at food levels.', concernLevel: 'low', regulatoryNotes: 'Natural', foundIn: ['seasoned snacks'], evidenceLevel: 'high' },
      { name: 'Flavor Enhancers (MSG, E631, E627)', category: 'additive', purpose: 'Enhance savory taste', simpleExplanation: 'MSG and nucleotides that enhance umami taste.', evidenceSummary: 'Safe at food levels. Significantly adds to sodium.', concernLevel: 'moderate', regulatoryNotes: 'FSSAI permitted', foundIn: ['seasoned snacks'], evidenceLevel: 'moderate' },
    ]
  },

  // ── INSTANT NOODLES ───────────────────────────────────────────────────────
  {
    productName: 'Top Ramen Curry Noodles', brand: 'Nissin Foods', barcode: '8901891103056',
    category: 'Instant Noodles', country: 'India', servingSize: '70g (1 pack)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Nissin_Food_Logo.svg/200px-Nissin_Food_Logo.svg.png',
    allergens: ['Wheat'], processingLevel: 'highly-processed', concernScore: 7.5,
    scoreBreakdown: { nutritionScore: 7.0, ingredientScore: 7.0, additiveScore: 8.0, allergenRisk: 3.0, processingScore: 8.0, overallScore: 7.5 },
    keyWarnings: ['Very high sodium (~850mg — 37% daily limit)', 'Fried noodle cake is high in fat', 'Multiple artificial additives and flavor enhancers', 'Very low in protein and fiber for a meal', 'Contains wheat (gluten)'],
    positives: ['Quick preparation', 'Low sugar', 'Inexpensive', 'Wide availability'],
    analysisNotes: 'Top Ramen is very similar to Maggi in nutritional profile — high sodium, low protein, and highly processed. Regular consumption is associated with poor dietary outcomes. Best treated as an occasional convenience food.',
    nutrition: { calories: 295, totalFat: 11, saturatedFat: 5, transFat: 0, carbohydrates: 44, totalSugar: 2, addedSugar: 1, protein: 6, fiber: 1, sodium: 850, servingSize: '70g', servingSizeG: 70 },
    ingredients: [
      { name: 'Wheat Flour', category: 'natural', purpose: 'Noodle base', simpleExplanation: 'Refined wheat flour for noodle structure.', evidenceSummary: 'Refined, low fiber. Contains gluten.', concernLevel: 'low', regulatoryNotes: 'Allergen: Wheat', foundIn: ['noodles'], evidenceLevel: 'high' },
      { name: 'Palm Olein (Frying Medium)', category: 'natural', purpose: 'Frying noodle cake', simpleExplanation: 'The noodles are fried to dehydrate them.', evidenceSummary: 'Adds significant saturated fat from the frying process.', concernLevel: 'moderate', regulatoryNotes: 'Permitted', foundIn: ['instant noodles'], evidenceLevel: 'moderate' },
      { name: 'Salt & Sodium Compounds', category: 'additive', purpose: 'Seasoning/preservation', simpleExplanation: 'High sodium from seasoning packet and noodle cake.', evidenceSummary: '850mg sodium is ~37% of WHO recommended daily limit.', concernLevel: 'high', regulatoryNotes: 'WHO: <2g sodium/day', foundIn: ['instant noodles'], evidenceLevel: 'high' },
      { name: 'Hydrolyzed Vegetable Protein', category: 'additive', purpose: 'Flavor enhancer', simpleExplanation: 'Protein-derived flavor booster for savory taste.', evidenceSummary: 'Contributes to sodium and glutamate intake.', concernLevel: 'moderate', regulatoryNotes: 'Permitted', foundIn: ['instant noodles','soups'], evidenceLevel: 'moderate' },
    ]
  },

  // ── JUICES & BEVERAGES ────────────────────────────────────────────────────
  {
    productName: 'Minute Maid Pulpy Orange', brand: 'The Coca-Cola Company', barcode: '5449000267382',
    category: 'Juices & Beverages', country: 'India', servingSize: '200ml',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Minute_Maid_Logo.svg/200px-Minute_Maid_Logo.svg.png',
    allergens: [], processingLevel: 'processed', concernScore: 4.8,
    scoreBreakdown: { nutritionScore: 5.0, ingredientScore: 4.5, additiveScore: 4.0, allergenRisk: 1.0, processingScore: 4.5, overallScore: 4.8 },
    keyWarnings: ['Added sugar (not 100% juice)', 'High in natural + added sugar total', 'Lacks fiber of whole oranges', 'Contains citric acid (dental erosion with excess)'],
    positives: ['Contains Vitamin C', 'No artificial colors', 'Contains natural orange pulp', 'No artificial preservatives'],
    analysisNotes: 'Minute Maid Pulpy Orange is a juice drink (not 100% juice) which contains added sugar on top of natural juice. It provides Vitamin C but has added sugars unlike pure juice. Better choices exist (whole fruit), but it\'s a mid-tier beverage option.',
    nutrition: { calories: 87, totalFat: 0, saturatedFat: 0, transFat: 0, carbohydrates: 22, totalSugar: 20, addedSugar: 8, protein: 0, fiber: 0, sodium: 10, servingSize: '200ml', servingSizeG: 200 },
    ingredients: [
      { name: 'Orange Juice (from concentrate)', category: 'natural', purpose: 'Main ingredient', simpleExplanation: 'Concentrated and reconstituted orange juice.', evidenceSummary: 'Provides Vitamin C but less nutritious than fresh-squeezed.', concernLevel: 'low', regulatoryNotes: 'Standard', foundIn: ['juice drinks'], evidenceLevel: 'high' },
      { name: 'Added Sugar', category: 'sweetener', purpose: 'Extra sweetness', simpleExplanation: 'Sugar added on top of natural fruit sugars.', evidenceSummary: 'Added sugar raises concern level vs 100% pure juice.', concernLevel: 'moderate', regulatoryNotes: 'Must be labeled', foundIn: ['juice drinks'], evidenceLevel: 'high' },
      { name: 'Orange Pulp', category: 'natural', purpose: 'Texture/fiber', simpleExplanation: 'Actual orange pulp giving it the "pulpy" texture.', evidenceSummary: 'Provides some beneficial fiber and texture.', concernLevel: 'low', regulatoryNotes: 'Natural', foundIn: ['pulpy juices'], evidenceLevel: 'high' },
    ]
  },
  {
    productName: 'Real Fruit Power Apple', brand: 'Dabur India', barcode: '8901207070792',
    category: 'Juices & Beverages', country: 'India', servingSize: '200ml',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Dabur_Logo.svg/200px-Dabur_Logo.svg.png',
    allergens: [], processingLevel: 'processed', concernScore: 4.5,
    scoreBreakdown: { nutritionScore: 4.5, ingredientScore: 4.0, additiveScore: 4.0, allergenRisk: 1.0, processingScore: 4.5, overallScore: 4.5 },
    keyWarnings: ['Contains added sugar', 'From concentrate (less nutritious than fresh)', 'No fiber (unlike whole apple)', 'Added Vitamin C may exceed natural levels'],
    positives: ['Contains Vitamin C', 'No artificial preservatives', 'No artificial colors', 'No artificial flavors'],
    analysisNotes: 'Real Fruit Power is a popular Indian juice brand. Made from apple juice concentrate with added vitamins. Like most juice drinks it has added sugar and lacks the fiber of whole fruit. A moderate choice compared to sodas.',
    nutrition: { calories: 85, totalFat: 0, saturatedFat: 0, transFat: 0, carbohydrates: 21, totalSugar: 19, addedSugar: 7, protein: 0, fiber: 0, sodium: 5, servingSize: '200ml', servingSizeG: 200 },
    ingredients: [
      { name: 'Apple Juice (from concentrate)', category: 'natural', purpose: 'Main ingredient', simpleExplanation: 'Reconstituted apple juice concentrate.', evidenceSummary: 'Less nutrient-rich than fresh apple juice. No fiber.', concernLevel: 'low', regulatoryNotes: 'Standard', foundIn: ['apple juice drinks'], evidenceLevel: 'high' },
      { name: 'Sugar', category: 'sweetener', purpose: 'Extra sweetness', simpleExplanation: 'Table sugar added for sweetness.', evidenceSummary: 'Increases total sugar above natural fruit levels.', concernLevel: 'moderate', regulatoryNotes: 'Standard', foundIn: ['juice drinks'], evidenceLevel: 'high' },
      { name: 'Added Vitamin C', category: 'natural', purpose: 'Fortification', simpleExplanation: 'Ascorbic acid added to boost Vitamin C content.', evidenceSummary: 'Beneficial vitamin. Generally safe.', concernLevel: 'low', regulatoryNotes: 'FDA GRAS', foundIn: ['fortified foods'], evidenceLevel: 'high' },
    ]
  },

  // ── BREAKFAST & GRAINS ────────────────────────────────────────────────────
  {
    productName: 'Kellogg\'s Corn Flakes', brand: 'Kellogg\'s', barcode: '0038000596209',
    category: 'Breakfast & Grains', country: 'USA', servingSize: '30g (1 cup)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Kellogg%27s_Logo.svg/200px-Kellogg%27s_Logo.svg.png',
    allergens: ['Wheat'], processingLevel: 'processed', concernScore: 3.8,
    scoreBreakdown: { nutritionScore: 4.0, ingredientScore: 3.0, additiveScore: 2.5, allergenRisk: 2.0, processingScore: 4.5, overallScore: 3.8 },
    keyWarnings: ['High glycemic index — raises blood sugar quickly', 'Fortified with synthetic vitamins (not natural)', 'Low fiber (1g per serving)', 'Added sugar (3g)', 'Very little protein'],
    positives: ['Fortified with 8 vitamins and minerals', 'Low fat', 'Low sodium', 'Easy to digest', 'Iron source (fortified)'],
    analysisNotes: 'Corn Flakes are a low-fat, fortified breakfast cereal. The main concern is the high glycemic index — it digests quickly and can cause blood sugar spikes. Adding milk and fruit improves the nutritional profile significantly. A decent but not optimal breakfast choice.',
    nutrition: { calories: 110, totalFat: 0, saturatedFat: 0, transFat: 0, carbohydrates: 26, totalSugar: 3, addedSugar: 3, protein: 2, fiber: 1, sodium: 200, servingSize: '30g', servingSizeG: 30 },
    ingredients: [
      { name: 'Milled Corn (Corn Grits)', category: 'natural', purpose: 'Main ingredient', simpleExplanation: 'Ground and cooked corn that is flaked and toasted.', evidenceSummary: 'Highly processed form of corn. Low fiber as most grain removed.', concernLevel: 'low', regulatoryNotes: 'Natural grain', foundIn: ['cereals'], evidenceLevel: 'high' },
      { name: 'Sugar', category: 'sweetener', purpose: 'Light sweetness', simpleExplanation: 'Small amount of sugar added for flavor.', evidenceSummary: 'Low amount (3g) but combined with high GI corn is a concern.', concernLevel: 'low', regulatoryNotes: 'Standard', foundIn: ['cereals'], evidenceLevel: 'high' },
      { name: 'Salt', category: 'natural', purpose: 'Flavor', simpleExplanation: 'Salt for flavor.', evidenceSummary: '200mg sodium per serving — moderate.', concernLevel: 'low', regulatoryNotes: 'Standard', foundIn: ['cereals'], evidenceLevel: 'high' },
      { name: 'Iron, B-Vitamins (Fortification)', category: 'natural', purpose: 'Nutritional fortification', simpleExplanation: 'Vitamins and minerals added during manufacturing.', evidenceSummary: 'Beneficial additions. Synthetic forms still bioavailable.', concernLevel: 'low', regulatoryNotes: 'FDA approved fortification', foundIn: ['fortified cereals'], evidenceLevel: 'high' },
    ]
  },
  {
    productName: 'Saffola Gold Oats', brand: 'Marico', barcode: '8901207003981',
    category: 'Breakfast & Grains', country: 'India', servingSize: '40g (3 heaped tbsp)',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/Marico_Logo.svg/200px-Marico_Logo.svg.png',
    allergens: ['Oats (may contain traces of wheat)'], processingLevel: 'minimally-processed', concernScore: 1.8,
    scoreBreakdown: { nutritionScore: 2.0, ingredientScore: 1.5, additiveScore: 1.0, allergenRisk: 2.0, processingScore: 1.5, overallScore: 1.8 },
    keyWarnings: ['May contain traces of wheat — caution for celiac disease', 'Oats are naturally gluten-free but risk cross-contamination'],
    positives: ['100% whole grain oats', 'High fiber (4g per serving)', 'Beta-glucan for heart health (FDA approved claim)', 'Good protein (5g)', 'No added sugar', 'No artificial anything', 'Low glycemic index', 'Filling — supports satiety'],
    analysisNotes: 'Saffola Gold Oats is a high-quality single-ingredient product. Like Quaker oats, it is minimally processed with excellent nutritional credentials. Beta-glucan fiber in oats has strong evidence for cholesterol-lowering and heart health benefits.',
    nutrition: { calories: 148, totalFat: 3, saturatedFat: 0.5, transFat: 0, carbohydrates: 26, totalSugar: 0.5, addedSugar: 0, protein: 5, fiber: 4, sodium: 5, servingSize: '40g', servingSizeG: 40 },
    ingredients: [
      { name: 'Whole Grain Rolled Oats', category: 'natural', purpose: 'Single ingredient', simpleExplanation: 'Steamed and rolled whole grain oats.', evidenceSummary: 'Excellent nutritional profile. Beta-glucan supports heart health and cholesterol management.', concernLevel: 'low', regulatoryNotes: 'FDA heart health claim approved', foundIn: ['oatmeal','granola'], evidenceLevel: 'high' },
    ]
  },
  {
    productName: 'Kellogg\'s Chocos Chocolate Wheat Flakes', brand: 'Kellogg\'s', barcode: '8901499002340',
    category: 'Breakfast & Grains', country: 'India', servingSize: '30g',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Kellogg%27s_Logo.svg/200px-Kellogg%27s_Logo.svg.png',
    allergens: ['Wheat', 'Milk'], processingLevel: 'processed', concernScore: 5.8,
    scoreBreakdown: { nutritionScore: 6.0, ingredientScore: 5.5, additiveScore: 5.0, allergenRisk: 3.5, processingScore: 5.5, overallScore: 5.8 },
    keyWarnings: ['High added sugar (10g per 30g serving — 33%)', 'Chocolate coating adds sugar and saturated fat', 'Highly palatable — easy to overconsume', 'Contains wheat and milk allergens'],
    positives: ['Fortified with vitamins and minerals', 'Contains some whole grain', 'Kids enjoy eating it increasing breakfast compliance'],
    analysisNotes: 'Chocos is a chocolate-coated cereal primarily targeted at children. The high sugar content (33% by weight) is the primary concern — many children consume far more than the serving size. Whole grain content and vitamin fortification are positives, but the sugar negates much of the benefit.',
    nutrition: { calories: 116, totalFat: 1.5, saturatedFat: 0.7, transFat: 0, carbohydrates: 24, totalSugar: 10, addedSugar: 10, protein: 2, fiber: 1, sodium: 90, servingSize: '30g', servingSizeG: 30 },
    ingredients: [
      { name: 'Whole Grain Wheat', category: 'natural', purpose: 'Base cereal ingredient', simpleExplanation: 'Whole wheat gives structure and some fiber.', evidenceSummary: 'Good base ingredient but benefits diminished by sugar.', concernLevel: 'low', regulatoryNotes: 'Contains gluten', foundIn: ['cereals'], evidenceLevel: 'high' },
      { name: 'Sugar', category: 'sweetener', purpose: 'Sweetness + chocolate coating', simpleExplanation: 'Primary adding — 10g per 30g serving is high for a breakfast food.', evidenceSummary: 'High sugar in breakfast sets a bad metabolic tone for the day.', concernLevel: 'high', regulatoryNotes: 'Should be limited', foundIn: ['cereals'], evidenceLevel: 'high' },
      { name: 'Cocoa Powder', category: 'natural', purpose: 'Chocolate flavor/color', simpleExplanation: 'Processed cocoa gives chocolate taste.', evidenceSummary: 'Contains antioxidants, but minimal in this amount.', concernLevel: 'low', regulatoryNotes: 'Natural', foundIn: ['chocolate cereals'], evidenceLevel: 'moderate' },
    ]
  },

  // ── BOURNVITA (Beverages) ─────────────────────────────────────────────────
  {
    productName: 'Bournvita Chocolate Malt Drink', brand: 'Mondelēz International', barcode: '8901030730115',
    category: 'Beverages', country: 'India', servingSize: '20g (2 heaped tsp with 200ml milk)',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Bournvita_logo.png/200px-Bournvita_logo.png',
    allergens: ['Milk', 'Wheat'], processingLevel: 'processed', concernScore: 5.2,
    scoreBreakdown: { nutritionScore: 5.5, ingredientScore: 4.5, additiveScore: 5.0, allergenRisk: 4.0, processingScore: 5.0, overallScore: 5.2 },
    keyWarnings: ['Very high sugar (10g per 20g serving — 50% sugar by weight)', 'FSSAI directed Bournvita to reduce sugar and remove "health" claims in 2023', 'When added to full-fat milk, total sugar of the drink is very high', 'Parents often add more than recommended serving'],
    positives: ['Contains vitamins A, B complex, C, D', 'Contains calcium and iron', 'Cocoa provides some antioxidants', 'Encourages milk consumption in children'],
    analysisNotes: 'Bournvita contains 50% sugar by weight, making it a high-sugar product despite its health positioning. FSSAI in India questioned its health claims. When mixed with milk and sometimes extra powder, children can consume very high sugar. The vitamins and minerals are beneficial, but the sugar content is a significant concern.',
    nutrition: { calories: 76, totalFat: 0.5, saturatedFat: 0.2, transFat: 0, carbohydrates: 17, totalSugar: 10, addedSugar: 10, protein: 1, fiber: 0.5, sodium: 30, servingSize: '20g powder', servingSizeG: 20 },
    ingredients: [
      { name: 'Sugar', category: 'sweetener', purpose: 'Sweetener (primary ingredient)', simpleExplanation: 'Sugar is the FIRST and largest ingredient by weight — it makes up ~50% of the product.', evidenceSummary: 'Very high. FSSAI raised concerns about sugar content vs health claims.', concernLevel: 'high', regulatoryNotes: 'FSSAI: Directed to remove health claims 2023', foundIn: ['malt drinks'], evidenceLevel: 'high' },
      { name: 'Wheat & Malt Extract', category: 'natural', purpose: 'Malt flavor base', simpleExplanation: 'Malted wheat gives the characteristic malt taste.', evidenceSummary: 'Contains some B-vitamins. Allergen for gluten-sensitive.', concernLevel: 'low', regulatoryNotes: 'Allergen: Wheat', foundIn: ['malt drinks'], evidenceLevel: 'moderate' },
      { name: 'Cocoa Solids', category: 'natural', purpose: 'Chocolate flavor', simpleExplanation: 'Cocoa powder for chocolate taste.', evidenceSummary: 'Contains antioxidants and flavanols. Beneficial in moderate amounts.', concernLevel: 'low', regulatoryNotes: 'Natural', foundIn: ['cocoa drinks'], evidenceLevel: 'moderate' },
      { name: 'Vitamins & Minerals (A, B, C, D, Fe, Ca)', category: 'natural', purpose: 'Fortification', simpleExplanation: 'Added micronutrients for health.', evidenceSummary: 'Genuinely beneficial additions. But high sugar offsets this.', concernLevel: 'low', regulatoryNotes: 'Standard fortification', foundIn: ['fortified drinks'], evidenceLevel: 'high' },
    ]
  },
];

const seed = async () => {
  await connectDB();
  try {
    const inserted = await Product.insertMany(products);
    console.log(`✅ Added ${inserted.length} new products successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};
seed();
