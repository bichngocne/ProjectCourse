const express = require('express');
const router = express.Router();
const {adminController} = require('../controllers/index.js');


// Route for admin
router.get('/' ,adminController.index);


module.exports = router;
