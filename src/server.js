const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 
const multer = require('multer');
//import connection db
const connect = require('./database/connect');
connect();
var methodOverride = require('method-override')

//import
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const { user, admin, course } = require('./routes/index.js');
const { engine } = require('express-handlebars');
const session = require('express-session');
const Handlebars = require('handlebars');
const {checkToken} = require('./middlewares/authentication.js');

// GET port
const port = process.env.PORT || 3000;
app.use(cookieParser()); // Sử dụng cookie-parser middleware
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.SECRET_SESSION,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 giờ
    },
}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//views engine
app.engine('.hbs', engine({ extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', 'src/views');

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

// Định nghĩa helper contains
Handlebars.registerHelper('contains', function (arr, value, options) {
    if (arr.includes(value)) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
// Định nghĩa helper print
Handlebars.registerHelper('print', function (value) {
    return ++value
  });
// Định nghĩa helper number
Handlebars.registerHelper('number',function(value){
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
        return value; // Trả về giá trị ban đầu nếu không phải là số
    } else {
        return numberValue.toLocaleString('en-US'); // Chuyển số thành chuỗi có dấu phẩy
    }
})
// Đĩnh nghĩa helper ifEquals
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

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

//route
//[GET] home
app.get('/', (req, res) => {
    res.render('pages/home', { title: 'Trang Chủ' });
});
//[GET] user
app.use('/english-course', user);
//[GET] admin
app.use('/english-course-manager', checkToken,admin);
//[GET] course
app.use('/english-course-manager/managementcourse',checkToken,course);



app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
});
