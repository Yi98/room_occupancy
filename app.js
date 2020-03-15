const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const routes = require('./server/routes/route');
const roomApi = require('./server/api/room');
const userApi = require('./server/api/user');
const dataApi = require('./server/api/data');
const dataController = require('./server/controller/data');
const forecastController = require('./server/controller/forecast');
const port = 3000;

dotenv.config({ path: 'env' });

mongoose.connect(process.env.DB_CRIDENTIALS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.Promise = global.Promise;

dataController.sensorSocket(io);
forecastController.connectSocket(io);

app.use(cors());
app.use(session({
  secret: 'fyp room occupancy',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/rooms', roomApi);
app.use('/api/data', dataApi);
app.use('/api/users', userApi);
app.use('/', routes);


server.listen((process.env.PORT || port), _ => {
  console.log('Server running on ' + port);
});