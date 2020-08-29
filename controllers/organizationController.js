const Organization = require('../models/organizationModel');
const casync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const util = require('util');

exports.create = casync(async (req, res, next) => {
  req.body.owner = req.user._id;
  const org = await Organization.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Organization created',
      org,
    },
  });
});

exports.getMyAll = casync(async (req, res, next) => {
  const orgs = await Organization.find({ owner: req.user._id });

  res.status(200).json({
    status: 'success',
    data: {
      organizations: orgs,
    },
  });
});

exports.getMy = casync(async (req, res, next) => {
  const org = await Organization.findById(req.params.id).populate('admin').populate('member');

  if (!org.getRole(req.user._id)) return next(new AppError('Not Accessible', 403));

  res.status(200).json({
    status: 'success',
    data: {
      organization: org,
    },
  });
});

exports.addMember = casync(async (req, res, next) => {
  const org = await Organization.findById(req.params.id).populate('member');
  const user = await User.findOne({ name: req.body.name });
  // await Promise.all([org, user]);

  // if organization id correct
  if (!org) return next(new AppError('Invalid Organization ID', 400));
  // if user exists
  if (!user) return next(new AppError('No User found!', 404));

  // if already in list
  if (org.getRole(user._id)) return next(new AppError('User already in List', 400));

  org.member.push(user._id);
  await org.save();

  // making array of the names of members
  const members = org.member.map((val) => val.name);
  members.splice(members.length - 1, 1, user.name);

  res.status(200).json({
    status: 'success',
    data: {
      members,
    },
  });
});

exports.addAdmin = casync(async (req, res, next) => {
  const org = await Organization.findById(req.params.id).populate('admin');
  const user = await User.findOne({ name: req.body.name });

  // if organization id correct
  if (!org) return next(new AppError('Invalid Organization ID', 400));
  // if user exists
  if (!user) return next(new AppError('No User found!', 404));

  // to add admin user must exist in member list
  if (org.getRole(user._id) !== 'Member') return next(new AppError('User must be in member list!', 400));

  // removing from member list
  org.removeFromMember(user._id);
  org.admin.push(user._id);
  await org.save();

  // making array of the names of members
  const admins = org.admin.map((val) => val.name);
  admins.splice(admins.length - 1, 1, user.name);

  res.status(200).json({
    status: 'success',
    data: {
      admins,
    },
  });
});

// HELPER FUNCTION
exports.restrictTo = (...roles) => async (req, res, next) => {
  const org = await Organization.findById(req.params.id);

  if (!org) return next(new AppError('Invalid Organization ID', 400));
  const role = org.getRole(req.user.id);

  if (!roles.includes(role)) return next(new AppError('Not Allowed', 403));

  next();
};
