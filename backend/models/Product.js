const mongoose = require('mongoose');

const IngredientInfoSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  aliases: [String],
  category: { type: String, enum: ['natural', 'additive', 'preservative', 'sweetener', 'coloring', 'emulsifier', 'flavor', 'nutrient', 'allergen', 'other'], default: 'other' },
  purpose: String,
  simpleExplanation: String,
  evidenceSummary: String,
  concernLevel: { type: String, enum: ['low', 'moderate', 'high', 'significant'], default: 'low' },
  regulatoryNotes: String,
  foundIn: [String],
  evidenceLevel: { type: String, enum: ['high', 'moderate', 'limited', 'uncertain'], default: 'limited' }
}, { timestamps: true });

const ProductIngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  purpose: String,
  simpleExplanation: String,
  evidenceSummary: String,
  concernLevel: { type: String, enum: ['low', 'moderate', 'high', 'significant'], default: 'low' },
  regulatoryNotes: String,
  foundIn: [String],
  evidenceLevel: { type: String, enum: ['high', 'moderate', 'limited', 'uncertain'], default: 'limited' }
});

const NutritionSchema = new mongoose.Schema({
  calories: Number,
  totalFat: Number,
  saturatedFat: Number,
  transFat: Number,
  carbohydrates: Number,
  totalSugar: Number,
  addedSugar: Number,
  protein: Number,
  fiber: Number,
  sodium: Number,
  servingSize: String,
  servingSizeG: Number
});

const ScoreBreakdownSchema = new mongoose.Schema({
  nutritionScore: Number,
  ingredientScore: Number,
  additiveScore: Number,
  allergenRisk: Number,
  processingScore: Number,
  overallScore: Number
});

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  brand: String,
  barcode: { type: String, unique: true, sparse: true },
  category: String,
  image: String,
  servingSize: String,
  country: String,
  ingredients: [ProductIngredientSchema],
  nutrition: NutritionSchema,
  allergens: [String],
  processingLevel: { type: String, enum: ['minimally-processed', 'processed', 'highly-processed', 'unknown'], default: 'unknown' },
  concernScore: { type: Number, min: 0, max: 10 },
  scoreBreakdown: ScoreBreakdownSchema,
  keyWarnings: [String],
  positives: [String],
  analysisNotes: String
}, { timestamps: true });

ProductSchema.index({ productName: 'text', brand: 'text', category: 'text' });

const Product = mongoose.model('Product', ProductSchema);
const IngredientInfo = mongoose.model('IngredientInfo', IngredientInfoSchema);

module.exports = { Product, IngredientInfo };
