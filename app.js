const express = require('express');
const path = require('path');
const app = express();

const api = require('./server/api/api');

const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use('/', api);


app.listen((process.env.PORT || port), _ => {
  console.log('Server running on ' + port);
});