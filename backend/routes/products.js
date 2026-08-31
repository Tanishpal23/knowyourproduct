const express = require('express');
const router = express.Router();
const { searchProducts, getProductById, getProductByBarcode, compareProducts, getAllProducts } = require('../controllers/productController');
const { protect } = require('../middleware/auth');

// Optional auth middleware - attaches user if token present but doesn't require it
const optionalAuth = async (req, res, next) => {
  const { protect: protectFn } = require('../middleware/auth');
  if (req.headers.authorization) {
    return protectFn(req, res, next);
  }
  next();
};

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/barcode/:barcode', getProductByBarcode);
router.post('/compare', compareProducts);
router.get('/:id', optionalAuth, getProductById);

module.exports = router;
