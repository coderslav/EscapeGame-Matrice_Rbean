const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const util = require('util');

const { hbsHelpers } = require('./helpers/views');
const { getSessionUser } = require('./helpers/auth');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const db = require('./models');

const app = express();

// Set up view engine
const hbs = exphbs.create({
    extname: '.hbs',
    helpers: hbsHelpers,
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Specify from which directory to serve static files
app.use(express.static('public'));

// Register middlewares
app.use(bodyParser.urlencoded({ extended: true })); // parse POST data
app.use(bodyParser.json());
app.use(cookieParser('secret'));
app.use(getSessionUser);

// Register routes
app.use('/', indexRouter);
app.use('/', authRouter);

app.listen(process.env.PORT || 3000);
