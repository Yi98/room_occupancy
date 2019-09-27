const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const dashboardApi = require('./server/api/dashboard');
const userApi = require('./server/api/user');
const chartApi = require('./server/api/chart');
const reportApi = require('./server/api/report');
const port = 3000;

mongoose.connect('mongodb+srv://user1:pass1word@roomoccupancy-qayg2.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'RoomOccupancy'
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.Promise = global.Promise;

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