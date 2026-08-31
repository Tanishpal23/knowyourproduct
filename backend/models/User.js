const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  preferences: {
    diet: { type: String, enum: ['none', 'vegetarian', 'vegan'], default: 'none' },
    avoidAllergens: [{ type: String }],
    avoidHighSugar: { type: Boolean, default: false },
    avoidHighSodium: { type: Boolean, default: false },
    avoidHighSaturatedFat: { type: Boolean, default: false }
  },
  savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  scanHistory: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    scannedAt: { type: Date, default: Date.now }
  }],
  // Forgot-password OTP
  otp:         { type: String },
  otpExpires:  { type: Date },
  otpVerified: { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
