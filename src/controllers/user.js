//import
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const salt = bcrypt.genSaltSync(10);
const { User } = require('../models/User.js');

//event
const { EventEmitter } = require('events');
const emitter = new EventEmitter();
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
                if (existUser.role.includes('user')) {
                    res.redirect('/');
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
module.exports = { index, store };
