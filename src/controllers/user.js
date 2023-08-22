//import
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const salt = bcrypt.genSaltSync(10);
const { User } = require('../models/User.js');
const checkToken = require('../middlewares/authentication.js');
//event
const { EventEmitter } = require('events');
const emitter = new EventEmitter();
const jwt = require('jsonwebtoken')
// Bắt sự kiện 'register'
emitter.on('register', (user) => {
    console.log(`Đăng ký thành công cho tài khoản: ${user.email}`);
});
//bat su kien login
emitter.on('login', (user) => {
    console.log(`Đăng nhập thành công cho tài khoản: ${user.email}`);
});

//[GET] login & register
const index = async (req, res) => {
    res.render('pages/authentication', { title: 'Trang Chủ' });
};

//[POST] login & register
async function store(req, res, next) {
    const { email, password } = req.body;
    debugger;
    if (req.body.signup) {
        const passwordHash = bcrypt.hashSync(password, salt);
        const existUser = await User.find({ email });
        if (existUser.length > 0) {
            res.render('pages/authentication', { error: 'Email exist' });
        } else {
            // Kiểm tra dữ liệu bằng middleware validation
            const errors = await validationResult(req);
            if (!errors.isEmpty()) {
                debugger;
                return res.render('pages/authentication', {
                    error: JSON.stringify(errors.errors[0]['msg']),
                });
            }
            const user = new User({
                email: email,
                password: passwordHash,
            });
            user.save()
                .then((user) => {
                    res.render('pages/authentication', {
                        message: 'register successfull',
                    });
                    emitter.emit('register', user);
                })
                .catch(() => {
                    res.render('pages/authentication', {
                        error: 'register unsuccessfull',
                    });
                });
        }
        debugger;
    } else if (req.body.login) {
        //login
        debugger;
        const existUser = await User.findOne({ email });

        if (existUser) {
            const passwordMatches = bcrypt.compareSync(
                password,
                existUser.password,
            );
            if (passwordMatches) {
                // Đúng email và mật khẩu
                emitter.emit('login', existUser);
                //create token
                // Tạo token
                const token = jwt.sign(
                    { user_id: existUser._id, email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "24h",
                    }
                );

                // Lưu token vào cookies
                res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
                console.log(token);
                if (existUser.role.includes('user')) {
                    res.redirect('/home');
                } else {
                    res.redirect('/admin');
                }
            } else {
                // Sai mật khẩu
                res.render('pages/authentication', {
                    error: 'Incorrect email or password',
                });
            }
        } else {
            // Sai email hoặc không tìm thấy người dùng
            res.render('pages/authentication', {
                error: 'Incorrect email or password',
            });
        }
    }
    debugger;
}
//[POST] user logout
function logout(req, res, next) {
    // Xóa JWT token bằng cách gửi một token rỗng cho client
    res.cookie('token', '', { expires: new Date(0) });
    // Trả về phản hồi JSON
    res.send(res.json({ success: true, message: 'Đăng xuất thành công' }));
}
module.exports = { index, store, logout };
