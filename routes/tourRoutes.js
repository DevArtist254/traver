const express = require('express');

const {createATour, getAllTours} = require('../controller/tourController');

const router = express.Router();

router.get('/', getAllTours);
router.post('/', createATour);

module.exports = router;
