require('dotenv').config({ path: './.env' });
const { args } = require('./Resources/yargs');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { engine } = require("express-handlebars");
const app = express();
const address = args.address;
const PORT = args.port;

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


app.use('/api/', require('./routers/API'));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..') + '/client/build/index.html');
});

app.listen(PORT, address, () => {
  console.log(`Application listening at http://${address}:${PORT}`);
});