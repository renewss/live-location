const express = require('express');
const pointController = require('../controllers/pointController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/', authController.protect, pointController.create);

module.exports = router;
