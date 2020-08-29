const mongoose = require('mongoose');
const User = require('./userModel');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    unique: true,
  },
  // users
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  admin: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  member: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// MIDDLEWARES
organizationSchema.pre(/^find/, async function (next) {
  this.populate({ path: 'owner', select: '-__v ' });

  next();
});

// METHODS
// identify the role of user in the organization
organizationSchema.methods.getRole = function (id) {
  if (this.owner._id.equals(id)) return 'Owner';
  else if (this.admin.some((val) => val._id.equals(id))) return 'Admin';
  else if (this.member.some((val) => val._id.equals(id))) return 'Member';
  else return false;
};

organizationSchema.methods.removeFromMember = function (id) {
  let index = 0;
  console.log(this.member);
  console.log(id);
  this.member.forEach((val, i) => {
    if (val._id.equals(id)) {
      index = i;
      return;
    }
  });
  console.log(index);

  this.member.splice(index, 1);
};

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
