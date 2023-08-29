const express = require('express');
const router = express.Router();
const { userController } = require('../controllers/index.js');
const { validateRegistration } = require('../middlewares/validation.js');

//[GET] user login & register
router.get('/',  (req, res) => {
    const user = req.session.user || '';
    console.log(user);
    res.render('pages/home',{ title: 'Trang Chủ',user:user });
});

router.get('/login-signup', userController.index);
//[POST] user login & register
router.post('/', validateRegistration, userController.store);
//[POST] user logout
router.post('/logout', userController.logout);

module.exports = router;
