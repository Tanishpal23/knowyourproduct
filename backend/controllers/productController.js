const { Product } = require('../models/Product');
const User = require('../models/User');

// @route GET /api/products/search?q=query
exports.searchProducts = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 12 } = req.query;
    const query = {};
    if (q) query.$text = { $search: q };
    if (category) query.category = category;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(query).select('productName brand category image concernScore allergens processingLevel barcode').skip(skip).limit(parseInt(limit));
    const total = await Product.countDocuments(query);
    res.json({ success: true, products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    // Track scan history if user authenticated  
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { scanHistory: { product: product._id, scannedAt: new Date(), $position: 0 } }
      });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/products/barcode/:barcode
exports.getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found in our database. Try searching by name.' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/products/compare
exports.compareProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length < 2) return res.status(400).json({ success: false, message: 'Provide at least 2 product IDs' });
    const products = await Product.find({ _id: { $in: ids } }).select('productName brand category image concernScore nutrition allergens ingredients scoreBreakdown processingLevel keyWarnings positives');
    if (products.length < 2) return res.status(404).json({ success: false, message: 'One or more products not found' });
    // Determine better choice
    const sorted = [...products].sort((a, b) => a.concernScore - b.concernScore);
    res.json({ success: true, products, betterChoice: sorted[0]._id, betterChoiceName: sorted[0].productName });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select('productName brand category image concernScore allergens processingLevel barcode').limit(50);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
