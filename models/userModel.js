const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do NOT match',
    },
  },
});

// MIDDLEWARES
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 14);
  this.confirmPassword = undefined;
  next();
});

// METHODS
userSchema.methods.correctPass = async function (candidate, pass) {
  return await bcrypt.compare(candidate, pass);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
