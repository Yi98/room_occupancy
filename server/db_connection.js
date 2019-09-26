const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://user1:pass1word@roomoccupancy-qayg2.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = client;