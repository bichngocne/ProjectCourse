const express = require('express');
const router = express.Router();
const app = express();
const adminController = require('../controllers/index.js');
const jwt = require('jsonwebtoken');

// Route for admin
router.use('/', (req, res) => {
    const token = req.cookies.token; // Lấy token từ cookies (hoặc headers tùy theo cách bạn lưu token)
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
            // Token hợp lệ và đã tạo
            console.log('Token is valid and belongs to:', decodedToken.user_id);
            res.render('pages/adminpotal', { title: 'Trang Chủ Admin' });
        } catch (error) {
            // Token không hợp lệ hoặc đã hết hạn
            console.error('Token is not valid:', error.message);
            // Chuyển hướng người dùng đến trang đăng nhập hoặc trang chính (tùy theo xử lý của bạn)
            res.redirect('/user');
        }
    } else {
        // Không có token, chưa đăng nhập
        console.log('No token, user is not logged in');
        // Chuyển hướng người dùng đến trang đăng nhập
        res.redirect('/user');
    }
});

//[GET] admin
// router.get('/',(req,res, next)=>{
//     if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//         jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.TOKEN_KEY, function(err, decode) {
//             if (err) {
//                 res.redirect('/home')
//                 next();
//             } else {
//                 res.render('pages/adminpotal', { title: 'Trang Chủ Admin' });
//             }
//             next();
//         });
//     } else {
//         res.redirect('/home')
//         next();
//     }
   
// })

module.exports = router;
