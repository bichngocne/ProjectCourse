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
const bodyparser = require('body-parser');
const { user } = require('./routes/index.js');
const { engine } = require('express-handlebars');
const checkToken = require('./middlewares/authentication.js');
// GET port
const port = process.env.PORT || 3000;

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

app.get('/', (req, res) => {
    res.render('pages/home', { title: 'Trang Chủ' });
});
app.get('/admin', (req, res) => {
    res.render('pages/adminpotal', { title: 'Trang Chủ Admin' });
});
//views engine
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', 'src/views');

//route
app.use(checkToken);
app.use('/user', user);

app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
});
