const express = require('express');
const router = express.Router();
const {klassController} = require('../controllers/index.js')

//[GET] class
router.get('/',klassController.index)

module.exports = router;
