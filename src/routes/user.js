const express = require('express');
const router = express.Router();
const { userController } = require('../controllers/index.js');
const { validateRegistration } = require('../middlewares/validation.js');

//[GET] user login & register
router.get('/', userController.index);
//[POST] user login & register
router.post('/', validateRegistration, userController.store);

module.exports = router;
