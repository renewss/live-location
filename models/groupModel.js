const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  orgranization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
});

groupSchema.index({ name: 1, orgranization: 1 }, { unique: true });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
