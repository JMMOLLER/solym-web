require('dotenv').config({ path: './.env' });
const { args } = require('./Resources/yargs');
const express = require('express');
const cookieParser = require('cookie-parser');
const { engine } = require("express-handlebars");
const app = express();
const port = args.port || 8080;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts'
}));


app.use('/', require('./routers/USER'));
app.use('/api/', require('./routers/API'));

app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);
});