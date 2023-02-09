require('dotenv').config({ path: './.env' });
const { args } = require('./Resources/yargs');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { engine } = require("express-handlebars");
const app = express();
const port = args.port || 8080;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..') + '/client/build'));
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '..') + '/views/layouts'
}));


app.use('/let', require('./routers/USER'));
app.use('/api/', require('./routers/API'));
app.use('/users', (req, res) => {
    const users = require('./users.json');
    res.send(users);
});
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..') + '/client/build/index.html');
});

app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);
});