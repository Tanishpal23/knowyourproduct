const express = require('express');
const router = express.Router();
const { getDashboard, saveProduct, removeSavedProduct, updatePreferences, addScanHistory } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboard);
router.post('/save/:productId', protect, saveProduct);
router.delete('/save/:productId', protect, removeSavedProduct);
router.put('/preferences', protect, updatePreferences);
router.post('/scan/:productId', protect, addScanHistory);

module.exports = router;
