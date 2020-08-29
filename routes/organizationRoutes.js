const express = require('express');
const authController = require('../controllers/authController');
const orgController = require('../controllers/organizationController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.route('/').get(orgController.getMyAll).post(orgController.create);
router.route('/:id').get(orgController.getMy);
router.patch('/add-member/:id', orgController.restrictTo('Owner', 'Admin'), orgController.addMember);
router.patch('/add-admin/:id', orgController.restrictTo('Owner'), orgController.addAdmin);

module.exports = router;
