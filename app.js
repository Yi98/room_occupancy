const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

const dashboardApi = require('./server/api/dashboard');
const userApi = require('./server/api/user');
const chartApi = require('./server/api/chart');
const reportApi = require('./server/api/report');

const port = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/dashboard', dashboardApi);
app.use('/api/user', userApi);
app.use('/api/chart', chartApi);
app.use('/api/report', reportApi);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
})


app.listen((process.env.PORT || port), _ => {
  console.log('Server running on ' + port);
});