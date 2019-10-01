const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();

const routes = require('./server/routes/route');
const roomApi = require('./server/api/room');
const userApi = require('./server/api/user');
const dataApi = require('./server/api/data');
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
app.use(session({
  secret: 'fyp room occupancy',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/room', roomApi);
app.use('/api/data', dataApi);
app.use('/api/user', userApi);
app.use('/', routes);

app.listen((process.env.PORT || port), _ => {
  console.log('Server running on ' + port);
});