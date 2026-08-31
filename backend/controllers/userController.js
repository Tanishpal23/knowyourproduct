const User = require('../models/User');
const { Product } = require('../models/Product');

// @route GET /api/users/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({ path: 'scanHistory.product', select: 'productName brand image concernScore category', options: { retainNullValues: false } })
      .populate({ path: 'savedProducts', select: 'productName brand image concernScore category' });
    const cleanHistory = (user.scanHistory || []).filter(h => h.product).slice(0, 20);
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, preferences: user.preferences }, scanHistory: cleanHistory, savedProducts: user.savedProducts || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/users/save/:productId
exports.saveProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.savedProducts.includes(req.params.productId)) {
      return res.json({ success: true, message: 'Already saved' });
    }
    user.savedProducts.push(req.params.productId);
    await user.save();
    res.json({ success: true, message: 'Product saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/users/save/:productId
exports.removeSavedProduct = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { savedProducts: req.params.productId } });
    res.json({ success: true, message: 'Product removed from saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/users/preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { diet, avoidAllergens, avoidHighSugar, avoidHighSodium, avoidHighSaturatedFat } = req.body;
    const update = {};
    if (diet) update['preferences.diet'] = diet;
    if (avoidAllergens) update['preferences.avoidAllergens'] = avoidAllergens;
    if (avoidHighSugar !== undefined) update['preferences.avoidHighSugar'] = avoidHighSugar;
    if (avoidHighSodium !== undefined) update['preferences.avoidHighSodium'] = avoidHighSodium;
    if (avoidHighSaturatedFat !== undefined) update['preferences.avoidHighSaturatedFat'] = avoidHighSaturatedFat;
    const user = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true }).select('-password');
    res.json({ success: true, preferences: user.preferences });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/users/scan/:productId
exports.addScanHistory = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { scanHistory: { $each: [{ product: req.params.productId, scannedAt: new Date() }], $position: 0, $slice: 50 } }
    });
    res.json({ success: true, message: 'Scan recorded' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
