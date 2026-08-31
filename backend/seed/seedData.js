const { execSync } = require('child_process');
try { require('@dotenvx/dotenvx').config(); } catch { require('dotenv').config(); }
const mongoose = require('mongoose');
const { Product } = require('../models/Product');

const connectDB = require('../config/db');

const products = [
  {
    productName: 'Coca-Cola Classic',
    brand: 'The Coca-Cola Company',
    barcode: '0049000028911',
    category: 'Beverages',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Cocacola_can.svg/200px-Cocacola_can.svg.png',
    servingSize: '355ml (1 can)',
    country: 'USA',
    allergens: [],
    processingLevel: 'highly-processed',
    concernScore: 7.2,
    scoreBreakdown: { nutritionScore: 7.8, ingredientScore: 5.5, additiveScore: 7.0, allergenRisk: 1.0, processingScore: 8.0, overallScore: 7.2 },
    keyWarnings: ['Very high added sugar (39g per can)', 'High in calories with no nutritional benefit', 'Contains phosphoric acid (may affect bone health with high consumption)', 'Contains caffeine', 'No fiber or protein'],
    positives: ['Allergen-free', 'No trans fat', 'No artificial sweeteners in original formula', 'Short ingredient list'],
    analysisNotes: 'Coca-Cola Classic is a highly processed carbonated beverage with very high sugar content. Regular consumption is associated with increased risk of obesity, type 2 diabetes, and dental erosion. However, occasional consumption in moderate amounts is unlikely to cause harm for most healthy adults.',
    nutrition: { calories: 140, totalFat: 0, saturatedFat: 0, transFat: 0, carbohydrates: 39, totalSugar: 39, addedSugar: 39, protein: 0, fiber: 0, sodium: 45, servingSize: '355ml', servingSizeG: 355 },
    ingredients: [
      { name: 'Carbonated Water', category: 'natural', purpose: 'Base/solvent', simpleExplanation: 'Plain water with carbon dioxide gas dissolved in it. This creates the fizz and bubbles.', evidenceSummary: 'Generally considered safe for consumption.', concernLevel: 'low', regulatoryNotes: 'Approved worldwide', foundIn: ['sodas', 'sparkling water'], evidenceLevel: 'high' },
      { name: 'High Fructose Corn Syrup', category: 'sweetener', purpose: 'Sweetener', simpleExplanation: 'A liquid sweetener made from corn starch. It\'s chemically similar to table sugar but cheaper to produce.', evidenceSummary: 'High intake of added sugars including HFCS is associated with obesity, type 2 diabetes, and cardiovascular disease. The body metabolizes HFCS similarly to regular sugar.', concernLevel: 'high', regulatoryNotes: 'FDA GRAS status, but dietary guidelines recommend limiting all added sugars', foundIn: ['soft drinks', 'processed foods', 'sauces', 'candy'], evidenceLevel: 'high' },
      { name: 'Caramel Color', category: 'coloring', purpose: 'Color additive (gives the dark brown color)', simpleExplanation: 'A dark brown coloring made by heating sugar. It gives cola its characteristic brown color.', evidenceSummary: 'Class IV caramel color (used in colas) contains 4-MEI, a compound that may be of concern at very high consumption levels. Current amounts in beverages are generally considered within safe limits.', concernLevel: 'moderate', regulatoryNotes: 'FDA permitted; California Prop. 65 requires warning labels for high 4-MEI products', foundIn: ['colas', 'sauces', 'beer'], evidenceLevel: 'moderate' },
      { name: 'Phosphoric Acid', category: 'additive', purpose: 'Acidulant (provides tartness and preserves flavor)', simpleExplanation: 'An acid that gives cola its sharp, tangy taste and helps preserve the product.', evidenceSummary: 'High consumption of phosphoric acid from sodas has been associated with lower bone density in some studies. This may partly be due to displacement of calcium-rich beverages rather than a direct effect.', concernLevel: 'moderate', regulatoryNotes: 'FDA permitted food additive (E338)', foundIn: ['colas', 'processed foods'], evidenceLevel: 'moderate' },
      { name: 'Natural Flavors', category: 'flavor', purpose: 'Flavoring (the proprietary Coca-Cola formula)', simpleExplanation: 'A blend of natural flavoring compounds. The exact recipe is Coca-Cola\'s famous trade secret.', evidenceSummary: 'Natural flavors are derived from natural sources. The specific compounds in Coca-Cola\'s formula are not publicly disclosed.', concernLevel: 'low', regulatoryNotes: 'FDA regulated under 21 CFR 101.22', foundIn: ['processed foods', 'beverages'], evidenceLevel: 'limited' },
      { name: 'Caffeine', category: 'additive', purpose: 'Stimulant (provides the mild energizing effect)', simpleExplanation: 'A natural stimulant found in coffee and tea. Each can contains about 34mg — roughly 1/3 of a cup of coffee.', evidenceSummary: 'Moderate caffeine consumption is generally safe for adults. High intake may cause anxiety, sleep disruption, or heart palpitations. Children and pregnant women should limit intake.', concernLevel: 'moderate', regulatoryNotes: 'FDA considers up to 400mg/day safe for healthy adults', foundIn: ['coffee', 'tea', 'energy drinks', 'colas'], evidenceLevel: 'high' }
    ]
  },
  {
    productName: 'Oreo Original Sandwich Cookies',
    brand: 'Nabisco (Mondelēz International)',
    barcode: '0044000032784',
    category: 'Snacks & Cookies',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Oreo_logo_2023_-_wordmark.svg/200px-Oreo_logo_2023_-_wordmark.svg.png',
    servingSize: '34g (3 cookies)',
    country: 'USA',
    allergens: ['Milk', 'Soy', 'Wheat'],
    processingLevel: 'highly-processed',
    concernScore: 6.5,
    scoreBreakdown: { nutritionScore: 6.5, ingredientScore: 6.0, additiveScore: 6.0, allergenRisk: 5.5, processingScore: 7.5, overallScore: 6.5 },
    keyWarnings: ['High added sugar (14g per serving)', 'Contains multiple allergens (milk, soy, wheat)', 'Highly processed product', 'High in saturated fat', 'Low nutritional value'],
    positives: ['No artificial colors', 'No high fructose corn syrup', 'No artificial preservatives listed', 'Provides some iron'],
    analysisNotes: 'Oreo cookies are a highly processed snack with significant added sugar and saturated fat. They contain multiple major allergens. While they contain no artificial colors or HFCS, they provide minimal nutritional benefit.',
    nutrition: { calories: 160, totalFat: 7, saturatedFat: 2, transFat: 0, carbohydrates: 25, totalSugar: 14, addedSugar: 14, protein: 1, fiber: 1, sodium: 135, servingSize: '34g', servingSizeG: 34 },
    ingredients: [
      { name: 'Unbleached Enriched Flour', category: 'natural', purpose: 'Base ingredient / structure', simpleExplanation: 'Wheat flour that has had some nutrients added back after milling.', evidenceSummary: 'Refined wheat flour has a high glycemic index. Contains gluten — important for those with celiac disease or wheat sensitivity.', concernLevel: 'low', regulatoryNotes: 'Standard food ingredient', foundIn: ['bread', 'cookies', 'pasta'], evidenceLevel: 'high' },
      { name: 'Sugar', category: 'sweetener', purpose: 'Sweetener', simpleExplanation: 'Common table sugar (sucrose) used for sweetness.', evidenceSummary: 'High sugar intake is associated with obesity, dental decay, and metabolic issues. 14g of added sugar per serving is a significant amount relative to recommended daily limits.', concernLevel: 'moderate', regulatoryNotes: 'Dietary guidelines recommend <10% of daily calories from added sugars', foundIn: ['almost all processed foods'], evidenceLevel: 'high' },
      { name: 'Palm Oil', category: 'natural', purpose: 'Fat/texture', simpleExplanation: 'A vegetable oil from palm trees used to give cookies their texture and crispiness.', evidenceSummary: 'Palm oil is high in saturated fat, which may affect cardiovascular health with excessive consumption. It also has significant environmental concerns related to deforestation.', concernLevel: 'moderate', regulatoryNotes: 'Food-grade palm oil is permitted', foundIn: ['cookies', 'crackers', 'margarine', 'processed foods'], evidenceLevel: 'moderate' },
      { name: 'Cocoa (Alkalized)', category: 'natural', purpose: 'Flavor/color', simpleExplanation: 'Cocoa powder treated with an alkalizing agent to reduce acidity and give a darker color and milder flavor.', evidenceSummary: 'Alkalization reduces some beneficial antioxidants in cocoa. However, cocoa powder itself is generally considered safe.', concernLevel: 'low', regulatoryNotes: 'Common food ingredient', foundIn: ['chocolate products', 'cookies'], evidenceLevel: 'moderate' },
      { name: 'High Oleic Canola Oil', category: 'natural', purpose: 'Fat', simpleExplanation: 'A type of canola oil high in oleic acid (a healthy monounsaturated fat). Used for texture and mouthfeel.', evidenceSummary: 'High oleic canola oil has a more favorable fatty acid profile than regular canola oil. Generally considered heart-healthy in moderation.', concernLevel: 'low', regulatoryNotes: 'FDA permitted', foundIn: ['processed snacks', 'cooking oils'], evidenceLevel: 'moderate' },
      { name: 'Soy Lecithin', category: 'emulsifier', purpose: 'Emulsifier (keeps ingredients mixed together)', simpleExplanation: 'A fat-like substance from soybeans that helps mix ingredients that normally don\'t blend, like fat and water.', evidenceSummary: 'Soy lecithin is generally considered safe. It contains very small amounts of soy protein — people with severe soy allergies should consult a doctor.', concernLevel: 'low', regulatoryNotes: 'FDA GRAS; allergen disclosure required', foundIn: ['chocolate', 'baked goods', 'margarine'], evidenceLevel: 'high' },
      { name: 'Vanillin', category: 'flavor', purpose: 'Artificial vanilla flavor', simpleExplanation: 'A synthetic compound that mimics the taste of vanilla. Much cheaper than real vanilla extract.', evidenceSummary: 'Vanillin is one of the most studied flavor compounds and is generally recognized as safe at typical consumption levels.', concernLevel: 'low', regulatoryNotes: 'FDA GRAS', foundIn: ['cookies', 'chocolates', 'ice cream'], evidenceLevel: 'high' }
    ]
  },
  {
    productName: 'Lay\'s Classic Potato Chips',
    brand: 'Frito-Lay (PepsiCo)',
    barcode: '0028400090094',
    category: 'Snacks & Chips',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Lays_logo_Jan_2023.svg/200px-Lays_logo_Jan_2023.svg.png',
    servingSize: '28g (about 15 chips)',
    country: 'USA',
    allergens: [],
    processingLevel: 'processed',
    concernScore: 5.2,
    scoreBreakdown: { nutritionScore: 5.5, ingredientScore: 2.5, additiveScore: 2.0, allergenRisk: 1.0, processingScore: 6.0, overallScore: 5.2 },
    keyWarnings: ['High in sodium (160mg per serving adds up quickly)', 'High in fat', 'Easy to overconsume — portion control is important', 'Fried at high temperatures (acrylamide formation)'],
    positives: ['Only 3 ingredients — very simple formulation', 'No artificial colors or flavors', 'No artificial preservatives', 'Allergen-free', 'Gluten-free', 'No added sugar'],
    analysisNotes: 'Lay\'s Classic chips have one of the simplest ingredient lists among potato chips — just potatoes, oil, and salt. The main concerns are high fat and sodium content, and the fact that frying starchy foods produces acrylamide.',
    nutrition: { calories: 160, totalFat: 10, saturatedFat: 1.5, transFat: 0, carbohydrates: 15, totalSugar: 0, addedSugar: 0, protein: 2, fiber: 1, sodium: 160, servingSize: '28g', servingSizeG: 28 },
    ingredients: [
      { name: 'Potatoes', category: 'natural', purpose: 'Main ingredient', simpleExplanation: 'Real potatoes, sliced thin and fried.', evidenceSummary: 'Potatoes are a natural food source. When fried, they gain significant fat calories. Frying also produces acrylamide.', concernLevel: 'low', regulatoryNotes: 'Natural food', foundIn: ['potato chips', 'fries'], evidenceLevel: 'high' },
      { name: 'Vegetable Oil', category: 'natural', purpose: 'Cooking medium / fat', simpleExplanation: 'A blend of sunflower, corn, or canola oil used for frying.', evidenceSummary: 'Vegetable oils are generally considered healthier than animal fats. High-temperature frying can degrade oil quality and produce some undesirable compounds.', concernLevel: 'low', regulatoryNotes: 'Standard food ingredient', foundIn: ['fried foods', 'processed snacks'], evidenceLevel: 'moderate' },
      { name: 'Salt', category: 'natural', purpose: 'Seasoning / preservative', simpleExplanation: 'Common table salt (sodium chloride). Adds flavor and acts as a mild preservative.', evidenceSummary: 'High sodium intake is associated with hypertension (high blood pressure). Most people consume more sodium than recommended. Chips make portion control important.', concernLevel: 'moderate', regulatoryNotes: 'Dietary guidelines recommend <2,300mg sodium per day', foundIn: ['almost all savory foods'], evidenceLevel: 'high' }
    ]
  },
  {
    productName: 'Maggi 2-Minute Noodles',
    brand: 'Nestlé',
    barcode: '8901058007944',
    category: 'Instant Noodles',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Maggi_logo.svg/200px-Maggi_logo.svg.png',
    servingSize: '70g (1 cake + seasoning)',
    country: 'India',
    allergens: ['Wheat', 'Milk'],
    processingLevel: 'highly-processed',
    concernScore: 7.8,
    scoreBreakdown: { nutritionScore: 7.5, ingredientScore: 7.0, additiveScore: 8.0, allergenRisk: 4.0, processingScore: 8.5, overallScore: 7.8 },
    keyWarnings: ['Extremely high sodium (900mg+ per serving — ~40% of daily limit)', 'Contains MSG (monosodium glutamate)', 'Contains multiple flavor enhancers', 'Highly processed', 'Very low in fiber and protein for a meal', 'Contains wheat (gluten)'],
    positives: ['Quick, convenient preparation', 'Provides some carbohydrates for energy', 'Low in sugar', 'Low in fat'],
    analysisNotes: 'Maggi noodles are a highly popular convenience food but are nutritionally poor. The sodium content is particularly concerning — a single serving contains nearly 40% of the daily recommended sodium. The product contains multiple flavor enhancers including MSG.',
    nutrition: { calories: 310, totalFat: 12, saturatedFat: 5, transFat: 0, carbohydrates: 46, totalSugar: 2, addedSugar: 2, protein: 7, fiber: 2, sodium: 910, servingSize: '70g', servingSizeG: 70 },
    ingredients: [
      { name: 'Wheat Flour (Maida)', category: 'natural', purpose: 'Base ingredient / noodle structure', simpleExplanation: 'Refined white wheat flour, the main ingredient of the noodle cake.', evidenceSummary: 'Refined flour has low fiber content and a high glycemic index. Contains gluten — important for those with celiac disease or gluten sensitivity.', concernLevel: 'low', regulatoryNotes: 'Common food ingredient', foundIn: ['noodles', 'bread', 'pasta'], evidenceLevel: 'high' },
      { name: 'Palm Olein', category: 'natural', purpose: 'Frying medium (the noodles are fried)', simpleExplanation: 'A fraction of palm oil with a higher proportion of unsaturated fats. Used to fry the noodles and extend shelf life.', evidenceSummary: 'Palm olein is high in saturated fat. The frying process means the noodle cake has significant fat content. Environmental concerns with palm oil sourcing.', concernLevel: 'moderate', regulatoryNotes: 'Permitted food ingredient', foundIn: ['instant noodles', 'fried snacks'], evidenceLevel: 'moderate' },
      { name: 'Monosodium Glutamate (MSG)', category: 'additive', purpose: 'Flavor enhancer (umami taste)', simpleExplanation: 'The sodium salt of glutamic acid, an amino acid. It enhances savory flavors and is responsible for the characteristic "Maggi taste."', evidenceSummary: 'MSG is one of the most extensively studied food ingredients. Major health organizations (FDA, WHO) consider MSG safe at normal consumption levels. The "Chinese Restaurant Syndrome" concept has not been consistently supported by controlled studies. However, MSG significantly adds to sodium intake.', concernLevel: 'moderate', regulatoryNotes: 'FDA GRAS; must be declared on label; adds sodium to product', foundIn: ['instant noodles', 'seasoning packets', 'snacks', 'restaurant food'], evidenceLevel: 'high' },
      { name: 'Hydrolyzed Vegetable Protein (HVP)', category: 'additive', purpose: 'Flavor enhancer', simpleExplanation: 'A flavoring made by chemically breaking down plant proteins. It naturally creates glutamate, which enhances savory flavor.', evidenceSummary: 'HVP is permitted and generally safe. It also contains glutamate (similar to MSG) and contributes to sodium intake. The manufacturing process can produce some undesirable byproducts in poorly processed versions.', concernLevel: 'moderate', regulatoryNotes: 'FDA permitted; must be labeled', foundIn: ['soups', 'sauces', 'snacks', 'instant noodles'], evidenceLevel: 'moderate' },
      { name: 'Sodium', category: 'additive', purpose: 'Electrolyte / preservative / flavor', simpleExplanation: 'Salt added through multiple sodium compounds in the seasoning. High sodium is the biggest nutritional concern with Maggi.', evidenceSummary: 'High sodium intake is linked to hypertension and cardiovascular risk. A single serving of Maggi provides 910mg sodium — nearly 40% of the WHO recommended daily limit of 2000mg.', concernLevel: 'high', regulatoryNotes: 'WHO recommends <2g sodium/day; most people already exceed this', foundIn: ['seasoning', 'processed foods', 'fast food'], evidenceLevel: 'high' },
      { name: 'Turmeric', category: 'natural', purpose: 'Color and flavor', simpleExplanation: 'A natural yellow spice used to add color and flavor.', evidenceSummary: 'Turmeric contains curcumin, which has anti-inflammatory properties. Generally considered beneficial.', concernLevel: 'low', regulatoryNotes: 'Natural spice, FDA GRAS', foundIn: ['curries', 'spice mixes', 'processed foods'], evidenceLevel: 'moderate' }
    ]
  },
  {
    productName: 'Tropicana Pure Premium Orange Juice',
    brand: 'Tropicana (PepsiCo)',
    barcode: '0048500202050',
    category: 'Juices & Beverages',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Tropicana-Logo.svg/200px-Tropicana-Logo.svg.png',
    servingSize: '240ml (8 fl oz)',
    country: 'USA',
    allergens: [],
    processingLevel: 'processed',
    concernScore: 3.8,
    scoreBreakdown: { nutritionScore: 4.0, ingredientScore: 2.0, additiveScore: 2.0, allergenRisk: 1.0, processingScore: 5.0, overallScore: 3.8 },
    keyWarnings: ['High in natural sugar (22g per serving)', 'Lacks fiber found in whole oranges', 'Calorie-dense liquid form — easy to overconsume', 'Not a substitute for whole fruit'],
    positives: ['Good source of Vitamin C (120% DV)', 'No added sugar', 'No artificial colors or preservatives', 'Contains potassium', 'No allergens', 'Contains folate'],
    analysisNotes: 'Tropicana Pure Premium OJ is made from real oranges and contains no added sugar. The main concern is that it packs the sugar of multiple oranges without the fiber, making it easy to overconsume. Whole oranges are nutritionally preferable, but OJ remains one of the better juice options.',
    nutrition: { calories: 110, totalFat: 0, saturatedFat: 0, transFat: 0, carbohydrates: 26, totalSugar: 22, addedSugar: 0, protein: 2, fiber: 0, sodium: 0, servingSize: '240ml', servingSizeG: 240 },
    ingredients: [
      { name: '100% Pure Squeezed Pasteurized Orange Juice', category: 'natural', purpose: 'Main ingredient', simpleExplanation: 'Real oranges squeezed for their juice, then pasteurized (heated) to kill bacteria and extend shelf life.', evidenceSummary: 'Real orange juice contains Vitamin C, folate, potassium, and antioxidants. Pasteurization destroys some Vitamin C. The main downside vs. whole oranges is no fiber.', concernLevel: 'low', regulatoryNotes: 'Natural food product', foundIn: ['orange juice products'], evidenceLevel: 'high' }
    ]
  },
  {
    productName: 'Quaker Old Fashioned Rolled Oats',
    brand: 'Quaker Oats (PepsiCo)',
    barcode: '0030000010297',
    category: 'Breakfast & Grains',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Quaker_Oats_logo_2020.svg/200px-Quaker_Oats_logo_2020.svg.png',
    servingSize: '40g (1/2 cup dry)',
    country: 'USA',
    allergens: ['Oats (may contain wheat trace)'],
    processingLevel: 'minimally-processed',
    concernScore: 1.5,
    scoreBreakdown: { nutritionScore: 1.5, ingredientScore: 1.0, additiveScore: 1.0, allergenRisk: 2.0, processingScore: 1.0, overallScore: 1.5 },
    keyWarnings: ['May contain trace wheat — important for celiac disease patients', 'Oats are inherently gluten-free but often cross-contaminated during processing'],
    positives: ['Single ingredient product — 100% whole grain oats', 'Excellent source of fiber (4g per serving)', 'Good protein content (5g)', 'Heart health claims backed by FDA', 'Low sodium', 'No added sugar', 'No artificial anything', 'Contains beta-glucan (supports healthy cholesterol)', 'Low glycemic index'],
    analysisNotes: 'Quaker Old Fashioned Rolled Oats is one of the cleanest products you can buy — a single ingredient food that is minimally processed. Oats are nutritionally excellent with high fiber, good protein, and beneficial beta-glucan. The only note is potential for trace wheat for celiac patients.',
    nutrition: { calories: 150, totalFat: 3, saturatedFat: 0.5, transFat: 0, carbohydrates: 27, totalSugar: 1, addedSugar: 0, protein: 5, fiber: 4, sodium: 0, servingSize: '40g', servingSizeG: 40 },
    ingredients: [
      { name: 'Whole Grain Rolled Oats', category: 'natural', purpose: 'Single ingredient / whole grain food', simpleExplanation: 'Oat groats that have been steamed and rolled flat for faster cooking. No other processing.', evidenceSummary: 'Oats are one of the most nutritionally studied grains. Rich in beta-glucan fiber, which is FDA-approved to claim it may reduce risk of heart disease. High protein for a grain. Low glycemic index supports blood sugar management.', concernLevel: 'low', regulatoryNotes: 'FDA allows heart health claim for oats', foundIn: ['oatmeal', 'granola', 'baked goods'], evidenceLevel: 'high' }
    ]
  }
];

const seed = async () => {
  await connectDB();
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    console.log(`✅ Seeded ${inserted.length} products successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
