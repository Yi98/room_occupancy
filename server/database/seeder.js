const mongoose = require('mongoose');
const dotenv = require('dotenv');
const date = require('date-and-time');

const People = require('../models/People');
const Room = require('../models/Room');

dotenv.config({ path: '../../.env' });

mongoose.connect(process.env.DB_CRIDENTIALS, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	dbName: process.env.DB_NAME
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.Promise = global.Promise;


const seedPeopleData = (roomId) => {
	let peoplePromises = [];
	let fetchedRoom;

	Room.findById(roomId)
		.then(room => {
			if (!room) {
				return console.log('Room not found');
			}

			fetchedRoom = room;

			for (let j = 0; j < 24; j++) {  // a day (hour)
				// simulate peak hour on 8pm everyday
				if (j == 20) {
					min = 40;
					max = 50;
				}
				else if (j == 8 || j == 14) {
					min = 30;
					max = 40;
				}
				else {
					min = 5;
					max = 20;
				}

				time = new Date(2020, 3, 3, j);
				data = Math.floor(Math.random() * (max - min + 1) + min);

				const currentPeople = new People({ time, data });

				peoplePromises.push(currentPeople.save());
			}


			Promise.all(peoplePromises)
				.then(results => {
					console.log(results);
					for (let i = 0; i < results.length; i++) {
						fetchedRoom.people.push(results[i]);
					}

					return fetchedRoom.save();
				})
				.then(room => {
					console.log(room);
					console.log('done');
				})
				.catch(err => {
					console.log(err);
				})
		})
		.catch(err => {
			console.log(err);
		})
}


const deletePeopleData = () => {
	Room.findById('5db03ec62040a70a38244de1')
		.then(room => {
			room.people = [];
			return room.save();
		})
		.then(room => {
			console.log('Successfully delete all people data');
		})
		.catch(err => {
			console.log(err);
		})
}


seedPeopleData('5db03ec62040a70a38244de1');
// deletePeopleData();