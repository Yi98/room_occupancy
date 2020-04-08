const mongoose = require('mongoose');
const dotenv = require('dotenv');

const People = require('../models/People');
const Humidity = require('../models/Humidity');
const Temperature = require('../models/Temperature');
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


/*
Room ID's reference
24 hours study area: 	5db03ec62040a70a38244de1
FYP Room A: 					5db043344a270c2b48ee776a
FYP Test:							5db583ed1c9d4400009a20f2
Leisure Area: 				5d8f019f1c9d44000090f440
BYOD: 								5d935b95ea295d622c1f7e7d
*/
const roomIds = [
	'5db03ec62040a70a38244de1',
	'5db043344a270c2b48ee776a',
	'5db583ed1c9d4400009a20f2',
	'5d8f019f1c9d44000090f440',
	'5d935b95ea295d622c1f7e7d'
];

const seedRoomPeopleData = (roomId) => {
	let peoplePromises = [];

	let fetchedRoom;

	Room.findById(roomId)
		.then(room => {
			if (!room) {
				return console.log('Room not found');
			}

			fetchedRoom = room;

			for (let k = 1; k <= 12; k++) {
				let daysInMonth;
				if (k == 1 || k == 3 || k == 5 || k == 7 || k == 8 || k == 10 || k == 12) {
					daysInMonth = 31;
				}
				else if (k == 2) {
					daysInMonth = 29;
				}
				else {
					daysInMonth = 30;
				}
				for (let i = 1; i <= daysInMonth; i++) {  // a month (30 days)
					for (let j = 0; j < 24; j++) {  // a day (24 hours)
						if (j == 20) { // simulate high peak hour on 8pm
							min = 40;
							max = 50;
						}
						else if (j == 8 || j == 14) { // simulate small peak hours on 8am and 2pm
							min = 30;
							max = 40;
						}
						else { // simulate other time period
							min = 5;
							max = 20;
						}

						time = new Date(2020, k, i, j, 00);
						data = Math.floor(Math.random() * (max - min + 1) + min);

						const currentPeople = new People({ time, data });

						peoplePromises.push(currentPeople.save());
					}
				}
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
					console.log('Seeding people data completed');
				})
				.catch(err => {
					console.log(err);
				})
		})
		.catch(err => {
			console.log(err);
		})
};


const seedRoomTemperatureData = (roomId) => {
	let tempPromises = [];
	let fetchedRoom;

	Room.findById(roomId)
		.then(room => {
			if (!room) {
				return console.log('Room not found');
			}

			fetchedRoom = room;

			for (let k = 1; k <= 12; k++) {
				let daysInMonth;
				if (k == 1 || k == 3 || k == 5 || k == 7 || k == 8 || k == 10 || k == 12) {
					daysInMonth = 31;
				}
				else if (k == 2) {
					daysInMonth = 29;
				}
				else {
					daysInMonth = 30;
				}
				for (let i = 1; i <= daysInMonth; i++) {  // a month (30 days)
					for (let j = 0; j < 24; j++) {  // a day (24 hours)

						time = new Date(2020, k, i, j, 00);

						// create temperature data
						min = 2000; // min = 20, 2000 is used to generate 2dp number
						max = 3000; // max = 30, 3000 is used to generate 2dp number
						data = Math.floor(Math.random() * (max - min + 1) + min) / 100;
						const currentTemp = new Temperature({ data, time });

						tempPromises.push(currentTemp.save());
					}
				}
			}

			Promise.all(tempPromises)
				.then(results => {
					console.log(results);
					for (let i = 0; i < results.length; i++) {
						fetchedRoom.temperature.push(results[i]);
					}

					return fetchedRoom.save();
				})
				.then(room => {
					console.log('Seeding temperature data completed');
				})
				.catch(err => {
					console.log(err);
				})
		})
		.catch(err => {
			console.log(err);
		})
};


const seedRoomHumidityData = (roomId) => {
	let humidPromises = [];
	let fetchedRoom;

	Room.findById(roomId)
		.then(room => {
			if (!room) {
				return console.log('Room not found');
			}

			fetchedRoom = room;

			for (let k = 1; k <= 12; k++) {
				let daysInMonth;
				if (k == 1 || k == 3 || k == 5 || k == 7 || k == 8 || k == 10 || k == 12) {
					daysInMonth = 31;
				}
				else if (k == 2) {
					daysInMonth = 29;
				}
				else {
					daysInMonth = 30;
				}
				for (let i = 1; i <= daysInMonth; i++) {  // a month (30 days)
					for (let j = 0; j < 24; j++) {  // a day (24 hours)

						time = new Date(2020, k, i, j, 00);

						// create humidity data
						min = 5000; // min = 50, 5000 is used to generate 2dp number
						max = 7000; // max = 70, 7000 is used to generate 2dp number
						data = Math.floor(Math.random() * (max - min + 1) + min) / 100;
						const currentHumid = new Humidity({ data, time });

						humidPromises.push(currentHumid.save());
					}
				}
			}

			Promise.all(humidPromises)
				.then(results => {
					console.log(results);
					for (let i = 0; i < results.length; i++) {
						fetchedRoom.humidity.push(results[i]);
					}

					return fetchedRoom.save();
				})
				.then(room => {
					console.log('Seeding humidity data completed');
				})
				.catch(err => {
					console.log(err);
				})
		})
		.catch(err => {
			console.log(err);
		})
};

const seedRoomAllDate = (roomId) => {
	seedRoomPeopleData(roomId);
	seedRoomTemperatureData(roomId);
	seedRoomHumidityData(roomId);
};


const deleteRoomData = (roomId, category = 'all') => {
	Room.findById(roomId)
		.then(room => {
			if (category == 'people') {
				room.people = [];
			}
			else if (category == 'temperature') {
				room.temperature = [];
			}
			else if (category == 'humiditiy') {
				room.humidity = [];
			}
			else if (category == 'all') {
				room.people = [];
				room.temperature = [];
				room.humidity = [];
			}

			return room.save();
		})
		.then(room => {
			console.log(`Successfully delete ${category} data of ${room.name}`);
		})
		.catch(err => {
			console.log(err);
		})
};

const deleteCollectionData = (collectionName) => {
	if (collectionName == 'people') {
		db.collections.people.deleteMany({});
	}
	else if (collectionName == 'temperature') {
		db.collections.temperature.deleteMany({});
	}
	else if (collectionName == 'humidity') {
		db.collections.humidity.deleteMany({});
	}
	else if (collectionName == 'all') {
		db.collections.people.deleteMany({});
		db.collections.temperature.deleteMany({});
		db.collections.humidity.deleteMany({});
	}
};

/*
Seeding operations
*/
// seedRoomPeopleData('5db03ec62040a70a38244de1');
// seedRoomTemperatureData('5db03ec62040a70a38244de1');
// seedRoomHumidityData('5db03ec62040a70a38244de1');
// seedRoomAllDate('5db03ec62040a70a38244de1');


/*
Delete operations
*/
// deleteRoomData('5db03ec62040a70a38244de1', 'all');
// deleteCollectionData('all');

