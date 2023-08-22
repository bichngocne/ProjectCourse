const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
//import connection db
const connect = require('./database/connect');
connect();

//import
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const { user, admin } = require('./routes/index.js');
const { engine } = require('express-handlebars');
const checkToken = require('./middlewares/authentication.js');
// GET port
const port = process.env.PORT || 3000;
app.use(cookieParser()); // Sử dụng cookie-parser middleware

// SET log
async function setLog(app) {
    morgan.token('id', function getId(req, res, next) {
        req.id = uuidv4();
        return req.id;
    });

    morgan.token('param', function (req, res, param) {
        return 'userToken';
    });

    let accessLogStream = fs.createWriteStream(
        path.join(__dirname, 'access.log'),
        {
            flags: 'a',
        },
    );
    app.use(
        morgan(':id :param :method :status :url "HTTP/:http-version"', {
            stream: accessLogStream,
        }),
    );
    // Middleware xử lý lỗi
    app.use((err, req, res, next) => {
        console.error(err.stack);
        accessLogStream.write(`Error: ${err.message}\n`);
        res.status(500).send('Something went wrong!');
    });
}
setLog(app);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// static file
app.use('/static', express.static(path.join(__dirname, 'public')));

//views engine
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', 'src/views');
// app.use(checkToken)
app.use('/user' ,user);
//[GET] home
app.get('/home', (req, res) => {
    res.render('pages/home', { title: 'Trang Chủ' });
});
app.use(function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.TOKEN_KEY, function(err, decode) {
            if (err) {
                // Token không hợp lệ hoặc đã hết hạn, chưa đăng nhập
                req.user = undefined;
            } else {
                req.user = decode;
            }
            next();
        });
    } else {
        // Không có token trong yêu cầu, chưa đăng nhập
        req.user = undefined;
        next();
    }
});

//route
//[GET] admin
app.use('/admin',admin);
//[USE] route user


app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
});
