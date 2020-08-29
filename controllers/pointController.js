const Point = require('../models/pointModel');
const Group = require('../models/groupModel');
const casync = require('../utils/catchAsync');

exports.create = casync(async (req, res, next) => {
  // Adding reference fields
  req.body.user = req.user._id;
  const group = req.body.group;
  if (group) {
    req.body.group = await Group.findOne({ name: group });

    // if group not found, set to default "_Other" defined in the schema
    if (!req.body.group) req.body.group = undefined;
  }
  const point = await Point.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Points created',
      point,
    },
  });
});
