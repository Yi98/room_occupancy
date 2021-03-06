const domain = 'http://localhost:3000';
// const domain = 'http://192.168.99.100:3000';
// const domain = 'https://roomoccupancy.herokuapp.com'; 

var reportTable = $('#reportTable').DataTable({
	dom: 'Bfrtip',
	buttons: [
		{
			extend: 'pdfHtml5',
			download: 'open',
			alignment: 'center',
			text: 'Export PDF',
			customize: function (doc) {
				let room_name = document.getElementById("room_name").innerHTML;
				let date_range = document.getElementById("choosenRange").innerHTML;
				let time_range = document.getElementById("choosenTimeRange").innerHTML;

				let peopleChart, temperatureChart, humidityChart;
				let charts = Highcharts.charts; // Obtain all the Highcharts objects

				// Loop through the Highcharts object array and make assignment according to the their respective renderTo.id
				for (let i = 0; i < charts.length; i++) {
					if (charts[i].renderTo.id == "peopleChart") {
						peopleChart = charts[i].getSVG();
					}

					if (charts[i].renderTo.id == "temperatureChart") {
						temperatureChart = charts[i].getSVG();
					}

					if (charts[i].renderTo.id == "humidityChart") {
						humidityChart = charts[i].getSVG();
					}
				}

				var days = sessionStorage.getItem("checkDay");

				var date;

				var high_ppl_data, low_ppl_data, high_ppl_date, low_temp_date, high_temp_data, low_temp_data, high_temp_date, low_temp_date, high_humid_data, low_humid_data, high_humid_date, low_humid_date, date;


				if (days === '0') {
					date = "Hour";

					high_ppl_data = sessionStorage.getItem("todayPeopleHighestData");
					high_ppl_date = sessionStorage.getItem("todayPeopleHighestDate");
					high_temp_data = sessionStorage.getItem("todayTempHighestData");
					high_temp_date = sessionStorage.getItem("todayTempHighestDate");
					high_humid_data = sessionStorage.getItem("todayHumidHighestData");
					high_humid_date = sessionStorage.getItem("todayHumidHighestDate");
					low_ppl_data = sessionStorage.getItem("todayPeopleLowestData");
					low_ppl_date = sessionStorage.getItem("todayPeopleLowestDate");
					low_temp_data = sessionStorage.getItem("todayTempLowestData");
					low_temp_date = sessionStorage.getItem("todayTempLowestDate");
					low_humid_data = sessionStorage.getItem("todayHumidLowestData");
					low_humid_date = sessionStorage.getItem("todayHumidLowestDate");
				}
				else if (days === '1') {
					date = "Day";

					high_ppl_data = sessionStorage.getItem("dailyPeopleHighestData");
					high_ppl_date = sessionStorage.getItem("dailyPeopleHighestDate");
					high_temp_data = sessionStorage.getItem("dailyTempHighestData");
					high_temp_date = sessionStorage.getItem("dailyTempHighestDate");
					high_humid_data = sessionStorage.getItem("dailyHumidHighestData");
					high_humid_date = sessionStorage.getItem("dailyHumidHighestDate");
					low_ppl_data = sessionStorage.getItem("dailyPeopleLowestData");
					low_ppl_date = sessionStorage.getItem("dailyPeopleLowestDate");
					low_temp_data = sessionStorage.getItem("dailyTempLowestData");
					low_temp_date = sessionStorage.getItem("dailyTempLowestDate");
					low_humid_data = sessionStorage.getItem("dailyHumidLowestData");
					low_humid_date = sessionStorage.getItem("dailyHumidLowestDate");
				}
				else if (days === '2') {
					date = "Week";

					high_ppl_data = sessionStorage.getItem("weeklyPeopleHighestData");
					high_ppl_date = sessionStorage.getItem("weeklyPeopleHighestDate");
					high_temp_data = sessionStorage.getItem("weeklyTempHighestData");
					high_temp_date = sessionStorage.getItem("weeklyTempHighestDate");
					high_humid_data = sessionStorage.getItem("weeklyHumidHighestData");
					high_humid_date = sessionStorage.getItem("weeklyHumidHighestDate");
					low_ppl_data = sessionStorage.getItem("weeklyPeopleLowestData");
					low_ppl_date = sessionStorage.getItem("weeklyPeopleLowestDate");
					low_temp_data = sessionStorage.getItem("weeklyTempLowestData");
					low_temp_date = sessionStorage.getItem("weeklyTempLowestDate");
					low_humid_data = sessionStorage.getItem("weeklyHumidLowestData");
					low_humid_date = sessionStorage.getItem("weeklyHumidLowestDate");
				}
				else if (days === '3') {
					date = "Month";

					high_ppl_data = sessionStorage.getItem("monthlyPeopleHighestData");
					high_ppl_date = sessionStorage.getItem("monthlyPeopleHighestDate");
					high_temp_data = sessionStorage.getItem("monthlyTempHighestData");
					high_temp_date = sessionStorage.getItem("monthlyTempHighestDate");
					high_humid_data = sessionStorage.getItem("monthlyHumidHighestData");
					high_humid_date = sessionStorage.getItem("monthlyHumidHighestDate");
					low_ppl_data = sessionStorage.getItem("monthlyPeopleLowestData");
					low_ppl_date = sessionStorage.getItem("monthlyPeopleLowestDate");
					low_temp_data = sessionStorage.getItem("monthlyTempLowestData");
					low_temp_date = sessionStorage.getItem("monthlyTempLowestDate");
					low_humid_data = sessionStorage.getItem("monthlyHumidLowestData");
					low_humid_date = sessionStorage.getItem("monthlyHumidLowestDate");
				}

				doc.info = {
					title: room_name + ' Report ' + '(' + date_range + ')'
				}

				doc.content[0] = {
					text: 'Report on ' + room_name,
					alignment: 'center',
					fontSize: 14,
					width: '*',
					margin: [0, 10]
				}

				doc.content[1] = {
					text: 'Date: ' + date_range,
					alignment: 'center',
					fontSize: 14,
					width: '*',
					margin: [0, 10]
				}

				doc.content[2] = {
					text: 'Time: ' + time_range,
					alignment: 'center',
					fontSize: 14,
					width: '*',
					margin: [0, 10]
				}

				doc.content[3] = {
					text: 'Insights',
					alignment: 'center',
					fontSize: 14,
					bold: true,
					width: '*',
					margin: [0, 10]
				}

				doc.content[4] = {
					canvas: [{ type: 'line', x1: 0, y1: 2, x2: 510, y2: 2, lineWidth: 1 }]
				}

				doc.content[5] = {
					text: 'Table of People',
					alignment: 'center',
					fontSize: 14,
					width: '*',
					margin: [0, 30, 0, 10]
				}

				doc.content[6] = {
					table: {
						widths: [100, '*', '*'],
						body: [
							[
								{},
								{ text: date, alignment: 'center', fontSize: 12 },
								{ text: 'Number of People', alignment: 'center', fontSize: 12 }
							],
							[
								{ text: 'Highest', alignment: 'center', fontSize: 12 },
								{ text: high_ppl_date, alignment: 'center', fontSize: 12 },
								{ text: high_ppl_data, alignment: 'center', fontSize: 12 }
							],
							[
								{ text: 'Lowest', alignment: 'center', fontSize: 12 },
								{ text: low_ppl_date, alignment: 'center', fontSize: 12 },
								{ text: low_ppl_data, alignment: 'center', fontSize: 12 }
							]
						]
					}
				}

				doc.content[7] = {
					text: 'Table of Temperature',
					alignment: 'center',
					fontSize: 14,
					width: '*',
					margin: [0, 30, 0, 10]
				}

				doc.content[8] = {
					table: {
						widths: [100, '*', '*'],
						body: [
							[
								{},
								{ text: date, alignment: 'center', fontSize: 12 },
								{ text: 'Temperature (°C)', alignment: 'center', fontSize: 12 }
							],
							[
								{ text: 'Highest', alignment: 'center', fontSize: 12 },
								{ text: high_temp_date, alignment: 'center', fontSize: 12 },
								{ text: high_temp_data, alignment: 'center', fontSize: 12 }
							],
							[
								{ text: 'Lowest', alignment: 'center', fontSize: 12 },
								{ text: low_temp_date, alignment: 'center', fontSize: 12 },
								{ text: low_temp_data, alignment: 'center', fontSize: 12 }
							]
						]
					}
				}

				doc.content[9] = {
					text: 'Table of Humidity',
					alignment: 'center',
					fontSize: 14,
					width: '*',
					margin: [0, 30, 0, 10]
				}

				doc.content[10] = {
					table: {
						widths: [100, '*', '*'],
						body: [
							[
								{},
								{ text: date, alignment: 'center', fontSize: 12 },
								{ text: 'Humidity (RH)', alignment: 'center', fontSize: 12 }
							],
							[
								{ text: 'Highest', alignment: 'center', fontSize: 12 },
								{ text: high_humid_date, alignment: 'center', fontSize: 12 },
								{ text: high_humid_data, alignment: 'center', fontSize: 12 }
							],
							[
								{ text: 'Lowest', alignment: 'center', fontSize: 12 },
								{ text: low_humid_date, alignment: 'center', fontSize: 12 },
								{ text: low_humid_data, alignment: 'center', fontSize: 12 }
							]
						]
					},
					pageBreak: 'after'
				}

				doc.content[11] = {
					text: 'Charts',
					alignment: 'center',
					fontSize: 14,
					bold: true,
					width: '*',
					margin: [0, 10]
				}

				doc.content[12] = {
					canvas: [{ type: 'line', x1: 0, y1: 2, x2: 510, y2: 2, lineWidth: 1 }]
				}

				doc.content[13] = {
					svg: peopleChart,
					width: 520,
					height: 300,
					margin: [0, 20]
				}

				doc.content[14] = {
					svg: temperatureChart,
					width: 520,
					height: 300,
					margin: [0, 20]
				}

				doc.content[15] = {
					svg: humidityChart,
					width: 520,
					height: 300,
					margin: [0, 20]
				}

				doc.footer = 
					function (currentPage, pageCount) {
						return [{
							columns: [
								{ text: currentPage.toString() + '/' + pageCount, alignment: 'center', margin: [0,20], fontSize: 10 }
							]
						} ];
					}
			}
		}
	]
});


function generatePDF() {
	reportTable.buttons('0').trigger();
}

var socket = io();

let currentRoom;


socket.on('social', function (data) {
  // Example data: {highRiskCount: "5", lowRiskCount: "3", roomId: "5db043344a270c2b48ee776a"}

  // Tasks: display data to webpage
  let roomCards = document.getElementsByClassName("roomCard");
  let noticeTime = moment().format('MMM DD, h:mm A');

  var noticeMode = document.getElementById("notificationMode").checked;

	for (let i = 0; i < roomCards.length; i++) {
		
		let roomId = roomCards[i].getElementsByClassName("roomId");
		// change 0 to i later
		if (roomId[0].innerHTML == data.roomId) {
			document.getElementsByClassName("highRisk")[i].innerHTML = data.highRiskCount;

			if(noticeMode == false)
			{
				document.getElementsByClassName('high_risk')[i].style.visibility = 'visible';
			}
			else
			{
				document.getElementsByClassName('high_risk')[i].style.visibility = 'hidden';
			}

			document.getElementsByClassName('lastUpdatedTime')[i].innerHTML = noticeTime;
		}
	}
});


socket.on("people", function (msg) {
	// List of room in the room list page
	// let roomList = document.getElementsByClassName("roomRow");

	// for loop assign to all room their respective sensor data
	let roomCards = document.getElementsByClassName("roomCard");
	let noticeTime = moment().format('MMM DD, h:mm A');
	let notify = false;
	let addToNotifications = true;
	let outerRoomId;
	let roomName;
	let roomStatus;
	let notifications;

	for (let i = 0; i < roomCards.length; i++) {
		let roomId = roomCards[i].getElementsByClassName("roomId");
		let maxCapacity = document.getElementsByClassName('maxCapacity');
		let division = (msg.people / parseFloat(maxCapacity[i].innerHTML)) * 50;

		if (roomId[0].innerHTML == msg.roomId) {
			outerRoomId = msg.roomId;

			document.getElementsByClassName("people")[i].innerHTML = msg.people;
			document.getElementsByClassName('lastUpdatedTime')[i].innerHTML = noticeTime;
			roomName = document.getElementsByClassName("roomName")[i].innerHTML;

			// Check this 

			document.getElementsByClassName('status-indicator-outer')[i].style.width = ((parseFloat(maxCapacity[i].innerHTML) - division) / (parseFloat(maxCapacity[i].innerHTML)) * 100) + '%';

			// Room list page
			//document.getElementsByClassName("roomRow")[i].getElementById("editPeopleCountbtn").innerHTML = msg.people;
		}
	}


	// Push notifications
	if (!localStorage.getItem('notifications')) {
		localStorage.setItem("notifications", JSON.stringify([]));
	}

	var noticeMode = document.getElementById("notificationMode").checked;

	if(noticeMode == false)
	{
		if (msg.previous <= 25 && msg.people > 25) {
			notify = true;
			roomStatus = 'full (COVID-19)';
		}
		else if (msg.previous <= 12 && msg.people > 12) {
			notify = true;
			roomStatus = 'moderate (COVID-19)';
		}
	}
	else {
		if (msg.previous <= 50 && msg.people > 50) {
			notify = true;
			roomStatus = 'full';
		}
		else if (msg.previous <= 25 && msg.people > 25) {
			notify = true;
			roomStatus = 'moderate';
		}
	}

	if (notify) {
		notifications = JSON.parse(localStorage.getItem('notifications'));

		notifications.push({ noticeTime, roomName, roomStatus });

		$('#noticeMain').prepend(`<div class="noticeContainer"><p class="m-0 noticeTime">${noticeTime}</p><p style="font-size:0.9rem;">${roomName} has reached <strong>${roomStatus}</strong> capacity.
				<button onclick="closeNoticeRow(this)" type="button" class="close closeBtn mr-3" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</p></div>`);

		document.getElementById('emptyNotice').style.display = "none";

		const noticeNum = document.getElementById('noticeNum');
		noticeNum.innerHTML = Number(noticeNum.innerHTML) + 1;
		noticeNum.style.display = "inline";

		localStorage.setItem('notifications', JSON.stringify(notifications));
	}

	if (currentRoom == roomName) {
		onUpdateTrend(outerRoomId, roomName);
	}
});


socket.on("sensor", function (msg) {
	// for loop assign to all room their respective sensor data
	//let roomCards = document.getElementsByClassName("room-card");
	let roomCards = document.getElementsByClassName("roomCard");
	let noticeTime = moment().format('MMM DD, h:mm A');
	let outerRoomId;
	let roomName;

	for (let i = 0; i < roomCards.length; i++) {
		//let roomId = roomCards[i].getElementsByClassName("room-id");
		let roomId = roomCards[i].getElementsByClassName("roomId");
		// change 0 to i later
		if (roomId[0].innerHTML == msg.roomId) {
			outerRoomId = msg.roomId;
			document.getElementsByClassName("temperature")[i].innerHTML = msg.temperature;
			document.getElementsByClassName("humidity")[i].innerHTML = msg.humidity;
			document.getElementsByClassName('lastUpdatedTime')[i].innerHTML = noticeTime;
			roomName = document.getElementsByClassName("roomName")[i].innerHTML;
		}
	}

	if (currentRoom == roomName) {
		onUpdateTrend(outerRoomId, roomName);
	}
});

function searchRoom() {
	var input, filter, ul, li, i, a, txtValue;
	input = document.getElementById("search");
	filter = input.value.toUpperCase();

	const roomCards = document.getElementsByClassName('roomCard');
	let available = 0;

	for (i = 0; i < roomCards.length; i++) {
		a = roomCards[i].getElementsByTagName("h4")[0];
		txtValue = a.textContent || a.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			roomCards[i].style.display = "";
			available++;
		} else {
			roomCards[i].style.display = "none";
		}
	}

	if (available == 0) {
		document.getElementById('noRoomCard').style.display = "block";
	}
	else {
		document.getElementById('noRoomCard').style.display = "none";
	}
}


function showChart() {
	var url_string = window.location.href;
	var url = new URL(url_string);
	var pathname = url.pathname;
	var split = pathname.split("/");
	var roomId = split[2];
	let charts = Highcharts.charts;
	xhrChart(roomId);
	var target = document.querySelector('#choosenRange');
	var observer = new MutationObserver(function (mutations) {

		mutations.forEach(function (mutation) {
			charts.splice(0, charts.length);
			document.getElementById("allChart").innerHTML = '<div class="d-flex h-100 justify-content-center"><div class="align-self-center"><div class="spinner-border text-danger" style="width:3rem; height:3rem;"><span class="sr-only">Loading...</span></div></div></div>';
			xhrChart(roomId);
			charts.splice(0, charts.length);
		});
	});

	var target2 = document.querySelector('#choosenTimeRange');
	var observer2 = new MutationObserver(function (mutations2) {
		mutations2.forEach(function (mutation) {
			charts.splice(0, charts.length);
			document.getElementById("allChart").innerHTML = '<div class="d-flex h-100 justify-content-center"><div class="align-self-center"><div class="spinner-border text-danger" style="width:3rem; height:3rem;"><span class="sr-only">Loading...</span></div></div></div>';
			xhrChart(roomId);
			charts.splice(0, charts.length);
		});
	});

	var config = {
		attributes: true,
		childList: true,
		characterData: true
	};

	observer.observe(target, config);
	observer2.observe(target2, config);
	// otherwise
	observer.disconnect();
	observer.observe(target, config);
}

function xhrChart(roomId) {
	var dateRange = document.getElementById("choosenRange").innerHTML.toString();
	var m_startDate = moment(dateRange.substring(0, 10), 'MM-DD-YYYY');
	var m_endDate = moment(dateRange.substring(13, 23), 'MM-DD-YYYY');
	var custom = true;

	//Get the date for today
	var today = moment();

	//Check if its today choice. **This codes run when user choose today.	
	if (today.format("L") == m_startDate.format("L") && today.format("L") == m_endDate.format("L")) {
		showTodayTrends(roomId);
		custom = false;
	}

	//Get the date for yesterday 
	var sub_today = moment();
	var yesterday = sub_today.subtract(1, 'days');

	//Check if its yesterday choice. **This codes run when user choose yesterday.
	if (yesterday.format("L") == m_startDate.format("L") && yesterday.format("L") == m_endDate.format("L")) {
		showYesterdayTrends(roomId);
		custom = false;
	}

	//Get the date for last 7 days
	var sub_today = moment();
	var last_7_days = sub_today.subtract(6, 'days');
	//Check if its last 7 days choice. **This codes run when user choose last 7 days.
	if (last_7_days.format("L") == m_startDate.format("L") && today.format("L") == m_endDate.format("L")) {
		showWeeklyTrends(roomId);
		custom = false;
	}

	//Get the date for last 30 days
	var sub_today = moment();
	var last_30_days = sub_today.subtract(29, 'days');

	//Check if its last 30 days choice. **This codes run when user choose last 30 days.
	if (last_30_days.format("L") == m_startDate.format("L") && today.format("L") == m_endDate.format("L")) {
		showMonthlyTrends(roomId);
		custom = false;
	}

	//Get the date for last year
	var sub_today = moment();
	var last_365_days = sub_today.subtract(364, 'days');

	//Check if its last year choice. **This codes run when user choose last year.
	if (last_365_days.format("L") == m_startDate.format("L") && today.format("L") == m_endDate.format("L")) {
		showYearlyTrends(roomId);
		custom = false;
	}

	if (custom == true) {
		showCustomTrends(roomId);
	}
}

function insert_data_pdf(x, day, peopleData, tempData, humidData, hourTime) {
	checkDay = x;
	sessionStorage.setItem("checkDay", checkDay);

	high_ppl_data = Math.max.apply(Math, (peopleData.filter(v => !isNaN(v))));

	if (high_ppl_data == "-Infinity") {
		sessionStorage.setItem(day + "PeopleHighestData", "N/A");
		sessionStorage.setItem(day + "PeopleHighestDate", "N/A");
	} else {
		sessionStorage.setItem(day + "PeopleHighestData", high_ppl_data);
		high_ppl_index = peopleData.indexOf(high_ppl_data);
		high_ppl_date = hourTime[high_ppl_index];
		sessionStorage.setItem(day + "PeopleHighestDate", high_ppl_date);
	}

	low_ppl_data = Math.min.apply(Math, (peopleData.filter(v => !isNaN(v))));

	if (low_ppl_data == "Infinity") {
		sessionStorage.setItem(day + "PeopleLowestData", "N/A");
		sessionStorage.setItem(day + "PeopleLowestDate", "N/A");
	} else {
		sessionStorage.setItem(day + "PeopleLowestData", low_ppl_data);
		low_ppl_index = peopleData.indexOf(low_ppl_data);
		lowppldate = hourTime[low_ppl_index];
		sessionStorage.setItem(day + "PeopleLowestDate", lowppldate);
	}

	high_temp_data = Math.max.apply(Math, (tempData.filter(v => !isNaN(v))));

	if (high_temp_data == "-Infinity") {
		sessionStorage.setItem(day + "TempHighestData", "N/A");
		sessionStorage.setItem(day + "TempHighestDate", "N/A");
	} else {
		sessionStorage.setItem(day + "TempHighestData", high_temp_data);
		high_temp_index = tempData.indexOf(high_temp_data);
		high_temp_date = hourTime[high_temp_index];
		sessionStorage.setItem(day + "TempHighestDate", high_temp_date);
	}

	low_temp_data = Math.min.apply(Math, (tempData.filter(v => !isNaN(v))));

	if (low_temp_data == "Infinity") {
		sessionStorage.setItem(day + "TempLowestData", "N/A");
		sessionStorage.setItem(day + "TempLowestDate", "N/A");
	} else {
		sessionStorage.setItem(day + "TempLowestData", low_temp_data);
		low_temp_index = tempData.indexOf(low_temp_data);
		low_temp_date = hourTime[low_temp_index];
		sessionStorage.setItem(day + "TempLowestDate", low_temp_date);
	}

	high_humid_data = Math.max.apply(Math, (humidData.filter(v => !isNaN(v))));

	if (high_humid_data == "-Infinity") {
		sessionStorage.setItem(day + "HumidHighestData", "N/A");
		sessionStorage.setItem(day + "HumidHighestDate", "N/A");
	} else {
		sessionStorage.setItem(day + "HumidHighestData", high_humid_data);
		high_humid_index = humidData.indexOf(high_humid_data);
		high_humid_date = hourTime[high_humid_index];
		sessionStorage.setItem(day + "HumidHighestDate", high_humid_date);
	}

	low_humid_data = Math.min.apply(Math, (humidData.filter(v => !isNaN(v))));

	if (low_humid_data == "Infinity") {
		sessionStorage.setItem(day + "HumidLowestData", "N/A");
		sessionStorage.setItem(day + "HumidLowestDate", "N/A");
	} else {
		sessionStorage.setItem(day + "HumidLowestData", low_humid_data);
		low_humid_index = humidData.indexOf(low_humid_data);
		low_humid_date = hourTime[low_humid_index];
		sessionStorage.setItem(day + "HumidLowestDate", low_humid_date);
	}
}

function showTodayTrends(roomId) {
	var dateRange = document.getElementById("choosenRange").innerHTML.toString();
	var timeRange = document.getElementById("choosenTimeRange").innerHTML.toString();
	var m_startDate = moment(dateRange.substring(0, 10), 'MM-DD-YYYY');
	var m_endDate = moment(dateRange.substring(13, 23), 'MM-DD-YYYY');
	var startTime = timeRange.substring(0, 5);
	var endTime = timeRange.substring(8, 13);
	var diff_in_time = parseInt(endTime.substring(0, 2)) - parseInt(startTime.substring(0, 2));
	var peopleData = []; // people data
	var peopleDataCounter = []; // people data counter
	var tempData = []; // temp data
	var tempDataCounter = []; // temp data counter
	var humidData = []; // humidity data
	var humidDataCounter = []; // humidity data counter
	var hourTime = [];
	var data_ready = false;

	for (var i = 0; i <= diff_in_time; i++) {
		var timeCounter = parseInt(startTime.substring(0, 2)) + i;
		timeCounter = moment(timeCounter, "H HH").format("HH");
		hourTime.push(timeCounter.toString().concat(':00'));
	}

	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.response;
			document.getElementById("room_name").innerHTML = result.room.name;
			console.log(result);
			//Initialise the array
			for (var i = 0; i < hourTime.length; i++) {
				peopleData[i] = 0;
				peopleDataCounter[i] = 0;
				tempData[i] = 0;
				tempDataCounter[i] = 0;
				humidData[i] = 0;
				humidDataCounter[i] = 0;
			}

			//People Chart
			for (var index in result.room.people) {
				var m_dataDate = moment(result.room.people[index].time);
				if (m_startDate.format("D") == m_dataDate.format("D")) {
					for (var i = 0; i < hourTime.length; i++) {
						if (m_dataDate.format("HH").toString().concat(':00') == hourTime[i]) {
							peopleData[i] = peopleData[i] + result.room.people[index].data;
							peopleDataCounter[i]++;
						}
					}
				}
			}

			//Temperature Chart
			for (var index in result.room.temperature) {
				var m_dataDate = moment(result.room.temperature[index].time);
				if (m_startDate.format("D") == m_dataDate.format("D")) {
					for (var i = 0; i < hourTime.length; i++) {
						if (m_dataDate.format("HH").toString().concat(':00') == hourTime[i]) {
							tempData[i] = tempData[i] + result.room.temperature[index].data;
							tempDataCounter[i]++;
						}
					}
				}
			}

			//Humidity Chart
			for (var index in result.room.humidity) {
				var m_dataDate = moment(result.room.humidity[index].time);
				if (m_startDate.format("D") == m_dataDate.format("D")) {
					for (var i = 0; i < hourTime.length; i++) {
						if (m_dataDate.format("HH").toString().concat(':00') == hourTime[i]) {
							humidData[i] = humidData[i] + result.room.humidity[index].data;
							humidDataCounter[i]++;
						}
					}
				}
			}

			//Check whether the chart have data
			for (var i = 0; i < hourTime.length; i++) {
				if (peopleData[i] > 0 || tempData[i] > 0 || humidData[i] > 0) {
					data_ready = true;
				}
			}

			//Get the average for each data in the time
			for (var i = 0; i < hourTime.length; i++) {
				peopleData[i] = Math.round((peopleData[i] / peopleDataCounter[i]));
				tempData[i] = Math.round((tempData[i] / tempDataCounter[i]) * 10) / 10;
				humidData[i] = Math.round((humidData[i] / humidDataCounter[i]) * 10) / 10;
			}

			if (data_ready == true) {
				showAllChart(hourTime, peopleData, tempData, humidData);
				showPeopleChart(hourTime, peopleData); //Illustrate the chart
				showTemperatureChart(hourTime, tempData); //Illustrate the chart
				showHumidityChart(hourTime, humidData); //Illustrate the chart
				document.getElementById("pdfButton").disabled = false;
			} else {
				no_data_to_display();
			}

			insert_data_pdf(0, "today", peopleData, tempData, humidData, hourTime);
		}
	};
	xhr.open("GET", `${domain}/api/rooms/` + roomId + `?period=today`, true);
	xhr.send();
}

function showYesterdayTrends(roomId) {
	var dateRange = document.getElementById("choosenRange").innerHTML.toString();
	var timeRange = document.getElementById("choosenTimeRange").innerHTML.toString();
	var m_startDate = moment(dateRange.substring(0, 10), 'MM-DD-YYYY');
	var m_endDate = moment(dateRange.substring(13, 23), 'MM-DD-YYYY');
	var startTime = timeRange.substring(0, 5);
	var endTime = timeRange.substring(8, 13);
	var diff_in_time = parseInt(endTime.substring(0, 2)) - parseInt(startTime.substring(0, 2));
	var peopleData = []; // people data
	var peopleDataCounter = []; // people data counter
	var tempData = []; // temp data
	var tempDataCounter = []; // temp data counter
	var humidData = []; // humidity data
	var humidDataCounter = []; // humidity data counter
	var hourTime = [];
	var data_ready = false;

	for (var i = 0; i <= diff_in_time; i++) {
		var timeCounter = parseInt(startTime.substring(0, 2)) + i;
		timeCounter = moment(timeCounter, "H HH").format("HH");
		hourTime.push(timeCounter.toString().concat(':00'));
	}

	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.response;
			document.getElementById("room_name").innerHTML = result.room.name;

			//Initialise the array
			for (var i = 0; i < hourTime.length; i++) {
				peopleData[i] = 0;
				peopleDataCounter[i] = 0;
				tempData[i] = 0;
				tempDataCounter[i] = 0;
				humidData[i] = 0;
				humidDataCounter[i] = 0;
			}

			//People Chart
			for (var index in result.room.people) {
				var m_dataDate = moment(result.room.people[index].time);
				if (m_startDate.format("L") == m_dataDate.format("L")) {
					for (var i = 0; i < hourTime.length; i++) {
						if (m_dataDate.format("HH").toString().concat(':00') == hourTime[i]) {
							peopleData[i] = peopleData[i] + result.room.people[index].data;
							peopleDataCounter[i]++;
						}
					}
				}
			}

			//Temperature Chart
			for (var index in result.room.temperature) {
				var m_dataDate = moment(result.room.temperature[index].time);
				if (m_startDate.format("L") == m_dataDate.format("L")) {
					for (var i = 0; i < hourTime.length; i++) {
						if (m_dataDate.format("HH").toString().concat(':00') == hourTime[i]) {
							tempData[i] = tempData[i] + result.room.temperature[index].data;
							tempDataCounter[i]++;
						}
					}
				}
			}

			//Humidity Chart
			for (var index in result.room.humidity) {
				var m_dataDate = moment(result.room.humidity[index].time);
				if (m_startDate.format("L") == m_dataDate.format("L")) {
					for (var i = 0; i < hourTime.length; i++) {
						if (m_dataDate.format("HH").toString().concat(':00') == hourTime[i]) {
							humidData[i] = humidData[i] + result.room.humidity[index].data;
							humidDataCounter[i]++;
						}
					}
				}
			}

			//Check whether the chart have data
			for (var i = 0; i < hourTime.length; i++) {
				if (peopleData[i] > 0 || tempData[i] > 0 || humidData[i] > 0) {
					data_ready = true;
				}
			}

			//Get the average for each data in the time
			for (var i = 0; i < peopleData.length; i++) {
				peopleData[i] = Math.round((peopleData[i] / peopleDataCounter[i]));
			}

			for (var i = 0; i < tempData.length; i++) {
				tempData[i] = Math.round((tempData[i] / tempDataCounter[i]) * 10) / 10;
			}

			for (var i = 0; i < humidData.length; i++) {
				humidData[i] = Math.round((humidData[i] / humidDataCounter[i]) * 10) / 10;
			}

			if (data_ready == true) {
				showAllChart(hourTime, peopleData, tempData, humidData);
				showPeopleChart(hourTime, peopleData); //Illustrate the chart
				showTemperatureChart(hourTime, tempData); //Illustrate the chart
				showHumidityChart(hourTime, humidData); //Illustrate the chart
				document.getElementById("pdfButton").disabled = false;
			} else {
				no_data_to_display();
			}

			insert_data_pdf(0, "today", peopleData, tempData, humidData, hourTime);
		}
	};
	xhr.open("GET", `${domain}/api/rooms/` + roomId + `?period=yesterday`, true);
	xhr.send();
}

function showWeeklyTrends(roomId) {
	var dateRange = document.getElementById("choosenRange").innerHTML.toString();
	var timeRange = document.getElementById("choosenTimeRange").innerHTML.toString();
	var startDate = new Date(dateRange.substring(0, 10));
	var endDate = new Date(dateRange.substring(13, 23));
	var m_startDate = moment(dateRange.substring(0, 10), 'MM-DD-YYYY');
	var m_endDate = moment(dateRange.substring(13, 23), 'MM-DD-YYYY');
	var m_diff_in_days = m_endDate.diff(m_startDate, 'days');
	var startTime = timeRange.substring(0, 5);
	var endTime = timeRange.substring(8, 13);
	var diff_in_time = parseInt(endTime.substring(0, 2)) - parseInt(startTime.substring(0, 2));
	var peopleData = []; // people data
	var peopleDataCounter = []; // people data counter
	var tempData = []; // temp data
	var tempDataCounter = []; // temp data counter
	var humidData = []; // humidity data
	var humidDataCounter = []; // humidity data counter
	var tempDailyTime = [];
	var dailyTime = []; // var dailyTime = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var data_ready = false;
	var d_startDate = m_startDate;


	//Initialise the dailyTime array
	for (var i = 0; m_endDate.isSameOrAfter(d_startDate); i++) {
		tempDailyTime[i] = d_startDate.format("D");
		dailyTime[i] = d_startDate.format("dddd, M/D");
		d_startDate.add(1, 'day');
	}

	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.response;
			console.log(result);
			document.getElementById("room_name").innerHTML = result.room.name;

			//Initialise the data array
			for (var i = 0; i < dailyTime.length; i++) {
				peopleData[i] = 0;
				peopleDataCounter[i] = 0;
				tempData[i] = 0;
				tempDataCounter[i] = 0;
				humidData[i] = 0;
				humidDataCounter[i] = 0;
			}

			//People Chart
			for (var index in result.room.people) {
				var m_dataDate = moment(result.room.people[index].time);
				if (m_dataDate.hours() >= parseInt(startTime.substring(0, 2)) && m_dataDate.hours() <= parseInt(endTime.substring(0, 2))) {
					for (var i = 0; i < dailyTime.length; i++) {
						if (m_dataDate.format("D") == tempDailyTime[i]) {
							peopleData[i] = peopleData[i] + result.room.people[index].data;
							peopleDataCounter[i]++;
						}
					}
				}
			}

			//Temperature Chart
			for (var index in result.room.temperature) {
				var m_dataDate = moment(result.room.temperature[index].time);
				if (m_dataDate.hours() >= parseInt(startTime.substring(0, 2)) && m_dataDate.hours() <= parseInt(endTime.substring(0, 2))) {
					for (var i = 0; i < dailyTime.length; i++) {
						if (m_dataDate.format("D") == tempDailyTime[i]) {
							tempData[i] = tempData[i] + result.room.temperature[index].data;
							tempDataCounter[i]++;
						}
					}
				}
			}

			//Humidity Chart
			for (var index in result.room.humidity) {
				var m_dataDate = moment(result.room.humidity[index].time);
				if (m_dataDate.hours() >= parseInt(startTime.substring(0, 2)) && m_dataDate.hours() <= parseInt(endTime.substring(0, 2))) {
					for (var i = 0; i < dailyTime.length; i++) {
						if (m_dataDate.format("D") == tempDailyTime[i]) {
							humidData[i] = humidData[i] + result.room.humidity[index].data;
							humidDataCounter[i]++;
						}
					}
				}
			}

			//Check whether the chart have data
			for (var i = 0; i < dailyTime.length; i++) {
				if (peopleData[i] > 0 || tempData[i] > 0 || humidData[i] > 0) {
					data_ready = true;
				}
			}

			//Get the average for each data in the time
			for (var i = 0; i < peopleData.length; i++) {
				peopleData[i] = Math.round((peopleData[i] / peopleDataCounter[i]));
			}

			for (var i = 0; i < tempData.length; i++) {
				tempData[i] = Math.round((tempData[i] / tempDataCounter[i]) * 10) / 10;
			}

			for (var i = 0; i < humidData.length; i++) {
				humidData[i] = Math.round((humidData[i] / humidDataCounter[i]) * 10) / 10;
			}

			if (data_ready == true) {
				showAllChart(dailyTime, peopleData, tempData, humidData);
				showPeopleChart(dailyTime, peopleData); //Illustrate the chart
				showTemperatureChart(dailyTime, tempData); //Illustrate the chart
				showHumidityChart(dailyTime, humidData); //Illustrate the chart
				document.getElementById("pdfButton").disabled = false;
			} else {
				no_data_to_display();
			}

			insert_data_pdf(1, "daily", peopleData, tempData, humidData, dailyTime);
		}
	};
	xhr.open("GET", `${domain}/api/rooms/` + roomId + `?period=weekly`, true);
	xhr.send();
}

function showMonthlyTrends(roomId) {
	var dateRange = document.getElementById("choosenRange").innerHTML.toString();
	var timeRange = document.getElementById("choosenTimeRange").innerHTML.toString();
	var startDate = new Date(dateRange.substring(0, 10));
	var endDate = new Date(dateRange.substring(13, 23));
	var tempStart = moment(startDate).format('MM-DD-YYYY');
	var tempStart2 = moment(startDate).format('MM-DD-YYYY');
	var m_startDate = moment(dateRange.substring(0, 10), 'MM-DD-YYYY');
	var m_endDate = moment(dateRange.substring(13, 23), 'MM-DD-YYYY');
	var diff_in_days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
	var startTime = timeRange.substring(0, 5);
	var endTime = timeRange.substring(8, 13);
	var diff_in_time = parseInt(endTime.substring(0, 2)) - parseInt(startTime.substring(0, 2));
	var peopleData = []; // people data
	var peopleDataCounter = []; // people data counter
	var tempData = []; // temp data
	var tempDataCounter = []; // temp data counter
	var humidData = []; // humidity data
	var humidDataCounter = []; // humidity data counter
	var start = startDate.getDate();
	var weeklyTime = [];
	var weeklyTime2 = [];
	var date_check_range = [];
	var data_ready = false;
	var d_startDate = moment(dateRange.substring(0, 10), 'MM-DD-YYYY');
	var d_startDate2 = moment(startDate.setDate(startDate.getDate() - 1));
	var d_week_check = [];
	var d_week_check2 = [];
	var weekStart = new Date(dateRange.substring(0, 10));
	weekStart = moment(weekStart).format("MM-DD-YYYY");

	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.response;
			document.getElementById("room_name").innerHTML = result.room.name;

			//Initialise the weeklyTime array
			tempStart = d_startDate.add(7, 'days').format('MM-DD-YYYY');
			tempStart2 = d_startDate2.add(7, 'days').format('MM-DD-YYYY');

			for (var i = 0; i < 5; i++) {
				if (d_startDate <= m_endDate) {
					weeklyTime[i] = "Week " + (i + 1);
					d_week_check[i] = tempStart;
					d_week_check2[i] = tempStart2;
					tempStart = d_startDate.add(7, 'days').format('MM-DD-YYYY');
					tempStart2 = d_startDate2.add(7, 'days').format('MM-DD-YYYY');
					if (i == 0) {
						weeklyTime[i] += ' [' + weekStart + '/' + d_week_check2[i] + ']';
					} else {
						weeklyTime[i] += ' [' + d_week_check[i - 1] + '/' + d_week_check2[i] + ']';
					}

				} else {
					weeklyTime[i] = "Week " + (i + 1);
					d_week_check[i] = m_endDate.format('MM-DD-YYYY');
					d_week_check2[i] = m_endDate.format('MM-DD-YYYY');
					weeklyTime[i] += ' [' + d_week_check[i - 1] + '/' + d_week_check2[i] + ']';
				}
			}

			//Initialise the array
			for (var i = 0; i < weeklyTime.length; i++) {
				peopleData[i] = 0;
				peopleDataCounter[i] = 0;
				tempData[i] = 0;
				tempDataCounter[i] = 0;
				humidData[i] = 0;
				humidDataCounter[i] = 0;
			}

			//People Chart
			for (var index in result.room.people) {
				var dataDate = new Date(result.room.people[index].time);
				var m_dataDate = moment(result.room.people[index].time);
				if (dataDate.getUTCHours() >= parseInt(startTime.substring(0, 2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0, 2))) {
					if (m_dataDate.isSameOrAfter(m_startDate)) {
						for (var i = 0; i < weeklyTime.length; i++) {
							var t_date_check = new Date(d_week_check2[i]);
							t_date_check = t_date_check.setDate(t_date_check.getDate() + 1);
							t_date_check = moment(t_date_check);

							if (i == 0) {
								if (m_dataDate.isSameOrAfter(m_startDate) && t_date_check.isAfter(m_dataDate)) {
									peopleData[i] = peopleData[i] + result.room.people[index].data;
									peopleDataCounter[i]++;
								}
							} else {
								var t_date_check2 = new Date(d_week_check[i - 1]);
								t_date_check2 = moment(t_date_check2);
								if (m_dataDate.isSameOrAfter(t_date_check2) && t_date_check.isAfter(m_dataDate)) {
									peopleData[i] = peopleData[i] + result.room.people[index].data;
									peopleDataCounter[i]++;
								}
							}
						}
					}
				}
			}

			//Temperature Chart
			for (var index in result.room.temperature) {
				var dataDate = new Date(result.room.temperature[index].time);
				var m_dataDate = moment(result.room.temperature[index].time);
				if (dataDate.getUTCHours() >= parseInt(startTime.substring(0, 2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0, 2))) {
					if (m_dataDate.isSameOrAfter(m_startDate)) {
						for (var i = 0; i < weeklyTime.length; i++) {
							var t_date_check = new Date(d_week_check2[i]);
							t_date_check = t_date_check.setDate(t_date_check.getDate() + 1);
							t_date_check = moment(t_date_check);

							if (i == 0) {
								if (m_dataDate.isSameOrAfter(m_startDate) && t_date_check.isAfter(m_dataDate)) {
									tempData[i] = tempData[i] + result.room.temperature[index].data;
									tempDataCounter[i]++;
								}
							} else {
								var t_date_check2 = new Date(d_week_check[i - 1]);
								t_date_check2 = moment(t_date_check2);
								if (m_dataDate.isSameOrAfter(t_date_check2) && t_date_check.isAfter(m_dataDate)) {
									tempData[i] = tempData[i] + result.room.temperature[index].data;
									tempDataCounter[i]++;
								}
							}
						}
					}
				}
			}

			//Humidity Chart
			for (var index in result.room.humidity) {
				var dataDate = new Date(result.room.humidity[index].time);
				var m_dataDate = moment(result.room.humidity[index].time);
				if (dataDate.getUTCHours() >= parseInt(startTime.substring(0, 2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0, 2))) {
					if (m_dataDate.isSameOrAfter(m_startDate)) {
						for (var i = 0; i < weeklyTime.length; i++) {
							var t_date_check = new Date(d_week_check2[i]);
							t_date_check = t_date_check.setDate(t_date_check.getDate() + 1);
							t_date_check = moment(t_date_check);

							if (i == 0) {
								if (m_dataDate.isSameOrAfter(m_startDate) && t_date_check.isAfter(m_dataDate)) {
									humidData[i] = humidData[i] + result.room.humidity[index].data;
									humidDataCounter[i]++;
								}
							} else {
								var t_date_check2 = new Date(d_week_check[i - 1]);
								t_date_check2 = moment(t_date_check2);
								if (m_dataDate.isSameOrAfter(t_date_check2) && t_date_check.isAfter(m_dataDate)) {
									humidData[i] = humidData[i] + result.room.humidity[index].data;
									humidDataCounter[i]++;
								}
							}
						}
					}
				}
			}

			//Check whether the chart have data
			for (var i = 0; i < weeklyTime.length; i++) {
				if (peopleData[i] > 0 || tempData[i] > 0 || humidData[i] > 0) {
					data_ready = true;
				}
			}

			//Get the average for each data in the time
			for (var i = 0; i < peopleData.length; i++) {
				peopleData[i] = Math.round((peopleData[i] / peopleDataCounter[i]));
				tempData[i] = Math.round((tempData[i] / tempDataCounter[i]) * 10) / 10;
				humidData[i] = Math.round((humidData[i] / humidDataCounter[i]) * 10) / 10;
			}

			if (data_ready == true) {
				showAllChart(weeklyTime, peopleData, tempData, humidData);
				showPeopleChart(weeklyTime, peopleData); //Illustrate the chart
				showTemperatureChart(weeklyTime, tempData); //Illustrate the chart
				showHumidityChart(weeklyTime, humidData); //Illustrate the chart
				document.getElementById("pdfButton").disabled = false;
			} else {
				no_data_to_display();
			}

			insert_data_pdf(2, "weekly", peopleData, tempData, humidData, weeklyTime);
		}
	};
	xhr.open("GET", `${domain}/api/rooms/` + roomId + `?period=monthly`, true);
	xhr.send();
}

function showYearlyTrends(roomId) {
	var dateRange = document.getElementById("choosenRange").innerHTML.toString();
	var timeRange = document.getElementById("choosenTimeRange").innerHTML.toString();
	var startDate = new Date(dateRange.substring(0, 10));
	var endDate = new Date(dateRange.substring(13, 23));
	var m_startDate = moment(dateRange.substring(0, 10), 'MM-DD-YYYY');
	var m_endDate = moment(dateRange.substring(13, 23), 'MM-DD-YYYY');
	var diff_in_days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
	var m_diff_in_days = m_endDate.diff(m_startDate, 'days');
	var startTime = timeRange.substring(0, 5);
	var endTime = timeRange.substring(8, 13);
	var diff_in_time = parseInt(endTime.substring(0, 2)) - parseInt(startTime.substring(0, 2));
	var peopleData = []; // people data
	var peopleDataCounter = []; // people data counter
	var tempData = []; // temp data
	var tempDataCounter = []; // temp data counter
	var humidData = []; // humidity data
	var humidDataCounter = []; // humidity data counter
	var monthlyTime = [];
	var data_ready = false;

	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.response;
			document.getElementById("room_name").innerHTML = result.room.name;
			var startMonth = m_startDate;

			for (var i = 0; i < m_diff_in_days / 30; i++) {
				monthlyTime[i] = startMonth.format("MMMYYYY");
				startMonth.add(1, 'months');
			}

			//Initialise the array
			for (var i = 0; i < monthlyTime.length; i++) {
				peopleData[i] = 0;
				peopleDataCounter[i] = 0;
				tempData[i] = 0;
				tempDataCounter[i] = 0;
				humidData[i] = 0;
				humidDataCounter[i] = 0;
			}
			var newppldata = [];
			//People Chart
			for (var index in result.room.people) {
				var dataDate = new Date(result.room.people[index].time);
				var m_dataDate = moment(result.room.people[index].time);
				if (dataDate.getUTCHours() >= parseInt(startTime.substring(0, 2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0, 2))) {

					for (var i = 0; i < monthlyTime.length; i++) {
						if (m_dataDate.format("MMMYYYY") == monthlyTime[i]) {
							peopleData[i] = peopleData[i] + result.room.people[index].data;
							newppldata.push(peopleData[i]);
							peopleDataCounter[i]++;
						}
					}
				}
			}

			//Temperature Chart
			for (var index in result.room.temperature) {
				var dataDate = new Date(result.room.temperature[index].time);
				var m_dataDate = moment(result.room.temperature[index].time);
				if (dataDate.getUTCHours() >= parseInt(startTime.substring(0, 2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0, 2))) {
					for (var i = 0; i < monthlyTime.length; i++) {
						if (m_dataDate.format("MMMYYYY") == monthlyTime[i]) {
							tempData[i] = tempData[i] + result.room.temperature[index].data;
							tempDataCounter[i]++;
						}
					}
				}
			}

			//Humidity Chart
			for (var index in result.room.humidity) {
				var dataDate = new Date(result.room.humidity[index].time);
				var m_dataDate = moment(result.room.humidity[index].time);
				if (dataDate.getUTCHours() >= parseInt(startTime.substring(0, 2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0, 2))) {
					for (var i = 0; i < monthlyTime.length; i++) {
						if (m_dataDate.format("MMMYYYY") == monthlyTime[i]) {
							humidData[i] = humidData[i] + result.room.humidity[index].data;
							humidDataCounter[i]++;
						}
					}
				}
			}

			var startMonth2 = moment(dateRange.substring(0, 10), 'MM-DD-YYYY');
			for (var i = 0; i < m_diff_in_days / 30; i++) {
				monthlyTime[i] = startMonth2.format("MMM-YYYY");
				startMonth2.add(1, 'months');
			}

			//Check whether the chart have data
			for (var i = 0; i < monthlyTime.length; i++) {
				if (peopleData[i] > 0 || tempData[i] > 0 || humidData[i] > 0) {
					data_ready = true;
				}
			}

			//Get the average for each data in the time
			for (var i = 0; i < peopleData.length; i++) {
				peopleData[i] = Math.round((peopleData[i] / peopleDataCounter[i]));
			}

			for (var i = 0; i < tempData.length; i++) {
				tempData[i] = Math.round((tempData[i] / tempDataCounter[i]) * 10) / 10;
			}

			for (var i = 0; i < humidData.length; i++) {
				humidData[i] = Math.round((humidData[i] / humidDataCounter[i]) * 10) / 10;
			}

			if (data_ready == true) {
				showAllChart(monthlyTime, peopleData, tempData, humidData);
				showPeopleChart(monthlyTime, peopleData); //Illustrate the chart
				showTemperatureChart(monthlyTime, tempData); //Illustrate the chart
				showHumidityChart(monthlyTime, humidData); //Illustrate the chart
				document.getElementById("pdfButton").disabled = false;
			} else {
				no_data_to_display();
			}

			insert_data_pdf(3, "monthly", peopleData, tempData, humidData, monthlyTime);
		}
	};
	xhr.open("GET", `${domain}/api/rooms/` + roomId + `?period=yearly`, true);
	xhr.send();
}

function showCustomTrends(roomId) {
	var dateRange = document.getElementById("choosenRange").innerHTML.toString();
	var timeRange = document.getElementById("choosenTimeRange").innerHTML.toString();
	var startDate = new Date(dateRange.substring(0, 10));
	var endDate = new Date(dateRange.substring(13, 23));
	var m_startDate = moment(dateRange.substring(0, 10), 'MM-DD-YYYY');
	var m_endDate = moment(dateRange.substring(13, 23), 'MM-DD-YYYY');
	var m_diff_in_days = m_endDate.diff(m_startDate, 'days');
	var startTime = timeRange.substring(0, 5);
	var endTime = timeRange.substring(8, 13);
	var diff_in_time = parseInt(endTime.substring(0, 2)) - parseInt(startTime.substring(0, 2));

	var startYear = dateRange.substring(6, 10);
	var startMonth = dateRange.substring(0, 2);
	var startDay = dateRange.substring(3, 5);
	var endYear = dateRange.substring(19, 23);
	var endMonth = dateRange.substring(13, 15);
	var endDay = dateRange.substring(16, 18);

	var peopleData = []; // people data
	var peopleDataCounter = []; // people data counter
	var tempData = []; // temp data
	var tempDataCounter = []; // temp data counter
	var humidData = []; // humidity data
	var humidDataCounter = []; // humidity data counter
	var hourTime = [];
	var startingDate = startYear + "-" + startMonth + "-" + startDay;
	var endingDate = endYear + "-" + endMonth + "-" + endDay;
	var data_ready = false;

	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.response;
			document.getElementById("room_name").innerHTML = result.room.name;
			//Today Chart
			if (m_diff_in_days == 0) {
				for (var i = 0; i <= diff_in_time; i++) {
					var timeCounter = parseInt(startTime.substring(0, 2)) + i;
					hourTime.push(timeCounter.toString().concat(':00'));
				}

				//Initialise the array
				for (var i = 0; i < hourTime.length; i++) {
					peopleData[i] = 0;
					peopleDataCounter[i] = 0;
					tempData[i] = 0;
					tempDataCounter[i] = 0;
					humidData[i] = 0;
					humidDataCounter[i] = 0;
				}

				//People Chart
				for (var index in result.room.people) {
					var m_dataDate = moment(result.room.people[index].time);
					if (m_startDate.format("D") == m_dataDate.format("D")) {
						for (var i = 0; i < hourTime.length; i++) {
							if (m_dataDate.format("H").toString().concat(':00') == hourTime[i]) {
								peopleData[i] = peopleData[i] + result.room.people[index].data;
								peopleDataCounter[i]++;
							}
						}
					}
				}
				//Temperature Chart
				for (var index in result.room.temperature) {

					var m_dataDate = moment(result.room.temperature[index].time);
					if (m_startDate.format("D") == m_dataDate.format("D")) {
						for (var i = 0; i < hourTime.length; i++) {
							if (m_dataDate.format("H").toString().concat(':00') == hourTime[i]) {
								tempData[i] = tempData[i] + result.room.temperature[index].data;
								tempDataCounter[i]++;
							}
						}
					}
				}

				//Humidity Chart
				for (var index in result.room.humidity) {
					var m_dataDate = moment(result.room.humidity[index].time);
					if (m_startDate.format("D") == m_dataDate.format("D")) {
						for (var i = 0; i < hourTime.length; i++) {
							if (m_dataDate.format("H").toString().concat(':00') == hourTime[i]) {
								humidData[i] = humidData[i] + result.room.humidity[index].data;
								humidDataCounter[i]++;
							}
						}
					}
				}

				//Check whether the chart have data
				for (var i = 0; i < hourTime.length; i++) {
					if (peopleData[i] > 0 || tempData[i] > 0 || humidData[i] > 0) {
						data_ready = true;
					}
				}

				//Get the average for each data in the time
				for (var i = 0; i < hourTime.length; i++) {
					peopleData[i] = Math.round((peopleData[i] / peopleDataCounter[i]));
					tempData[i] = Math.round((tempData[i] / tempDataCounter[i]) * 10) / 10;
					humidData[i] = Math.round((humidData[i] / humidDataCounter[i]) * 10) / 10;
				}

				if (data_ready == true) {
					showAllChart(hourTime, peopleData, tempData, humidData);
					showPeopleChart(hourTime, peopleData); //Illustrate the chart
					showTemperatureChart(hourTime, tempData); //Illustrate the chart
					showHumidityChart(hourTime, humidData); //Illustrate the chart
					document.getElementById("pdfButton").disabled = false;
				} else {
					no_data_to_display();
				}

				insert_data_pdf(0, "today", peopleData, tempData, humidData, hourTime);
			}

			//Daily Chart
			if (m_diff_in_days > 0 && m_diff_in_days <= 6) {
				{
					var dailyTime = []; // var dailyTime = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
					var tempDailyTime = [];
					var d_startDate = m_startDate;

					//Initialise the dailyTime array
					for (var i = 0; d_startDate <= m_endDate; i++) {
						tempDailyTime[i] = d_startDate.format('D');
						dailyTime[i] = d_startDate.format('dddd, MMM D');
						d_startDate.add(1, 'day');
					}

					var result = this.response;
					document.getElementById("room_name").innerHTML = result.room.name;

					//Initialise the data array
					for (var i = 0; i < dailyTime.length; i++) {
						peopleData[i] = 0;
						peopleDataCounter[i] = 0;
						tempData[i] = 0;
						tempDataCounter[i] = 0;
						humidData[i] = 0;
						humidDataCounter[i] = 0;
					}

					//People Chart
					for (var index in result.room.people) {
						var m_dataDate = moment(result.room.people[index].time);
						var dataDate = new Date(result.room.people[index].time);
						if (dataDate >= startDate && dataDate < endDate.setDate(endDate.getDate() + 1)) {
							if (m_dataDate.hours() >= parseInt(startTime.substring(0, 2)) && m_dataDate.hours() <= parseInt(endTime.substring(0, 2))) {
								for (var i = 0; i < dailyTime.length; i++) {
									if (m_dataDate.format("D") == tempDailyTime[i]) {
										peopleData[i] = peopleData[i] + result.room.people[index].data;
										peopleDataCounter[i]++;
									}
								}
							}
						}
					}

					//Temperature Chart
					for (var index in result.room.temperature) {
						var m_dataDate = moment(result.room.temperature[index].time);
						var dataDate = new Date(result.room.temperature[index].time);
						if (dataDate >= startDate && dataDate < endDate.setDate(endDate.getDate() + 1)) {
							if (m_dataDate.hours() >= parseInt(startTime.substring(0, 2)) && m_dataDate.hours() <= parseInt(endTime.substring(0, 2))) {
								for (var i = 0; i < dailyTime.length; i++) {
									if (m_dataDate.format("D") == tempDailyTime[i]) {
										tempData[i] = tempData[i] + result.room.temperature[index].data;
										tempDataCounter[i]++;
									}
								}
							}
						}
					}


					//Humidity Chart
					for (var index in result.room.humidity) {
						var m_dataDate = moment(result.room.humidity[index].time);
						var dataDate = new Date(result.room.humidity[index].time);
						if (dataDate >= startDate && dataDate < endDate.setDate(endDate.getDate() + 1)) {
							if (m_dataDate.hours() >= parseInt(startTime.substring(0, 2)) && m_dataDate.hours() <= parseInt(endTime.substring(0, 2))) {
								for (var i = 0; i < dailyTime.length; i++) {
									if (m_dataDate.format("D") == tempDailyTime[i]) {
										humidData[i] = humidData[i] + result.room.humidity[index].data;
										humidDataCounter[i]++;
									}
								}
							}
						}
					}

					//Check whether the chart have data
					for (var i = 0; i < dailyTime.length; i++) {
						if (peopleData[i] > 0 || tempData[i] > 0 || humidData[i] > 0) {
							data_ready = true;
						}
					}

					//Get the average for each data in the time
					for (var i = 0; i < peopleData.length; i++) {
						peopleData[i] = Math.round((peopleData[i] / peopleDataCounter[i]));
					}

					for (var i = 0; i < tempData.length; i++) {
						tempData[i] = Math.round((tempData[i] / tempDataCounter[i]) * 10) / 10;
					}

					for (var i = 0; i < humidData.length; i++) {
						humidData[i] = Math.round((humidData[i] / humidDataCounter[i]) * 10) / 10;
					}

					if (data_ready == true) {
						showAllChart(dailyTime, peopleData, tempData, humidData);
						showPeopleChart(dailyTime, peopleData); //Illustrate the chart
						showTemperatureChart(dailyTime, tempData); //Illustrate the chart
						showHumidityChart(dailyTime, humidData); //Illustrate the chart
						document.getElementById("pdfButton").disabled = false;
					} else {
						no_data_to_display();
					}

					insert_data_pdf(1, "daily", peopleData, tempData, humidData, dailyTime);
				}
			}

			//Weekly Chart
			if (m_diff_in_days > 6 && m_diff_in_days <= 30) {
				{
					var tempStart = moment(startDate).format('MM-DD-YYYY');
					var tempStart2 = moment(startDate).format('MM-DD-YYYY');
					var weeklyTime = [];
					var weeklyTime2 = [];
					var date_check_range = [];
					var d_startDate = moment(dateRange.substring(0, 10), 'MM-DD-YYYY');
					var d_startDate2 = moment(startDate.setDate(startDate.getDate() - 1));
					var d_week_check = [];
					var d_week_check2 = [];
					var weekStart = new Date(dateRange.substring(0, 10));
					weekStart = moment(weekStart).format("MM-DD-YYYY");

					//Initialise the weeklyTime array
					tempStart = d_startDate.add(7, 'days').format('MM-DD-YYYY');
					tempStart2 = d_startDate2.add(7, 'days').format('MM-DD-YYYY');

					for (var i = 0; i < Math.ceil(m_diff_in_days / 6); i++) {
						if (d_startDate <= m_endDate) {
							weeklyTime[i] = "Week " + (i + 1);
							d_week_check[i] = tempStart;
							d_week_check2[i] = tempStart2;
							tempStart = d_startDate.add(7, 'days').format('MM-DD-YYYY');
							tempStart2 = d_startDate2.add(7, 'days').format('MM-DD-YYYY');
							if (i == 0) {
								weeklyTime[i] += ' [' + weekStart + '/' + d_week_check2[i] + ']';
							} else {
								weeklyTime[i] += ' [' + d_week_check[i - 1] + '/' + d_week_check2[i] + ']';
							}

						} else {
							weeklyTime[i] = "Week " + (i + 1);
							d_week_check[i] = m_endDate.format('MM-DD-YYYY');
							d_week_check2[i] = m_endDate.format('MM-DD-YYYY');
							weeklyTime[i] += ' [' + d_week_check[i - 1] + '/' + d_week_check2[i] + ']';
						}
					}

					//Initialise the array
					for (var i = 0; i < weeklyTime.length; i++) {
						peopleData[i] = 0;
						peopleDataCounter[i] = 0;
						tempData[i] = 0;
						tempDataCounter[i] = 0;
						humidData[i] = 0;
						humidDataCounter[i] = 0;
					}

					//People Chart
					for (var index in result.room.people) {
						var dataDate = new Date(result.room.people[index].time);
						var m_dataDate = moment(result.room.people[index].time);
						if (m_dataDate.hours() >= parseInt(startTime.substring(0, 2)) && m_dataDate.hours() <= parseInt(endTime.substring(0, 2))) {
							if (m_dataDate.isSameOrAfter(m_startDate)) {
								for (var i = 0; i < weeklyTime.length; i++) {
									var t_date_check = new Date(d_week_check2[i]);
									t_date_check = t_date_check.setDate(t_date_check.getDate() + 1);
									t_date_check = moment(t_date_check);

									if (i == 0) {
										if (m_dataDate.isSameOrAfter(m_startDate) && t_date_check.isAfter(m_dataDate)) {
											peopleData[i] = peopleData[i] + result.room.people[index].data;
											peopleDataCounter[i]++;
										}
									} else {
										var t_date_check2 = new Date(d_week_check[i - 1]);
										t_date_check2 = moment(t_date_check2);
										if (m_dataDate.isSameOrAfter(t_date_check2) && t_date_check.isAfter(m_dataDate)) {
											peopleData[i] = peopleData[i] + result.room.people[index].data;
											peopleDataCounter[i]++;
										}
									}
								}
							}
						}
					}

					//Temperature Chart
					for (var index in result.room.temperature) {
						var dataDate = new Date(result.room.temperature[index].time);
						var m_dataDate = moment(result.room.temperature[index].time);
						if (m_dataDate.hours() >= parseInt(startTime.substring(0, 2)) && m_dataDate.hours() <= parseInt(endTime.substring(0, 2))) {
							if (m_dataDate.isSameOrAfter(m_startDate)) {
								for (var i = 0; i < weeklyTime.length; i++) {
									var t_date_check = new Date(d_week_check2[i]);
									t_date_check = t_date_check.setDate(t_date_check.getDate() + 1);
									t_date_check = moment(t_date_check);

									if (i == 0) {
										if (m_dataDate.isSameOrAfter(m_startDate) && t_date_check.isAfter(m_dataDate)) {
											tempData[i] = tempData[i] + result.room.temperature[index].data;
											tempDataCounter[i]++;
										}
									} else {
										var t_date_check2 = new Date(d_week_check[i - 1]);
										t_date_check2 = moment(t_date_check2);
										if (m_dataDate.isSameOrAfter(t_date_check2) && t_date_check.isAfter(m_dataDate)) {
											tempData[i] = tempData[i] + result.room.temperature[index].data;
											tempDataCounter[i]++;
										}
									}
								}
							}
						}
					}

					//Humidity Chart
					for (var index in result.room.humidity) {
						var dataDate = new Date(result.room.humidity[index].time);
						var m_dataDate = moment(result.room.humidity[index].time);
						if (m_dataDate.hours() >= parseInt(startTime.substring(0, 2)) && m_dataDate.hours() <= parseInt(endTime.substring(0, 2))) {
							if (m_dataDate.isSameOrAfter(m_startDate)) {
								for (var i = 0; i < weeklyTime.length; i++) {
									var t_date_check = new Date(d_week_check2[i]);
									t_date_check = t_date_check.setDate(t_date_check.getDate() + 1);
									t_date_check = moment(t_date_check);

									if (i == 0) {
										if (m_dataDate.isSameOrAfter(m_startDate) && t_date_check.isAfter(m_dataDate)) {
											humidData[i] = humidData[i] + result.room.humidity[index].data;
											humidDataCounter[i]++;
										}
									} else {
										var t_date_check2 = new Date(d_week_check[i - 1]);
										t_date_check2 = moment(t_date_check2);
										if (m_dataDate.isSameOrAfter(t_date_check2) && t_date_check.isAfter(m_dataDate)) {
											humidData[i] = humidData[i] + result.room.humidity[index].data;
											humidDataCounter[i]++;
										}
									}
								}
							}
						}
					}

					//Check whether the chart have data
					for (var i = 0; i < weeklyTime.length; i++) {
						if (peopleData[i] > 0 || tempData[i] > 0 || humidData[i] > 0) {
							data_ready = true;
						}
					}

					//Get the average for each data in the time
					for (var i = 0; i < peopleData.length; i++) {
						peopleData[i] = Math.round((peopleData[i] / peopleDataCounter[i]));
						tempData[i] = Math.round((tempData[i] / tempDataCounter[i]) * 10) / 10;
						humidData[i] = Math.round((humidData[i] / humidDataCounter[i]) * 10) / 10;
					}

					if (data_ready == true) {
						showAllChart(weeklyTime, peopleData, tempData, humidData);
						showPeopleChart(weeklyTime, peopleData); //Illustrate the chart
						showTemperatureChart(weeklyTime, tempData); //Illustrate the chart
						showHumidityChart(weeklyTime, humidData); //Illustrate the chart
						document.getElementById("pdfButton").disabled = false;
					} else {
						no_data_to_display();
					}

					insert_data_pdf(2, "weekly", peopleData, tempData, humidData, weeklyTime);
				}
			}

			//Monthly Chart
			if (m_diff_in_days > 30 /*&& m_diff_in_days <= 364*/) {
				var monthlyTime = [];
				var startMonth2 = moment(dateRange.substring(0, 10), 'MM-DD-YYYY');

				for (var i = 0; i < m_diff_in_days / 31; i++) {
					monthlyTime[i] = startMonth2.format("MMM-YYYY");
					startMonth2.add(1, 'months');
				}

				//Initialise the array
				for (var i = 0; i < monthlyTime.length; i++) {
					peopleData[i] = 0;
					peopleDataCounter[i] = 0;
					tempData[i] = 0;
					tempDataCounter[i] = 0;
					humidData[i] = 0;
					humidDataCounter[i] = 0;
				}
				var newppldata = [];
				//People Chart
				for (var index in result.room.people) {
					var dataDate = new Date(result.room.people[index].time);
					var m_dataDate = moment(result.room.people[index].time);
					if (dataDate >= startDate && dataDate <= endDate) {
						if (dataDate.getUTCHours() >= parseInt(startTime.substring(0, 2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0, 2))) {

							for (var i = 0; i < monthlyTime.length; i++) {
								if (m_dataDate.format("MMM-YYYY") == monthlyTime[i]) {
									peopleData[i] = peopleData[i] + result.room.people[index].data;
									newppldata.push(peopleData[i]);
									peopleDataCounter[i]++;
								}
							}
						}
					}
				}

				//Temperature Chart
				for (var index in result.room.temperature) {
					var dataDate = new Date(result.room.temperature[index].time);
					var m_dataDate = moment(result.room.temperature[index].time);
					if (dataDate >= startDate && dataDate <= endDate) {
						if (dataDate.getUTCHours() >= parseInt(startTime.substring(0, 2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0, 2))) {
							for (var i = 0; i < monthlyTime.length; i++) {
								if (m_dataDate.format("MMM-YYYY") == monthlyTime[i]) {
									tempData[i] = tempData[i] + result.room.temperature[index].data;
									tempDataCounter[i]++;
								}
							}
						}
					}
				}

				//Humidity Chart
				for (var index in result.room.humidity) {
					var dataDate = new Date(result.room.humidity[index].time);
					var m_dataDate = moment(result.room.humidity[index].time);
					if (dataDate >= startDate && dataDate <= endDate) {
						if (dataDate.getUTCHours() >= parseInt(startTime.substring(0, 2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0, 2))) {
							for (var i = 0; i < monthlyTime.length; i++) {
								if (m_dataDate.format("MMM-YYYY") == monthlyTime[i]) {
									humidData[i] = humidData[i] + result.room.humidity[index].data;
									humidDataCounter[i]++;
								}
							}
						}
					}
				}

				//Check whether the chart have data
				for (var i = 0; i < monthlyTime.length; i++) {
					if (peopleData[i] > 0 || tempData[i] > 0 || humidData[i] > 0) {
						data_ready = true;
					}
				}

				//Get the average for each data in the time
				for (var i = 0; i < peopleData.length; i++) {
					peopleData[i] = Math.round((peopleData[i] / peopleDataCounter[i]));
				}

				for (var i = 0; i < tempData.length; i++) {
					tempData[i] = Math.round((tempData[i] / tempDataCounter[i]) * 10) / 10;
				}

				for (var i = 0; i < humidData.length; i++) {
					humidData[i] = Math.round((humidData[i] / humidDataCounter[i]) * 10) / 10;
				}

				if (data_ready == true) {
					showAllChart(monthlyTime, peopleData, tempData, humidData);
					showPeopleChart(monthlyTime, peopleData); //Illustrate the chart
					showTemperatureChart(monthlyTime, tempData); //Illustrate the chart
					showHumidityChart(monthlyTime, humidData); //Illustrate the chart
					document.getElementById("pdfButton").disabled = false;
				} else {
					no_data_to_display();
				}

				insert_data_pdf(3, "monthly", peopleData, tempData, humidData, monthlyTime);
			}
		}
	};

	xhttp.open("GET", `${domain}/api/rooms/` + roomId + `?period=custom&start=` + startingDate + `&end=` + endingDate, true);
	xhttp.send();
}

function no_data_to_display() {
	$('#allChart').highcharts({
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false
		},
		credits: false,
		exporting: {
			buttons: {
				contextButton: {
					enabled: false
				}
			}
		},
		title: {
			text: 'No data found'
		},
		series: [{
			type: 'pie',
			name: 'unknown',
			data: []
		}]
	});
}

function showAllChart(x, y1, y2, y3) {

	Highcharts.chart('allChart', {
		credits: false,

		exporting: {
			buttons: {
				contextButton: {
					enabled: false
				}
			}
		},

		layout: {
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0
		},

		title: {
			text: 'Swinburne University of Technology Sarawak'
		},
		xAxis: {
			categories: x
		},

		yAxis: {
			title: {
				text: 'Status'
			}
		},

		series: [{
			data: y1,
			name: 'People Count'
		},
		{
			data: y2,
			name: 'Temperature'

		},
		{
			data: y3,
			name: 'Humidity'
		}]
	});
}

function showPeopleChart(x, y) {

	Highcharts.chart('peopleChart', {
		credits: false,

		exporting: {
			buttons: {
				contextButton: {
					enabled: false
				}
			}
		},

		className: "reportChart",

		title: {
			text: 'Number Of People'
		},
		xAxis: {
			categories: x
		},

		yAxis: {
			text: 'Counts'
		},

		plotOptions: {
			line: {
				dataLabels: {
					enabled: true
				},
				enableMouseTracking: false
			}
		},

		series: [{
			data: y,
			name: 'People Count'
		}]
	});
}

function showTemperatureChart(x, y) {

	Highcharts.chart('temperatureChart', {
		credits: false,

		exporting: {
			buttons: {
				contextButton: {
					enabled: false
				}
			}
		},

		title: {
			text: 'Temperature'
		},
		xAxis: {
			categories: x
		},
		yAxis: {
			title: {
				text: 'Temperature (°C)'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},

		plotOptions: {
			line: {
				dataLabels: {
					enabled: true
				},
				enableMouseTracking: false
			}
		},

		tooltip: {
			valueSuffix: '°C'
		},
		series: [{
			data: y,
			name: "Room Temperature"
		}]
	});
}

function showHumidityChart(x, y) {

	Highcharts.chart('humidityChart', {
		credits: false,

		exporting: {
			buttons: {
				contextButton: {
					enabled: false
				}
			}
		},

		title: {
			text: 'Humidity'
		},
		xAxis: {
			categories: x
		},
		yAxis: {
			title: {
				text: 'Humidity (RH)'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},

		plotOptions: {
			line: {
				dataLabels: {
					enabled: true
				},
				enableMouseTracking: false
			}
		},

		tooltip: {
			valueSuffix: 'RH'
		},
		series: [{
			data: y,
			name: "Room Humidity"
		}]
	});
}


function showDashboardRooms() {
	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.response;

			let parseNotices = JSON.parse(localStorage.getItem('notifications'));

			if (parseNotices) {
				if (parseNotices.length > 0) {
					document.getElementById('noticeNum').innerHTML = parseNotices.length;
					document.getElementById('noticeNum').style.display = 'inline';

					document.getElementById('emptyNotice').style.display = "none";
					for (let i = 0; i < parseNotices.length; i++) {
						noticeMain.innerHTML += `<div class="noticeContainer"><p class="m-0 noticeTime">${parseNotices[i].noticeTime}</p><p style="font-size:0.9rem;">${parseNotices[i].roomName} has reached <strong>${parseNotices[i].roomStatus}</strong> capacity.
							<button onclick="closeNoticeRow(this)" type="button" class="close closeBtn mr-3" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</p></div>`;
					}
				}
				else {
					document.getElementById('noticeNum').innerHTML = 0;
					document.getElementById('noticeNum').style.display = 'none';
				}
			}

			const placeholderRooms = document.getElementById('placeholderRooms');
			placeholderRooms.parentNode.removeChild(placeholderRooms);

			let firstElement = true;

			for (var room in result.rooms) {
				if (firstElement) {
					document.getElementById("roomCardContainer").innerHTML += `
					<div class="roomCard card mr-4 border-0 pt-2 pb-4 mt-2 mb-4 bg-white rounded" style="width: 24rem; height: 14rem;" onclick="onRoomClicked('${result.rooms[room].name}', '${result.rooms[room]._id}', true)">
						<div class="card-body text-center">
							<div data-intro="This bar indicates the capacity of the room. When the whole bar is filled, it means that the room has reached its maximum capacity." data-step="2" data-position="right" class="status-indicator-inner"></div>
							<div class="status-indicator-outer"></div>
							<h4 class="roomName card-title mb-4">${result.rooms[room].name}</h4>
							<h6>Number of people: <span class="roomData people">N/A</span></h6>
							<h6>Temperature: <span class="roomData temperature">N/A</span></h6>
							<h6>Humidity: <span class="roomData humidity">N/A</span></h6>
							<h6 class="high_risk" style="visibility: hidden;">High Risk: <span class="roomData highRisk">N/A</span></h6>
							<p class="lastUpdated mt-2">Last updated: <span class="lastUpdatedTime">N/A<span></p>
							<span class="roomId" style="display:none">${result.rooms[room]._id}</span>
							<span class="maxCapacity" style="display:none">${result.rooms[room].maxCapacity}</span>
						</div>
					</div>
				`;

					firstElement = false;
				}
				else {
					document.getElementById("roomCardContainer").innerHTML += `
					<div class="roomCard card mr-4 border-0 pt-2 pb-4 mt-2 mb-4 bg-white rounded" style="width: 24rem; height: 14rem;" onclick="onRoomClicked('${result.rooms[room].name}', '${result.rooms[room]._id}', true)">
						<div class="card-body text-center">
							<div class="status-indicator-inner"></div>
							<div class="status-indicator-outer"></div>
							<h4 class="roomName card-title mb-4">${result.rooms[room].name}</h4>
							<h6>Number of people: <span class="roomData people">N/A</span></h6>
							<h6>Temperature: <span class="roomData temperature">N/A</span></h6>
							<h6>Humidity: <span class="roomData humidity">N/A</span></h6>
							<h6 class="high_risk" style="visibility: hidden;">High Risk: <span class="roomData highRisk">N/A</span></h6>
							<p class="lastUpdated mt-2">Last updated: <span class="lastUpdatedTime">N/A<span></p>
							<div class="status-indicator"></div>
							<span class="roomId" style="display:none">${result.rooms[room]._id}</span>
							<span class="maxCapacity" style="display:none">${result.rooms[room].maxCapacity}</span>
						</div>
					</div>
				`;
				}
			}

			document.getElementById("roomCardContainer").innerHTML += `
				<div id="noRoomCard" class="card mr-4 border-0 shadow-sm py-4 mt-2 mb-4 bg-white rounded" style="width: 24rem; height: 14rem; display: none"	>
					<div class="card-body pt-2 text-center">
						<h4 class="card-title mb-4">Room not found :(</h4>
						<h6 style="color: white">empty</h6>
						<h6 style="color: white">empty</h6>
						<h6 style="color: white">empty</h6>
						<h6 style="color: white">empty</h6>
					</div>
				</div>
			`;
		}
	};

	xhttp.open("GET", `${domain}/api/rooms/details`, true);

	xhttp.send();
}

// Issue:
// 1. the generate report only work after the chart has been generated on the web page
function directToPdf() {
	let peopleChart, temperatureChart, humidityChart;
	let charts = Highcharts.charts; // Obtain all the Highcharts objects
	let count = 0;

	// Loop through the Highcharts object array and make assignment according to the their respective renderTo.id
	for (let i = 0; i < charts.length; i++) {

		if (charts[i].renderTo.id == "peopleChart") {
			peopleChart = charts[i].getSVG();
		} 

		if (charts[i].renderTo.id == "temperatureChart") {
			temperatureChart = charts[i].getSVG();
		} 

		if (charts[i].renderTo.id == "humidityChart") {
			humidityChart = charts[i].getSVG();
		}

	}

	// Open the new window that show the PDF file
	let report_window = window.open("/report");
	report_window.focus();

	let room_name = document.getElementById("room_name").innerHTML;
	let date_range = document.getElementById("choosenRange").innerHTML;
	let time_range = document.getElementById("choosenTimeRange").innerHTML;

	// After the window load, run the function in the new opened window with those parameters
	report_window.addEventListener("load", function () {
		report_window.generateReport({ room_name: room_name, date_range: date_range, time_range: time_range }, peopleChart, temperatureChart, humidityChart);
	})
}

function showRoomTable() {
	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	var showRoomID = document.getElementById("showRoomID");
	
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			$("#spinner").hide();
			var result = this.response;

			for (room in result.rooms) {
			 
				if(showRoomID.checked == false)
				{
					$("#roomID").show();

					document.getElementById("showRoom").innerHTML +=
					'<tbody>' + '<tr class="roomRow">' +
					'<td class="roomId">' + result.rooms[room]._id + '</td>' +
					'<td>' + result.rooms[room].name + '</td>' +
					'<td>' + result.rooms[room].maxCapacity + '</td>' +
					'<td>' + '<button class = "editRoomNamebtn btn btn-success" id = "editRoomNamebtn" data-toggle="modal" data-target="#roomNameModal" onclick="passRoomNameData(&#39;' + result.rooms[room]._id + '&#39;)"> <span class="fa fa-edit" style="color: white;"></span></button>' + '</td>' +
					'<td>' + '<button class = "btn btn-success" id = "editRoomCapacitybtn" data-toggle="modal" data-target="#roomMaxCapacityModal" onclick="passRoomMaxCapacityData(&#39;' + result.rooms[room]._id + '&#39;)"> <span class="fa fa-edit" style="color: white;"></span></button>' + '</td>' +
					'<td>' + '<button class = "btn btn-success" id = "editPeopleCountbtn" data-toggle="modal" data-target="#peopleCountModal" onclick="passCurrentPeopleData(&#39;' + result.rooms[room]._id + '&#39;)"> <span class="fa fa-edit" style="color: white;"></span></button>' + '</td>'
					'</tr>' + '</tbody>';

				}
				else
				{
					$("#roomID").hide();

					document.getElementById("showRoom").innerHTML +=
					'<tbody>' + '<tr class="roomRow">' +
					'<td class="roomId"  style="display: none;">' + result.rooms[room]._id + '</td>' +
					'<td>' + result.rooms[room].name + '</td>' +
					'<td>' + result.rooms[room].maxCapacity + '</td>' +
					'<td>' + '<button class = "editRoomNamebtn btn btn-success" id = "editRoomNamebtn" data-toggle="modal" data-target="#roomNameModal" onclick="passRoomNameData(&#39;' + result.rooms[room]._id + '&#39;)"> <span class="fa fa-edit" style="color: white;"></span></button>' + '</td>' +
					'<td>' + '<button class = "btn btn-success" id = "editRoomCapacitybtn" data-toggle="modal" data-target="#roomMaxCapacityModal" onclick="passRoomMaxCapacityData(&#39;' + result.rooms[room]._id + '&#39;)"> <span class="fa fa-edit" style="color: white;"></span></button>' + '</td>' +
					'<td>' + '<button class = "btn btn-success" id = "editPeopleCountbtn" data-toggle="modal" data-target="#peopleCountModal" onclick="passCurrentPeopleData(&#39;' + result.rooms[room]._id + '&#39;)"> <span class="fa fa-edit" style="color: white;"></span></button>' + '</td>'
					'</tr>' + '</tbody>';

				}
				
			}
		}
	}

	xhttp.open("GET", `${domain}/api/rooms/details`, true);
	xhttp.send();

}

function passRoomNameData(roomId) {

	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.response;

			for (room in result.rooms) {
				if (result.rooms[room]._id === roomId) {
					document.getElementById("passRoomIdName").value = roomId;
					document.getElementById("roomName").value = result.rooms[room].name;
				}
			}

		}
	}

	xhttp.open("GET", `${domain}/api/rooms/details`, true);
	xhttp.send();
}

function passRoomMaxCapacityData(roomId) {

	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.response;

			for (room in result.rooms) {
				if (result.rooms[room]._id === roomId) {
					document.getElementById("passRoomIdMaxCapacity").value = roomId;
					document.getElementById("roomMaxCapacity").value = result.rooms[room].maxCapacity;
				}
			}

		}
	}

	xhttp.open("GET", `${domain}/api/rooms/details`, true);
	xhttp.send();
}

// Bong testing
function passCurrentPeopleData(roomId) {
	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';
	console.log("Room Id", roomId);
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.response;

			document.getElementById("currentPeopleCount").value = result.people;
			document.getElementById("currentRoomRowId").innerHTML = roomId;
		}
	}

	xhttp.open("GET", `${domain}/api/data/${roomId}/people/real-time`, true);
	xhttp.send();
}

function editCurrentPeopleCount() {
	let roomId = document.getElementById("currentRoomRowId").innerHTML;
	let editedPeopleCount = document.getElementById("currentPeopleCount").value;
	$("#spinner").show();
	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';
	var url = `${domain}/api/data/${roomId}/people/`;
	var params = 'data=' + editedPeopleCount;

	xhttp.open('PUT', url, true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhttp.onreadystatechange = function () {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			$("#spinner").hide();
			message = "People count changed to " + editedPeopleCount + ".";

			var element = document.getElementById("editPeopleCountAlert");
			element.classList.add("alert-success");

			document.getElementById("editPeopleCountAlert").innerHTML = '<strong>' + message + '</strong> <button type="button" class="close" onclick="closeEditPeopleCountAlert()"><span>&times;</span></button>';
			$("#editPeopleCountAlert").show();
		}

		if (xhttp.readyState == 4 && xhttp.status == 401) {
			$("#spinner").hide();
			message = "People count changing failed, Please try again later !";
			var element = document.getElementById("editPeopleCountAlert");
			element.classList.add("alert-danger");

			document.getElementById("editPeopleCountAlert").innerHTML = '<strong>' + message + '</strong> <button type="button" class="close" onclick="closeEditPeopleCountAlert()"><span>&times;</span></button>';
			$("#editPeopleCountAlert").show();
		}
	}

	xhttp.send(params);
}

function resetCurrentPeopleCount() {
	document.getElementById("currentPeopleCount").value = 0;
}

function updateRoom() {
	var roomIdName = document.getElementById("passRoomIdName").value;
	var roomIdMaxCapacity = document.getElementById("passRoomIdMaxCapacity").value;
	var name = document.getElementById("roomName").value;
	var maxCapacity = document.getElementById("roomMaxCapacity").value;

	$("#spinner").show();

	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';
	var url;

	if (roomIdName) {
		url = `${domain}/api/rooms/` + roomIdName;
	}
	else if (roomIdMaxCapacity) {
		url = `${domain}/api/rooms/` + roomIdMaxCapacity;
	}

	var params;

	if (name) {
		maxCapacity = ' ';
		params = 'roomName=' + name + '&roomMaxCapacity=' + maxCapacity;
	}
	else if (maxCapacity) {
		name = ' ';
		params = 'roomName=' + name + '&roomMaxCapacity=' + maxCapacity;
	}

	document.getElementById('roomName').value = "";
	document.getElementById('roomMaxCapacity').value = "";

	xhttp.open('PUT', url, true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhttp.onreadystatechange = function () {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			$("#spinner").hide();

			document.getElementById("showRoom").innerHTML = "";
			var table = document.getElementById("showRoom").innerHTML;
			table = showRoomTable();

			var element = document.getElementById("roomEditAlert");
			element.classList.add("alert-success");

			document.getElementById("roomEditAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeRoomEditAlert()"><span>&times;</span></button>';
			$("#roomEditAlert").show();
		}

		if (xhttp.readyState == 4 && xhttp.status == 401) {
			$("#spinner").hide();

			document.getElementById("showRoom").innerHTML = "";
			var table = document.getElementById("showRoom").innerHTML;
			table = showRoomTable();

			var element = document.getElementById("roomEditAlert");
			element.classList.add("alert-danger");

			document.getElementById("roomEditAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeRoomEditAlert()"><span>&times;</span></button>';
			$("#roomEditAlert").show();
		}
	}

	xhttp.send(params);
}

function showUserTable() {
	$("#spinner_adduser").hide();
	$("#userAlert").hide();
	$("#userEditAlert").hide();
	$("#userEditModalAlert").hide();

	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			$("#spinner").hide();
			var result = this.response;
			var c = 0;
			var a = 0;

			for (var user in result.users) {

				document.getElementById("showUser").innerHTML +=
					'<tbody>' + '<tr>' +
					'<td style="display: none;">' + result.users[user]._id + '</td>' +
					'<td>' + result.users[user].username + '</td>' +
					'<td>' + result.users[user].email + '</td>' +
					// '<td>' + result.users[user].role + '</td>' +
					'<td class="roleButtons">' + '<input class="roleChangeButtons" id = "rolebtn" onchange="updateUser(this, &#39;' + result.users[user]._id + '&#39;)" type="checkbox" data-toggle="toggle" data-on="Manager" data-off="Staff" data-onstyle="success" data-offstyle="outline-dark" data-size="xs">' + '</td>' +
					'<td>' + '<button class = "deleteuserbtn btn btn-danger" id = "deletebtn" disabled = "disabled" onclick = "deleteUser(&#39;' + result.users[user]._id + '&#39;)"><span class="fa fa-trash" style = "color: white"></span></button>' + '</td>' + '</tr>' + '</tbody>';

			};


			// Set the checkbox checked value to either staff or manager according to the user roles
			let roleChangeButtons = document.getElementsByClassName("roleChangeButtons");


			for (var user in result.users) {
				if (result.users[user].role == "staff") {
					roleChangeButtons[user].checked = false;
				} else {
					roleChangeButtons[user].checked = true;
				}
			}


			var userID = sessionStorage.getItem("passLoginUserID");
			var userIndex;

			for (var user in result.users) {
				if (result.users[user]._id === userID) {
					roleChangeButtons[user].disabled = true;
					userIndex = user;
				}
			}

			// Initialize the checkbox to be applied by bootstrap toggle css
			$("[data-toggle='toggle']").bootstrapToggle();

			if ((sessionStorage.getItem("passLoginUserRole")) == "manager") {
				var deletebtns = document.getElementsByClassName("deleteuserbtn");

				for (var i = 0; i < deletebtns.length; i++) {
					deletebtns[i].disabled = false;
					deletebtns[userIndex].disabled = true;

				}

			}

			if ((sessionStorage.getItem("passLoginUserRole")) == "staff") {
				$("[data-toggle='toggle']").prop('disabled', true);
				$("[data-toggle='collapse']").prop('disabled', true);
				$('#userNameToggle').prop('disabled', false);

			}
		}

	};

	xhttp.open("GET", `${domain}/api/users`, true);
	xhttp.send();

};

function search() {
	var input, filter, table, tr, td, i, textValue;
	input = document.getElementById("searchInput");
	filter = input.value.toUpperCase();
	table = document.getElementById("userTable");
	tr = table.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[1];
		if (td) {
			textValue = td.textContent || td.innerText;
			if (textValue.toUpperCase().indexOf(filter) > -1) {

				tr[i].style.display = "";

			} else {

				tr[i].style.display = "none";

			}
		}
	}
}

function searchRoomName() {
	var input, filter, table, tr, td, i, textValue;
	input = document.getElementById("searchRoomInput");
	filter = input.value.toUpperCase();
	table = document.getElementById("roomTable");
	tr = table.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[1];
		if (td) {
			textValue = td.textContent || td.innerText;
			if (textValue.toUpperCase().indexOf(filter) > -1) {

				tr[i].style.display = "";

			} else {

				tr[i].style.display = "none";

			}
		}
	}
}

function showHint() {
	if (document.getElementById("upsd").value === '') {
		document.getElementById("showPasswordHint").innerHTML = '8-12 character, at lease one uppercase, one lowercase and one numeric digit';
	}

}

function showcpsdHint() {
	if (document.getElementById("cupsd").value === '') {
		document.getElementById("showConfirmPasswordHint").innerHTML = '8-12 character, at lease one uppercase, one lowercase and one numeric digit';
	}
}

function showNewpsdHint() {
	if (document.getElementById("password").value === '') {
		document.getElementById("showNewPasswordHint").innerHTML = '8-12 character, one uppercase, one lowercase and one numeric digit';
	}
}

function showNewconfirmpsdHint() {
	if (document.getElementById("confirm_password").value === '') {
		document.getElementById("showNewConfirmPasswordHint").innerHTML = '8-12 character, one uppercase, one lowercase and one numeric digit';
	}
}

function toggle() {
	function toggleOpen(e) {
		$(e.target).prev('.card-header').find(".expand-icon").text("remove_circle");
	}

	function toggleClose(e) {
		$(e.target).prev('.card-header').find(".expand-icon").text("add_circle");
	}

	$('.panel-group').on('hidden.bs.collapse', toggleClose);
	$('.panel-group').on('shown.bs.collapse', toggleOpen);
}

function addUser() {

	if (document.getElementById("role").value == "Pick a Role") {
		var element = document.getElementById("userAlert");
		element.classList.add("alert-danger");

		document.getElementById("userAlert").innerHTML = '<strong>Please pick a role!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
		$("#userAlert").show();
	}

	if (document.getElementById("upsd").value !== document.getElementById("cupsd").value) {
		document.getElementById("userAlert").innerHTML = '<strong>Your Password and Confirm Password is not the same. Please fill in again!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
		$("#userAlert").show();
	}

	CheckPassword(document.getElementById("cupsd"));

	if (document.getElementById("cupsd").value === "") {
		document.getElementById("userAlert").innerHTML = '<strong>Please fill in your confirm password!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
		$("#userAlert").show();
	}

	CheckPassword(document.getElementById("upsd"));

	if (document.getElementById("upsd").value === "") {
		document.getElementById("userAlert").innerHTML = '<strong>Please fill in your password!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
		$("#userAlert").show();
	}

	ValidateEmail(document.getElementById("uemail"));

	if (document.getElementById("uemail").value === "") {
		document.getElementById("userAlert").innerHTML = '<strong>Please fill in your email!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
		$("#userAlert").show();
	}

	if (document.getElementById("uname").value === "") {
		document.getElementById("userAlert").innerHTML = '<strong>Please fill in your name!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
		$("#userAlert").show();
	}

	if (document.getElementById("uname").value !== ""
		&& document.getElementById("upsd").value !== ""
		&& document.getElementById("cupsd").value !== ""
		&& document.getElementById("uemail").value !== ""
		&& document.getElementById("role").value !== "Pick a Role"
		&& (document.getElementById("upsd").value === document.getElementById("cupsd").value)
		&& CheckPassword(document.getElementById("upsd")) === true
		&& CheckPassword(document.getElementById("cupsd")) === true
		&& ValidateEmail(document.getElementById("uemail")) === true) {
		$("#spinner_adduser").show();
		var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';
		var url = `${domain}/api/users`;
		var params = 'role=' + document.getElementById("role").value
			+ '&username=' + document.getElementById("uname").value
			+ '&email=' + document.getElementById('uemail').value
			+ '&password=' + document.getElementById('upsd').value;

		xhttp.open('POST', url, true);

		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 201) {
				$("#spinner_adduser").hide();

				clear();
				document.getElementById("showPasswordHint").innerHTML = '';
				document.getElementById("showConfirmPasswordHint").innerHTML = '';

				document.getElementById("showUser").innerHTML = "";
				var table = document.getElementById("showUser").innerHTML;
				table = showUserTable();

				document.getElementById("maxRows").selectedIndex = "0";
				$('.pagination').html('');

				var element = document.getElementById("userAlert");
				element.classList.remove("alert-danger")
				element.classList.add("alert-success");

				document.getElementById("userAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
				$("#userAlert").show();

			}

			if (xhttp.readyState == 4 && xhttp.status == 401) {
				$("#spinner_adduser").hide();

				clear();

				document.getElementById("showUser").innerHTML = "";
				var table = document.getElementById("showUser").innerHTML;
				table = showUserTable();

				document.getElementById("userAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
				$("#userAlert").show();

			}

			if (xhttp.readyState == 4 && xhttp.status == 500) {
				$("#spinner_adduser").hide();

				var element = document.getElementById("userAlert");
				element.classList.add("alert-danger");

				document.getElementById("userAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';

				$("#userAlert").show();
			}
		}

		xhttp.send(params);

	}
};

function CheckPassword(input) {
	var validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;

	if (input.value.match(validPassword)) {
		return true;
	}
	else {
		var element = document.getElementById("userAlert");
		element.classList.add("alert-danger");

		document.getElementById("userAlert").innerHTML = '<strong>Your Password or Confirm Password is invalid. Please enter a password which contain 8 to 12 character, at least one numeric digit, one uppercase and one lowercase letter!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
		$("#userAlert").show();

		return false;

	}
};

function CheckResetPassword(input) {
	var validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;

	if (input.value.match(validPassword)) {
		return true;
	}
	else {
		var element = document.getElementById("resetAlert");
		element.classList.add("alert-danger");

		document.getElementById("resetAlert").innerHTML = '<strong>Your New Password or Confirm Password is invalid. Please enter a password which contain 8 to 12 character, at least one numeric digit, one uppercase and one lowercase letter!</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
		$("#resetAlert").show();
		$("#spinner_reset").hide();

		return false;

	}
};

function clear() {
	document.getElementById("uname").value = '';
	document.getElementById("upsd").value = '';
	document.getElementById("cupsd").value = '';
	document.getElementById("uemail").value = '';
	document.getElementById("role").selectedIndex = "0";
};


function cancel() {
	if (document.getElementById("uname").value !== ""
		|| document.getElementById("upsd").value !== ""
		|| document.getElementById("cupsd").value !== ""
		|| document.getElementById("uemail").value !== ""
		|| document.getElementById("role").value !== "Pick a Role") {
		var answer = window.confirm("Are you sure you want to clear?");

		if (answer) {
			document.getElementById("uname").value = '';
			document.getElementById("upsd").value = '';
			document.getElementById("cupsd").value = '';
			document.getElementById("uemail").value = '';
			document.getElementById("role").selectedIndex = "0";
			document.getElementById("showPasswordHint").innerHTML = '';
			document.getElementById("showConfirmPasswordHint").innerHTML = '';
		}
	}

};

function showModal() {
	var modal = document.getElementById("myModal");
	modal.style.display = "block";

	var table = document.getElementsByTagName("table")[0];

	var tbody = table.getElementsByTagName("tbody")[0];

	tbody.onclick = function (e) {
		e = e || window.event;
		var target = e.srcElement || e.target;
		while (target && target.nodeName !== "TR") {
			target = target.parentNode;
		}
		if (target) {

			var cells = target.getElementsByTagName("td");

		}

		var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';

		var url = `${domain}/api/users/` + cells[0].innerHTML;

		document.getElementById("id").value = cells[0].innerHTML;
		document.getElementById("previousRole").value = cells[3].innerHTML;

		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var result = this.response;

				document.getElementById("edit_role").value = result.user.role;

			}
		};

		xhttp.open("GET", url, true);

		xhttp.send();


	};
};


function updateUser(checkboxValue, id) {
	let role;
	if (checkboxValue.checked == true) {
		role = "manager";
	} else {
		role = "staff";
	}

	$("#spinner").show();

	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';
	var url = `${domain}/api/users/` + id;
	var params = 'role=' + role + '&mode=role';

	xhttp.open('PUT', url, true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhttp.onreadystatechange = function () {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			$("#spinner").hide();

			var element = document.getElementById("userEditAlert");
			element.classList.add("alert-success");

			document.getElementById("userEditAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserEditAlert()"><span>&times;</span></button>';
			$("#userEditAlert").show();
		}

		if (xhttp.readyState == 4 && xhttp.status == 401) {
			$("#spinner").hide();

			var element = document.getElementById("userEditAlert");
			element.classList.add("alert-danger");

			document.getElementById("userEditAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserEditAlert()"><span>&times;</span></button>';
			$("#userEditAlert").show();
		}
	}

	xhttp.send(params);
};


function closeModal() {
	var modal = document.getElementById("myModal");
	modal.style.display = "none";
};

function deleteUser(userIdDelete) {

	$("#spinner").show();

	var table = document.getElementsByTagName("table")[0];

	var tbody = table.getElementsByTagName("tbody")[0];

	var answer = window.confirm("Are you sure you want to delete this user?");
	if (answer) {
		var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';

		var url = `${domain}/api/users/` + userIdDelete;

		xhttp.open("DELETE", url, true);

		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				$("#spinner").hide();

				document.getElementById("showUser").innerHTML = "";
				var table = document.getElementById("showUser").innerHTML;
				table = showUserTable();

				document.getElementById("maxRows").selectedIndex = "0";
				$('.pagination').html('');

				var element = document.getElementById("userEditAlert");
				element.classList.add("alert-success");

				document.getElementById("userEditAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserEditAlert()"><span>&times;</span></button>';
				$("#userEditAlert").show();
			}

			if (this.readyState == 4 && this.status == 401) {
				$("#spinner").hide();

				document.getElementById("showUser").innerHTML = "";
				var table = document.getElementById("showUser").innerHTML;
				table = showUserTable();

				var element = document.getElementById("userEditAlert");
				element.classList.add("alert-danger");

				document.getElementById("userEditAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserEditAlert()"><span>&times;</span></button>';
				$("#userEditAlert").show();
			}
		};

		xhttp.send();
	}
	else {
		$("#spinner").hide();
	}
};

function loginPage() {
	$("#spinner_login").hide();
	$("#spinner_forget").hide();
	$("#loginAlert").hide();
	$("#forgetAlert").hide();
};

async function login() {

	$("#loginAlert").hide();

	if (document.getElementById("loginPassword").value === "") {
		document.getElementById("loginAlert").innerHTML = '<strong>Please enter your password!!</strong> <button type="button" class="close" onclick="closeLoginAlert()"><span>&times;</span></button>';
		$("#loginAlert").show();
	}

	if (document.getElementById("loginEmail").value === "") {
		document.getElementById("loginAlert").innerHTML = '<strong>Please enter your username!!</strong> <button type="button" class="close" onclick="closeLoginAlert()"><span>&times;</span></button>';
		$("#loginAlert").show();
	}

	if ((document.getElementById("loginEmail").value != "") && (document.getElementById("loginPassword").value != "")) {
		$("#spinner_login").show();
		var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';
		var url = `${domain}/api/users/login`;
		var params = 'email=' + document.getElementById("loginEmail").value + '&password=' + document.getElementById("loginPassword").value;

		xhttp.open('POST', url, true);

		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		xhttp.onreadystatechange = function () {

			if (xhttp.readyState == 4 && xhttp.status == 200) {

				if (xhttp.response.status == "success") {
					sessionStorage.setItem("passLoginUserID", xhttp.response.userId);
					sessionStorage.setItem("passLoginUserRole", xhttp.response.role);
					sessionStorage.setItem("firstLogin", xhttp.response.firstLogin.toString());

					$("#spinner_login").hide();

					document.cookie = "token=" + xhttp.response.token;

					window.location.replace("/dashboard");
				}
			}

			if ((xhttp.readyState == 4 && xhttp.status == 401) || (xhttp.readyState == 4 && xhttp.status == 404)) {
				$("#spinner_login").hide();
				document.getElementById("loginAlert").innerHTML = '<strong>Login credentials invalid!!</strong> <button type="button" class="close" onclick="closeLoginAlert()"><span>&times;</span></button>';
				$("#loginAlert").show();
			}

			if (xhttp.readyState == 4 && xhttp.status == 500) {
				$("#spinner_login").hide();
				document.getElementById("loginAlert").innerHTML = '<strong>' + xhttp.response.message + ' maybe something is wrong with the server</strong> <button type="button" class="close" onclick="closeLoginAlert()"><span>&times;</span></button>';
				$("#loginAlert").show();

			}
		}

		xhttp.send(params);
	}
};

// enter key will trigger login button
function triggerLogin(event) {
	if (event.keyCode === 13) {
		document.getElementById("loginSubmitbtn").click();
	}
}

function triggerSubmitEmail(event) {
	if (event.key === 13) {
		console.log("ready");
	}
}

function triggerResetPassword(event) {
	if (event.keyCode === 13) {
		document.getElementById("resetSubmitbtn").click();
	}
}

function closeLoginAlert() {
	$("#loginAlert").hide();
};

function closeForgetAlert() {
	$("#forgetAlert").hide();
};

function closeUserAlert() {
	$("#userAlert").hide();
};

function closeUserEditAlert() {
	$("#userEditAlert").hide();
};

function closeUserEditModalAlert() {
	$("#userEditModalAlert").hide();
};

function closeEditPeopleCountAlert() {
	$("#editPeopleCountAlert").hide();
}

function closeRoomEditAlert() {
	$("#roomEditAlert").hide();
};

function closeResetAlert() {
	$("#resetAlert").hide();
};

function closeProfileAlert() {
	$("#changePasswordAlert").hide();
};

function closeProfileResultAlert() {
	$("#profileResultAlert").hide();
};

function openForgetEmail() {
	var modal = document.getElementById("modalEmail");
	modal.style.display = "block";
};

function closeForget() {
	var modal = document.getElementById("modalEmail");
	modal.style.display = "none";
};

function checkEmail() {

	$("#spinner_forget").show();

	if (document.getElementById("forgetEmail").value === "") {
		$("#spinner_forget").hide();

		var element = document.getElementById("forgetAlert");
		element.classList.add("alert-danger");

		document.getElementById("forgetAlert").innerHTML = '<strong>Please enter an email!!</strong> <button type="button" class="close" onclick="closeForgetAlert()"><span>&times;</span></button>';
		$("#forgetAlert").show();
	}
	else {
		var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';
		var url = `${domain}/api/users/forgotPassword`;
		var params = 'email=' + document.getElementById("forgetEmail").value;

		xhttp.open('POST', url, true);
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				$("#spinner_forget").hide();

				var element = document.getElementById("forgetAlert");
				element.classList.remove("alert-danger");
				element.classList.add("alert-success");

				document.getElementById("forgetAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeForgetAlert()"><span>&times;</span></button>';
				$("#forgetAlert").show();
				document.getElementById("forgetEmail").value = "";

			}

			if (xhttp.status == 404) {
				$("#spinner_forget").hide();

				var element = document.getElementById("forgetAlert");
				element.classList.add("alert-danger");

				document.getElementById("forgetAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeForgetAlert()"><span>&times;</span></button>';
				$("#forgetAlert").show();

			}

		}

		xhttp.send(params);
	}
};

function resetPage() {
	$("#spinner_reset").hide();
	$("#resetAlert").hide();
};

function onResetPassword() {

	$("#spinner_reset").show();

	if (document.getElementById("password").value !== document.getElementById("confirm_password").value) {
		$("#spinner_reset").hide();

		document.getElementById("resetAlert").innerHTML = '<strong>Your new password and confirm password is not the same.\nPlease enter again!!</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
		$("#resetAlert").show();
	}

	CheckResetPassword(document.getElementById("confirm_password"));

	if (document.getElementById("confirm_password").value === "") {
		$("#spinner_reset").hide();

		document.getElementById("resetAlert").innerHTML = '<strong>Please fill in your confirm password!!</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
		$("#resetAlert").show();
	}

	CheckResetPassword(document.getElementById("password"));

	if (document.getElementById("password").value === "") {
		$("#spinner_reset").hide();

		document.getElementById("resetAlert").innerHTML = '<strong>Please fill in your new password!!</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
		$("#resetAlert").show();
	}

	if (document.getElementById("password").value !== ""
		&& document.getElementById("confirm_password").value !== ""
		&& document.getElementById("password").value === document.getElementById("confirm_password").value
		&& CheckResetPassword(document.getElementById("password")) === true
		&& CheckResetPassword(document.getElementById("confirm_password")) === true) {
		var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';

		var url = `${domain}/api/users/resetPassword`;

		const token = window.location.pathname.split('/')[2];
		const password = document.getElementById("password").value;

		var params = `token=${token}&password=${password}`;

		xhttp.open('POST', url, true);

		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				if (xhttp.response.message == 'success') {
					$("#spinner_reset").hide();

					document.getElementById("showNewPasswordHint").innerHTML = '';
					document.getElementById("showNewConfirmPasswordHint").innerHTML = '';

					var element = document.getElementById("resetAlert");
					element.classList.remove("alert-danger")
					element.classList.add("alert-success");

					document.getElementById("resetAlert").innerHTML = '<strong>Successfully reset password</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
					$("#resetAlert").show();

					setTimeout(function () { window.location.replace("/login"); }, 3000);

				}
			}

			if (xhttp.readyState == 4 && xhttp.status == 404) {
				$("#spinner_reset").hide();

				document.getElementById("resetAlert").innerHTML = '<strong>Failed to reset password.\nPlease go to enter your forget email again.</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
				$("#resetAlert").show();

			}


			if (xhttp.readyState == 4 && xhttp.status == 500) {
				$("#spinner_reset").hide();

				document.getElementById("resetAlert").innerHTML = '<strong>Failed to reset password due to internal server error.\n Please try again later</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
				$("#resetAlert").show();
			}
		}

		xhttp.send(params);
	}

};

function tablePagination() {
	var table = '#userTable';
	$('#maxRows').on('change', function () {
		$('.pagination').html('')
		var trnum = 0
		var maxRows = parseInt($(this).val())
		var totalRows = $(table + ' tbody tr').length
		$(table + ' tr:gt(0)').each(function () {
			trnum++
			if (trnum > maxRows) {
				$(this).hide();
				for (var i = 0; i < $(this).length; i++) {
					var td = $(this)[i].cells[i];
				}
			}
			if (trnum <= maxRows) {
				$(this).show();
				for (var i = 0; i < $(this).length; i++) {
					var td = $(this)[i].cells[i];
				}
			}
		})
		if (totalRows > maxRows) {
			var pagenum = Math.ceil(totalRows / maxRows)
			for (var i = 1; i <= pagenum;) {
				$('.pagination').append('<li class = "active" data-page="' + i + '">\<span><a class="page-link">' + i++ + '<span class="sr-only">(current)</span></span></a>\</li>').show()
			}
		}
		$('.pagination li:first-child').addClass('active')
		$('.pagination li').on('click', function () {
			var pageNum = $(this).attr('data-page')
			var trIndex = 0;
			$('.pagination li').removeClass('active')
			$(this).addClass('active')
			$(table + ' tr:gt(0)').each(function () {
				trIndex++
				if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
					$(this).hide();
					for (var i = 0; i < $(this).length; i++) {
						var td = $(this)[i].cells[i];
					}
				} else {
					$(this).show();
					for (var i = 0; i < $(this).length; i++) {
						var td = $(this)[i].cells[i];
					}
				}
			})
		})
	})
}

function tableRoomPagination() {
	var table = '#roomTable';
	$('#maxRows').on('change', function () {
		$('.pagination').html('')
		var trnum = 0
		var maxRows = parseInt($(this).val())
		var totalRows = $(table + ' tbody tr').length
		$(table + ' tr:gt(0)').each(function () {
			trnum++
			if (trnum > maxRows) {
				$(this).hide();
				for (var i = 0; i < $(this).length; i++) {
					var td = $(this)[i].cells[i];
				}
			}
			if (trnum <= maxRows) {
				$(this).show();
				for (var i = 0; i < $(this).length; i++) {
					var td = $(this)[i].cells[i];
				}
			}
		})
		if (totalRows > maxRows) {
			var pagenum = Math.ceil(totalRows / maxRows)
			for (var i = 1; i <= pagenum;) {
				$('.pagination').append('<li class = "active" data-page="' + i + '">\<span><a class="page-link">' + i++ + '<span class="sr-only">(current)</span></span></a>\</li>').show()
			}
		}
		$('.pagination li:first-child').addClass('active')
		$('.pagination li').on('click', function () {
			var pageNum = $(this).attr('data-page')
			var trIndex = 0;
			$('.pagination li').removeClass('active')
			$(this).addClass('active')
			$(table + ' tr:gt(0)').each(function () {
				trIndex++
				if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
					$(this).hide();
					for (var i = 0; i < $(this).length; i++) {
						var td = $(this)[i].cells[i];
					}
				} else {
					$(this).show();
					for (var i = 0; i < $(this).length; i++) {
						var td = $(this)[i].cells[i];
					}
				}
			})
		})
	})
}

function onLogout() {
	window.location.replace('/login');

	// var cookies = document.cookie.split(";");
	// document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	// document.cookie = "io=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

	deleteAllCookies();
}

function pagenotfoundRedirect() {
	window.location.replace('/dashboard');
}

function onToggleCollapse() {
	var isExpanded = $('#headingUser').attr("aria-expanded");

	const up = document.getElementById('up-icon');
	const down = document.getElementById('down-icon');

	if (isExpanded == 'true') {
		up.style.display = 'none';
		down.style.display = 'inline';
	}
	else {
		up.style.display = 'inline';
		down.style.display = 'none';
	}
}

function addRoom() {
	var newRoom = document.getElementById("room-name").value;

	if (newRoom == "") {
		$(".shakeInput").effect("shake", { direction: "left", distance: 0.5, times: 2 }, 200);
	} else {
		var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';
		var url = `${domain}/api/rooms`;
		var params = 'name=' + document.getElementById("room-name").value;

		xhttp.open('POST', url, true);

		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				alert("Added ".concat(newRoom.toString()));
				location.reload(true);
			}
		}
		xhttp.send(params);

	}
}


// Chart.js
// Trend Chart
let dashTrendChart = document.getElementById('dashTrendChart').getContext('2d');

let peopleGradient = dashTrendChart.createLinearGradient(500, 0, 100, 0);
peopleGradient.addColorStop(0, "#764ba2");
peopleGradient.addColorStop(1, "#667eea");

let tempGradient = dashTrendChart.createLinearGradient(500, 0, 100, 0);
tempGradient.addColorStop(0, "#fc4a1a");
tempGradient.addColorStop(1, "#f7b733");

let humidGradient = dashTrendChart.createLinearGradient(500, 0, 100, 0);
humidGradient.addColorStop(0, "#56ab2f");
humidGradient.addColorStop(1, "#a8e063");

let timeline = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];

let currentHour = moment().hours();
timeline = timeline.slice(0, currentHour + 1);

let peopleData = [];
let temperatureData = [];
let humidityData = [];

for (let i = 0; i < timeline.length; i++) {
	peopleData.push(0);
	temperatureData.push(0);
	humidityData.push(0);
}

let trendChart = new Chart(dashTrendChart, {
	// The type of chart we want to create
	type: 'line',

	// The data for our dataset
	data: {
		labels: timeline,
		datasets: [{
			label: 'No. of People',
			backgroundColor: peopleGradient,
			borderColor: peopleGradient,
			data: peopleData,
			fill: false
		},
		{
			label: 'Temperature',
			backgroundColor: tempGradient,
			borderColor: tempGradient,
			data: temperatureData,
			fill: false
		},
		{
			label: 'Humidity',
			backgroundColor: humidGradient,
			borderColor: humidGradient,
			data: humidityData,
			fill: false
		}
		]
	},

	// Configuration options go here
	options: {
		scales: {
			xAxes: [{
				barPercentage: 0.4
			}],
			yAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'Status'
				},
				ticks: {
					beginAtZero: true
				}
			}]
		}
	}
});


function onUpdateTrend(roomId, roomName) {
	// Trend's variables
	timeline = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];
	let newPeople = [];
	let newTemperature = [];
	let newHumidity = [];

	// Insight's vatiables
	let highestTemperature = { data: 0, time: null };
	let highestHumidity = { data: 0, time: null };
	let highestPeople = { data: 0, time: null };
	let lowestTemperature = { data: 0, time: null };
	let lowestHumidity = { data: 0, time: null };


	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let result = this.response;

			const currentHour = moment().hours();

			timeline = timeline.slice(0, currentHour + 1);

			for (let i = 0; i < timeline.length; i++) {
				newPeople.push(0);
				newTemperature.push(0);
				newHumidity.push(0);
			}


			for (let i = 0; i < result.room.people.length; i++) {
				if (moment(result.room.people[i].time).isSame(new Date(), "day")) {
					const current = moment(result.room.people[i].time).hours();
					if (newPeople[current] != 0) {
						newPeople[current] = Math.round((newPeople[current] + result.room.people[i].data) / 2);
					}
					else {
						newPeople[current] = result.room.people[i].data;
					}

					if (result.room.people[i].data > highestPeople.data) {
						highestPeople.data = result.room.people[i].data;
						highestPeople.time = result.room.people[i].time;
					}
				}
			}

			for (let i = 0; i < result.room.temperature.length; i++) {
				if (moment(result.room.temperature[i].time).isSame(new Date(), "day")) {
					const current = moment(result.room.temperature[i].time).hours();

					if (newTemperature[current] != 0) {
						newTemperature[current] = (newTemperature[current] + result.room.temperature[i].data) / 2;
					}
					else {
						newTemperature[current] = result.room.temperature[i].data;
					}

					if (result.room.temperature[i].data > highestTemperature.data) {
						highestTemperature.data = result.room.temperature[i].data;
						highestTemperature.time = result.room.temperature[i].time;
					}

					if (i == 0) {
						lowestTemperature.data = result.room.temperature[i].data;
						lowestTemperature.time = result.room.temperature[i].time;
					}
					else if (result.room.temperature[i].data < lowestTemperature.data) {
						lowestTemperature.data = result.room.temperature[i].data;
						lowestTemperature.time = result.room.temperature[i].time;
					}
				}
			}


			for (let i = 0; i < result.room.humidity.length; i++) {
				if (moment(result.room.humidity[i].time).isSame(new Date(), "day")) {
					const current = moment(result.room.humidity[i].time).hours();
					if (newHumidity[current] != 0) {
						newHumidity[current] = (newHumidity[current] + result.room.humidity[i].data) / 2;
					}
					else {
						newHumidity[current] = result.room.humidity[i].data;
					}

					if (result.room.humidity[i].data > highestHumidity.data) {
						highestHumidity.data = result.room.humidity[i].data;
						highestHumidity.time = result.room.humidity[i].time;
					}

					if (i == 0) {
						lowestHumidity.data = result.room.humidity[i].data;
						lowestHumidity.time = result.room.humidity[i].time;
					}
					else if (result.room.humidity[i].data < lowestHumidity.data) {
						lowestHumidity.data = result.room.humidity[i].data;
						lowestHumidity.time = result.room.humidity[i].time;
					}
				}
			}

			dashIngishtsController(highestPeople, highestTemperature, highestHumidity, lowestTemperature, lowestHumidity);

			trendChart.data.datasets[0].data = newPeople;
			trendChart.data.datasets[1].data = newTemperature;
			trendChart.data.datasets[2].data = newHumidity;

			trendChart.data.labels = timeline;

			trendChart.update();

			document.getElementById('insightRoom').innerHTML = " - " + roomName;
			document.getElementById('trendRoom').innerHTML = " - " + roomName;
			document.getElementById('viewRoomDetails').href = `/chart/${roomId}`;

		}
	};

	xhttp.open("GET", `${domain}/api/rooms/${roomId}?period=today`, true);

	xhttp.send();
}


function dashIngishtsController(highestPeople, highestTemperature, highestHumidity, lowestTemperature, lowestHumidity) {
	document.getElementById('hPeople').innerHTML = "N/A";
	document.getElementById('hTemp').innerHTML = "N/A";
	document.getElementById('hHumid').innerHTML = "N/A";
	document.getElementById('lTemp').innerHTML = "N/A";
	document.getElementById('lHumid').innerHTML = "N/A";

	if (highestPeople.time != null) {
		document.getElementById('hPeople').innerHTML = `${moment(highestPeople.time).format('hh:mm A')} - ${highestPeople.data} people`;
	}

	if (highestTemperature.time != null) {
		document.getElementById('hTemp').innerHTML = `${moment(highestTemperature.time).format('hh:mm A')} - ${highestTemperature.data} °C`;
	}

	if (highestHumidity.time != null) {
		document.getElementById('hHumid').innerHTML = `${moment(highestHumidity.time).format('hh:mm A')} - ${highestHumidity.data} RH`;
	}

	if (lowestTemperature.time != null) {
		document.getElementById('lTemp').innerHTML = `${moment(lowestTemperature.time).format('hh:mm A')} - ${lowestTemperature.data} °C`;
	}

	if (lowestHumidity.time != null) {
		document.getElementById('lHumid').innerHTML = `${moment(lowestHumidity.time).format('hh:mm A')} - ${lowestHumidity.data} RH`;
	}

}


function onRoomClicked(roomName, roomId, updateView) {
	currentRoom = roomName;

	const dotsLoaders = document.getElementsByClassName('dotsLoading');
	const defaultRooms = document.getElementsByClassName('defaultRoom');

	$('#forecast-spinner').show();
	$('#forecast-notice').show();
	$('#forecastChart').hide();

	if (updateView) {
		for (let i = 0; i < dotsLoaders.length; i++) {
			dotsLoaders[i].style.display = "inline";
		}

		for (let i = 0; i < defaultRooms.length; i++) {
			defaultRooms[i].style.display = "none";
		}
	}

	// forecast room data;
	onForecastRoom(roomId);

	// Trend's variables
	timeline = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];
	let newPeople = [];
	let newTemperature = [];
	let newHumidity = [];

	// Insight's vatiables
	let highestTemperature = { data: 0, time: null };
	let highestHumidity = { data: 0, time: null };
	let highestPeople = { data: 0, time: null };
	let lowestTemperature = { data: 0, time: null };
	let lowestHumidity = { data: 0, time: null };


	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.response;

			const currentHour = moment().hours();

			timeline = timeline.slice(0, currentHour + 1);

			for (let i = 0; i < timeline.length; i++) {
				newPeople.push(0);
				newTemperature.push(0);
				newHumidity.push(0);
			}

			for (let i = 0; i < result.room.people.length; i++) {
				if (moment(result.room.people[i].time).isSame(new Date(), "day")) {
					const current = moment(result.room.people[i].time).hours();
					if (newPeople[current] != 0) {
						newPeople[current] = Math.round((newPeople[current] + result.room.people[i].data) / 2);
					}
					else {
						newPeople[current] = Math.round(result.room.people[i].data);
					}

					if (result.room.people[i].data > highestPeople.data) {
						highestPeople.data = result.room.people[i].data;
						highestPeople.time = result.room.people[i].time;
					}
				}
			}

			for (let i = 0; i < result.room.temperature.length; i++) {
				if (moment(result.room.temperature[i].time).isSame(new Date(), "day")) {
					const current = moment(result.room.temperature[i].time).hours();

					if (newTemperature[current] != 0) {
						newTemperature[current] = ((Number(newTemperature[current]) + Number(result.room.temperature[i].data)) / 2).toFixed(1);
					}
					else {
						newTemperature[current] = Number(result.room.temperature[i].data).toFixed(1);
					}

					if (result.room.temperature[i].data > highestTemperature.data) {
						highestTemperature.data = result.room.temperature[i].data;
						highestTemperature.time = result.room.temperature[i].time;
					}

					if (lowestTemperature.data == 0) {
						lowestTemperature.data = result.room.temperature[i].data;
						lowestTemperature.time = result.room.temperature[i].time;
					}
					else if (result.room.temperature[i].data < lowestTemperature.data) {
						lowestTemperature.data = result.room.temperature[i].data;
						lowestTemperature.time = result.room.temperature[i].time;
					}
				}
			}


			for (let i = 0; i < result.room.humidity.length; i++) {
				if (moment(result.room.humidity[i].time).isSame(new Date(), "day")) {
					const current = moment(result.room.humidity[i].time).hours();
					if (newHumidity[current] != 0) {
						newHumidity[current] = ((Number(newHumidity[current]) + Number(result.room.humidity[i].data)) / 2).toFixed(1);
					}
					else {
						newHumidity[current] = Number(result.room.humidity[i].data).toFixed(1);
					}

					if (result.room.humidity[i].data > highestHumidity.data) {
						highestHumidity.data = result.room.humidity[i].data;
						highestHumidity.time = result.room.humidity[i].time;
					}

					if (lowestHumidity.data == 0) {
						lowestHumidity.data = result.room.humidity[i].data;
						lowestHumidity.time = result.room.humidity[i].time;
					}
					else if (result.room.humidity[i].data < lowestHumidity.data) {
						lowestHumidity.data = result.room.humidity[i].data;
						lowestHumidity.time = result.room.humidity[i].time;
					}
				}
			}

			dashIngishtsController(highestPeople, highestTemperature, highestHumidity, lowestTemperature, lowestHumidity);

			trendChart.data.datasets[0].data = newPeople;
			trendChart.data.datasets[1].data = newTemperature;
			trendChart.data.datasets[2].data = newHumidity;

			trendChart.data.labels = timeline;

			trendChart.update();

			if (updateView) {
				for (let i = 0; i < dotsLoaders.length; i++) {
					dotsLoaders[i].style.display = "none";
				}

				for (let i = 0; i < defaultRooms.length; i++) {
					defaultRooms[i].style.display = "inline";
				}

				document.getElementById('insightRoom').innerHTML = " - " + roomName;
				document.getElementById('trendRoom').innerHTML = " - " + roomName;
				document.getElementById('forecastRoom').innerHTML = " - " + roomName;
				document.getElementById('viewRoomDetails').href = `/chart/${roomId}`;
				
				setTimeout(function () { 
					$('#forecast-spinner').hide();					
					$('#forecast-notice').hide();
					$('#forecastChart').show();
				}, 15000);

			}

		}
	};

	xhttp.open("GET", `${domain}/api/rooms/${roomId}?period=today`, true);

	xhttp.send();

}


const onForecastRoom = (roomId) => {
	fetch(`${domain}/api/forecast/people?roomId=${roomId}`)
		.then(response => {
			return response.json();
		})
		.then(forecast => {
			console.log(forecast);
			const forecastResults = forecast.result.map(data => Math.round(data));

			forecastChart.data.datasets[0].data = forecastResults;

			forecastChart.update();
		})
		.catch(err => {
			console.log(err);
		});
}

function closeNoticeRow(element) {
	const totalChildCount = document.getElementById('noticeMain').childElementCount;

	const time = element.parentNode.parentNode.getElementsByClassName('noticeTime')[0].innerHTML;

	if (!localStorage.getItem('notifications')) {
		localStorage.setItem("notifications", JSON.stringify([]));
	}

	const notifications = JSON.parse(localStorage.getItem('notifications'));

	for (let i = 0; i < notifications.length; i++) {
		if (notifications[i].noticeTime == time) {
			notifications.splice(i, 1);
			break;
		}
	}

	localStorage.setItem('notifications', JSON.stringify(notifications));

	element.parentNode.parentNode.remove();

	const noticeNum = document.getElementById('noticeNum');
	noticeNum.innerHTML -= 1;

	if (noticeNum.innerHTML == 0) {
		const emptyNotice = document.getElementById('emptyNotice');

		const noticeNum = document.getElementById('noticeNum');
		noticeNum.style.display = "none";

		emptyNotice.style.display = "block";
	}
}


function onClearNotices() {
	localStorage.clear();

	const content = document.getElementById('noticeMain').getElementsByTagName('p');
	const emptyNotice = document.getElementById('emptyNotice');

	for (let i = 0; i < content.length; i++) {
		content[i].style.display = "none";
	}

	const noticeNum = document.getElementById('noticeNum');
	noticeNum.innerHTML = 0;
	noticeNum.style.display = "none";

	emptyNotice.style.display = "block";
}


function horizontalWheelScroll() {
	function scrollHorizontally(e) {
		e = window.event || e;
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		document.getElementById('scrolling-wrapper').scrollLeft -= (delta * 30); // Multiplied by 40
		e.preventDefault();
	}
	if (document.getElementById('scrolling-wrapper').addEventListener) {
		// IE9, Chrome, Safari, Opera
		document.getElementById('scrolling-wrapper').addEventListener("mousewheel", scrollHorizontally, false);
		// Firefox
		document.getElementById('scrolling-wrapper').addEventListener("DOMMouseScroll", scrollHorizontally, false);
	} else {
		// IE 6/7/8
		document.getElementById('scrolling-wrapper').attachEvent("onmousewheel", scrollHorizontally);
	}
}

function onLoadDashboard() {
	showDashboardRooms();
	horizontalWheelScroll();

	$(document).ready(function () {
		$('.your-class').slick({
			infinite: false
		});
	});

	if (sessionStorage.getItem('firstLogin') != 'false') {
		jQuery.noConflict();

		$('#vaModal').modal('show');

		$('#vaModal').on('hidden.bs.modal', function () {
			sessionStorage.setItem('firstLogin', 'false');
		});

		const userId = sessionStorage.getItem('passLoginUserID');

		var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';
		var url = `${domain}/api/users/${userId}`;
		var params = 'mode=firstLogin';

		xhttp.open('PUT', url, true);

		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) { }
		}

		xhttp.send(params);
	}
}

function deleteAllCookies() {
	let cookies = document.cookie.split(";");

	for (let i = 0; i < cookies.length; i++) {
		let cookie = cookies[i];
		let eqPos = cookie.indexOf("=");
		let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
	sessionStorage.clear();
}

function beginWebTour() {
	jQuery.noConflict();

	introJs()
		.setOptions({
			'hidePrev': true,
			'hideNext': true,
			'showBullets': false,
			'showProgress': true,
			'exitOnOverlayClick': false,
			'showStepNumbers': false,
			'tooltipClass': 'intro-tooltip',
			'overlayOpacity': 0.7
		})
		.oncomplete(function () {
			$('#completeTourModal').modal('show');
		})
		.start();

	sessionStorage.setItem('firstLogin', 'false');
}


function onDismissTour() {
	jQuery.noConflict();

	$('#vaModal-deny').modal({
		show: true
	});

	$('#vaModal-deny').on('hidden.bs.modal', function () {
		sessionStorage.setItem('firstLogin', 'false');
	});
}

function onDismissVa() {
	document.getElementById('va-intro-container').style.display = "block";
	document.getElementById('va-conclude-container').style.display = "none";
	document.getElementById('va-primary-footer').style.display = "block";
	document.getElementById('va-secondary-footer').style.display = "none";
}

function beginUserWebTour() {
	jQuery.noConflict();

	introJs()
		.setOptions({
			'hidePrev': true,
			'hideNext': true,
			'showBullets': false,
			'showProgress': true,
			'exitOnOverlayClick': false,
			'showStepNumbers': false,
			'tooltipClass': 'intro-tooltip',
			'overlayOpacity': 0.7
		})
		.oncomplete(function () {
			$('#completeUserTourModal').modal('show');
		})
		.start();

	sessionStorage.setItem('firstLogin', 'false');
}


function onDismissUserTour() {
	jQuery.noConflict();

	$('#vaUserModal-deny').modal({
		show: true
	});

	$('#vaUserModal-deny').on('hidden.bs.modal', function () {
		sessionStorage.setItem('firstLogin', 'false');
	});
}

function beginRoomWebTour() {
	jQuery.noConflict();

	introJs()
		.setOptions({
			'hidePrev': true,
			'hideNext': true,
			'showBullets': false,
			'showProgress': true,
			'exitOnOverlayClick': false,
			'showStepNumbers': false,
			'tooltipClass': 'intro-tooltip',
			'overlayOpacity': 0.7
		})
		.oncomplete(function () {
			$('#completeRoomTourModal').modal('show');
		})
		.start();

	sessionStorage.setItem('firstLogin', 'false');
}


function onDismissRoomTour() {
	jQuery.noConflict();

	$('#vaRoomModal-deny').modal({
		show: true
	});

	$('#vaRoomModal-deny').on('hidden.bs.modal', function () {
		sessionStorage.setItem('firstLogin', 'false');
	});
}

function beginChartWebTour() {
	jQuery.noConflict();

	introJs()
		.setOptions({
			'hidePrev': true,
			'hideNext': true,
			'showBullets': false,
			'showProgress': true,
			'exitOnOverlayClick': false,
			'showStepNumbers': false,
			'tooltipClass': 'intro-tooltip',
			'overlayOpacity': 0.7
		})
		.oncomplete(function () {
			$('#completeChartTourModal').modal('show');
		})
		.start();

	sessionStorage.setItem('firstLogin', 'false');
}


function onDismissChartTour() {
	jQuery.noConflict();

	$('#vaChartModal-deny').modal({
		show: true
	});

	$('#vaChartModal-deny').on('hidden.bs.modal', function () {
		sessionStorage.setItem('firstLogin', 'false');
	});
}

function beginProfileWebTour() {
	jQuery.noConflict();

	introJs()
		.setOptions({
			'hidePrev': true,
			'hideNext': true,
			'showBullets': false,
			'showProgress': true,
			'exitOnOverlayClick': false,
			'showStepNumbers': false,
			'tooltipClass': 'intro-tooltip',
			'overlayOpacity': 0.7
		})
		.oncomplete(function () {
			$('#completeProfileTourModal').modal('show');
		})
		.start();

	sessionStorage.setItem('firstLogin', 'false');
}


function onDismissProfileTour() {
	jQuery.noConflict();

	$('#vaProfileModal-deny').modal({
		show: true
	});

	$('#vaProfileModal-deny').on('hidden.bs.modal', function () {
		sessionStorage.setItem('firstLogin', 'false');
	});
}


// Forecast Chart
let dashForecastChart = document.getElementById('forecastChart').getContext('2d');

let peopleForecast = dashForecastChart.createLinearGradient(500, 0, 100, 0);
peopleForecast.addColorStop(0, "#764ba2");
peopleForecast.addColorStop(1, "#667eea");

let forecastTimeline = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

let forecastData = [];

for (let i = 0; i < forecastTimeline.length; i++) {
	forecastData.push(0);
}

let forecastChart = new Chart(dashForecastChart, {
	// The type of chart we want to create
	type: 'line',

	// The data for our dataset
	data: {
		labels: forecastTimeline,
		datasets: [{
			label: 'No. of People',
			backgroundColor: peopleForecast,
			borderColor: peopleForecast,
			data: forecastData,
			fill: false
		}
		]
	},

	// Configuration options go here
	options: {
		scales: {
			xAxes: [{
				barPercentage: 0.4
			}],
			yAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'Number of people'
				},
				ticks: {
					beginAtZero: true
				}
			}]
		}
	}
});

// simulate real-time update for client testing
function realTimeUpdate()
{
	var msg = [
		{
			roomId: "5d8f019f1c9d44000090f440", 
			name: "Leisure Area",
			people: 0,
			previous: 1,
			temperature: 29.7,
			humidity: 52.2,
			max_capacity: 50,
			highRiskCount: 5
		},
		{
			roomId: "5d935b95ea295d622c1f7e7d", 
			name: "BYOD",
			people: 3,
			previous: 2,
			temperature: 26.8,
			humidity: 59.5,
			max_capacity: 50,
			highRiskCount: 3
		},
		{
			roomId: "5db03ec62040a70a38244de1", 
			name: "24-hours Study Area",
			people: 4,
			previous: 3,
			temperature: 27.3,
			humidity: 65.9,
			max_capacity: 50,
			highRiskCount: 4
		}
	]

	let roomCards = document.getElementsByClassName("roomCard");
	let noticeTime = moment().format('MMM DD, h:mm A');
	let notify_Leisure = false;
	let notify_BYOD = false;
	let notify_Study = false;
	let roomName;
	let roomNameLeisure;
	let roomNameBYOD;
	let roomNameStudy;
	let roomStatusLeisure;
	let roomStatusBYOD;
	let roomStatusStudy;
	let notificationsLeisure;
	let notificationsBYOD;
	let notificationsStudy;
	var count = 0;
	var testUpdate;

	testUpdate = setInterval(function(){  
		var noticeMode = document.getElementById("notificationMode").checked;

		count ++;

		for (let i = 0; i < 3; i++) {

			if(msg[i].people >= 0  && msg[i].people < 30)
			{
				msg[i].people += 1;
			}
			else
			{
				msg[i].people -= 16;
			}

			if(msg[i].previous >= 0  && msg[i].previous <= 30)
			{
				msg[i].previous = msg[i].people - 1;
			}
			else
			{
				msg[i].previous -= 15;
			}

			if(msg[i].temperature >= 14  && msg[i].temperature <= 35)
			{
				msg[i].temperature += 2;
			}
			else
			{
				msg[i].temperature = 20.5;
			}

			if(msg[i].humidity >= 50  && msg[i].humidity <= 75)
			{
				msg[i].humidity += 2;
			}
			else
			{
				msg[i].humidity = 56.2;
			}
			
			let roomId = roomCards[i].getElementsByClassName("roomId");
			let maxCapacity = document.getElementsByClassName('maxCapacity');
			let division = (msg[i].people / parseFloat(maxCapacity[i].innerHTML)) * 50;

			if (roomId[0].innerHTML == msg[i].roomId) {

				document.getElementsByClassName("people")[i].innerHTML = msg[i].people;
				document.getElementsByClassName("temperature")[i].innerHTML = msg[i].temperature;
				document.getElementsByClassName("humidity")[i].innerHTML = msg[i].humidity;
				document.getElementsByClassName("highRisk")[i].innerHTML = msg[i].highRiskCount;
				document.getElementsByClassName('lastUpdatedTime')[i].innerHTML = noticeTime;

				if(noticeMode == false)
				{
					document.getElementsByClassName('high_risk')[i].style.visibility = 'visible';
				}
				else
				{
					document.getElementsByClassName('high_risk')[i].style.visibility = 'hidden';
				}

				// Check this 
				document.getElementsByClassName('status-indicator-outer')[i].style.width = ((parseFloat(maxCapacity[i].innerHTML) - division) / (parseFloat(maxCapacity[i].innerHTML)) * 100) + '%';

			}
		}

		localStorage.setItem("notis_Leisure", JSON.stringify([]));
		localStorage.setItem("notis_BYOD", JSON.stringify([]));
		localStorage.setItem("notis_Study", JSON.stringify([]));

		// Push notifications
		if (!localStorage.getItem('notis_Leisure')) {
			localStorage.setItem("notis_Leisure", JSON.stringify([]));
		}

		if (!localStorage.getItem('notis_BYOD')) {
			localStorage.setItem("notis_BYOD", JSON.stringify([]));
		}

		if (!localStorage.getItem('notis_Study')) {
			localStorage.setItem("notis_Study", JSON.stringify([]));
		}

		if(noticeMode == false)
		{
			if (msg[0].previous <= 18 && msg[0].people > 18) {
				notify_Leisure = true;
				roomStatusLeisure = 'full (COVID-19)';
				roomNameLeisure = 'Leisure Area';
			}
			else if (msg[0].previous <= 12 && msg[0].people > 12) {
				notify_Leisure = true;
				roomStatusLeisure = 'moderate (COVID-19)';
				roomNameLeisure = 'Leisure Area';
			}

			if (msg[1].previous <= 18 && msg[1].people > 18) {
				notify_BYOD = true;
				roomStatusBYOD = 'full (COVID-19)';
				roomNameBYOD = 'BYOD';
			}
			else if (msg[1].previous <= 12 && msg[1].people > 12) {
				notify_BYOD = true;
				roomStatusBYOD = 'moderate (COVID-19)';
				roomNameBYOD = 'BYOD';
			}

			if (msg[2].previous <= 18 && msg[2].people > 18) {
				notify_Study = true;
				roomStatusStudy = 'full (COVID-19)';
				roomNameStudy = '24-hours Study Area';	
			}
			else if (msg[2].previous <= 12 && msg[2].people > 12) {
				notify_Study = true;
				roomStatusStudy = 'moderate (COVID-19)';
				roomNameStudy = '24-hours Study Area';
			}
		} 
		else
		{
			if (msg[0].previous <= 10 && msg[0].people > 10) {
				notify_Leisure = true;
				roomStatusLeisure = 'full';
				roomNameLeisure = 'Leisure Area';
			}
			else if (msg[0].previous <= 5 && msg[0].people > 5) {
				notify_Leisure = true;
				roomStatusLeisure = 'moderate';
				roomNameLeisure = 'Leisure Area';
			}

			if (msg[1].previous <= 10 && msg[1].people > 10) {
				notify_BYOD = true;
				roomStatusBYOD = 'full';
				roomNameBYOD = 'BYOD';	
			}
			else if (msg[1].previous <= 5 && msg[1].people > 5) {
				notify_BYOD = true;
				roomStatusBYOD = 'moderate';
				roomNameBYOD = 'BYOD';	
			}

			if (msg[2].previous <= 10 && msg[2].people > 10) {
				notify_Study = true;
				roomStatusStudy = 'full';
				roomNameStudy = '24-hours Study Area';
			}
			else if (msg[2].previous <= 5 && msg[2].people > 5) {
				notify_Study = true;
				roomStatusStudy = 'moderate';
				roomNameStudy = '24-hours Study Area';
			}
		}
		
		if (notify_Leisure) {
			notificationsLeisure = JSON.parse(localStorage.getItem('notis_Leisure'));

			notificationsLeisure.push({ noticeTime, roomNameLeisure, roomStatusLeisure });

			$('#noticeMain').prepend(`<div class="noticeContainer"><p class="m-0 noticeTime">${noticeTime}</p><p style="font-size:0.9rem;">${roomNameLeisure} has reached <strong>${roomStatusLeisure}</strong> capacity.
					<button onclick="closeNoticeRow(this)" type="button" class="close closeBtn mr-3" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</p></div>`);

			document.getElementById('emptyNotice').style.display = "none";

			const noticeNum = document.getElementById('noticeNum');
			noticeNum.innerHTML = Number(noticeNum.innerHTML) + 1;
			noticeNum.style.display = "inline";

			localStorage.setItem('notis_Leisure', JSON.stringify(notificationsLeisure));
		}

		if (notify_BYOD) {
			notificationsBYOD = JSON.parse(localStorage.getItem('notis_BYOD'));

			notificationsBYOD.push({ noticeTime, roomNameBYOD, roomStatusBYOD });

			$('#noticeMain').prepend(`<div class="noticeContainer"><p class="m-0 noticeTime">${noticeTime}</p><p style="font-size:0.9rem;">${roomNameBYOD} has reached <strong>${roomStatusBYOD}</strong> capacity.
					<button onclick="closeNoticeRow(this)" type="button" class="close closeBtn mr-3" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</p></div>`);

			document.getElementById('emptyNotice').style.display = "none";

			const noticeNum = document.getElementById('noticeNum');
			noticeNum.innerHTML = Number(noticeNum.innerHTML) + 1;
			noticeNum.style.display = "inline";

			localStorage.setItem('notis_BYOD', JSON.stringify(notificationsBYOD));
		}

		if (notify_Study) {
			notificationsStudy = JSON.parse(localStorage.getItem('notis_Study'));

			notificationsStudy.push({ noticeTime, roomNameStudy, roomStatusStudy });

			$('#noticeMain').prepend(`<div class="noticeContainer"><p class="m-0 noticeTime">${noticeTime}</p><p style="font-size:0.9rem;">${roomNameStudy} has reached <strong>${roomStatusStudy}</strong> capacity.
					<button onclick="closeNoticeRow(this)" type="button" class="close closeBtn mr-3" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</p></div>`);

			document.getElementById('emptyNotice').style.display = "none";

			const noticeNum = document.getElementById('noticeNum');
			noticeNum.innerHTML = Number(noticeNum.innerHTML) + 1;
			noticeNum.style.display = "inline";

			localStorage.setItem('notis_Study', JSON.stringify(notificationsStudy));

			if(count == 20)
			{
				clearInterval(testUpdate);
			}
		}

	}, 5000);

}

function showHideRoomID()
{
	document.getElementById("showRoom").innerHTML = "";
	var table = document.getElementById("showRoom").innerHTML;
	table = showRoomTable();
}

function showCurrentUser()
{
	var userName = document.getElementById('userName');

	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {

			var result = this.response;
		
			for (var user in result.users) {

				if(result.users[user]._id == sessionStorage.getItem("passLoginUserID"))
				{
					userName.innerHTML = '&nbsp;&nbsp;' + result.users[user].username;
				}
			};
		}
	};

	xhttp.open("GET", `${domain}/api/users`, true);
	xhttp.send();

	$('#profileSpinner').hide();
	$("#changePasswordAlert").hide();
	$("#profileResultAlert").hide();
}

function showProfileDetails()
{
	var name = document.getElementById('profileUserName');
	var role = document.getElementById('profileUserRole');
	var email = document.getElementById('profileUserEmail');
	var profileTitle = document.getElementById('profileTitle');

	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {

			var result = this.response;
		
			for (var user in result.users) {

				if(result.users[user]._id == sessionStorage.getItem("passLoginUserID"))
				{
					profileTitle.innerHTML = result.users[user].username + "'s" + '&nbsp;&nbsp;' + 'Profile';
					name.innerHTML = result.users[user].username;
					role.innerHTML = result.users[user].role;
					email.innerHTML = result.users[user].email;
				}
			};
		}
	};

	xhttp.open("GET", `${domain}/api/users`, true);
	xhttp.send();
}

function changePassword()
{
	$("#profileSpinner").show();

	if (document.getElementById("newPassword").value !== document.getElementById("confirmNewPassword").value) {
		$("#profileSpinner").hide();

		document.getElementById("changePasswordAlert").innerHTML = '<strong>Your new password and confirm new password is not the same.\nPlease enter again!!</strong> <button type="button" class="close" onclick="closeProfileAlert()"><span>&times;</span></button>';
		$("#changePasswordAlert").show();
	}

	CheckProfileChangePassword(document.getElementById("confirmNewPassword"));

	if (document.getElementById("confirmNewPassword").value === "") {
		$("#profileSpinner").hide();

		document.getElementById("changePasswordAlert").innerHTML = '<strong>Please fill in your confirm new password!!</strong> <button type="button" class="close" onclick="closeProfileAlert()"><span>&times;</span></button>';
		$("#changePasswordAlert").show();
	}

	CheckProfileChangePassword(document.getElementById("newPassword"));

	if (document.getElementById("newPassword").value === "") {
		$("#profileSpinner").hide();

		document.getElementById("changePasswordAlert").innerHTML = '<strong>Please fill in your new password!!</strong> <button type="button" class="close" onclick="closeProfileAlert()"><span>&times;</span></button>';
		$("#changePasswordAlert").show();
	}

	if (document.getElementById("newPassword").value !== ""
		&& document.getElementById("confirmNewPassword").value !== ""
		&& document.getElementById("newPassword").value === document.getElementById("confirmNewPassword").value
		&& CheckProfileChangePassword(document.getElementById("newPassword")) === true
		&& CheckProfileChangePassword(document.getElementById("confirmNewPassword")) === true) {
		var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';

		var url = `${domain}/api/users/changePassword`;

		var password = document.getElementById("newPassword").value;
		var id = sessionStorage.getItem("passLoginUserID");

		var params = `id=${id}&newPassword=${password}`;

		xhttp.open('POST', url, true);

		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				if (xhttp.response.message == 'Successfully change password') {
					$("#profileSpinner").hide();

					var element = document.getElementById("profileResultAlert");
					element.classList.remove("alert-danger")
					element.classList.add("alert-success");

					jQuery.noConflict();
					$('#changePasswordModal').modal('hide');

					document.getElementById("profileResultAlert").innerHTML = '<strong>Successfully change password</strong> <button type="button" class="close" onclick="closeProfileResultAlert()"><span>&times;</span></button>';
					$("#profileResultAlert").show();

					document.getElementById("profileNewPasswordHint").innerHTML = '';
					document.getElementById("profileNewConfirmPasswordHint").innerHTML = '';
					document.getElementById("newPassword").value = '';
					document.getElementById("confirmNewPassword").value = '';
				}
			}

			if (xhttp.readyState == 4 && xhttp.status == 404) {
				$("#profileSpinner").hide();

				document.getElementById("profileResultAlert").innerHTML = '<strong>Failed to change password.\nPlease try again.</strong> <button type="button" class="close" onclick="closeProfileResultAlert()"><span>&times;</span></button>';
				$("#profileResultAlert").show();

				jQuery.noConflict();
				$('#changePasswordModal').modal('hide');

			}

			if (xhttp.readyState == 4 && xhttp.status == 500) {
				$("#profileSpinner").hide();

				document.getElementById("profileResultAlert").innerHTML = '<strong>Failed to change password due to internal server error.\n Please try again later.</strong> <button type="button" class="close" onclick="closeProfileResultAlert()"><span>&times;</span></button>';
				$("#profileResultAlert").show();

				jQuery.noConflict();
				$('#changePasswordModal').modal('hide');
			}
		}

		xhttp.send(params);
	}

}

function profileNewpsdHint() {
	if (document.getElementById("newPassword").value === '') {
		document.getElementById("profileNewPasswordHint").innerHTML = '*8-12 character, one uppercase, one lowercase and one numeric digit';
	}
}

function profileNewconfirmpsdHint() {
	if (document.getElementById("confirmNewPassword").value === '') {
		document.getElementById("profileNewConfirmPasswordHint").innerHTML = '*8-12 character, one uppercase, one lowercase and one numeric digit';
	}
}

function CheckProfileChangePassword(input) {
	var validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;

	if (input.value.match(validPassword)) {
		return true;
	}
	else {
		var element = document.getElementById("changePasswordAlert");
		element.classList.add("alert-danger");

		document.getElementById("changePasswordAlert").innerHTML = '<strong>Your New Password or Confirm New Password is invalid. Please enter a password which contain 8 to 12 character, at least one numeric digit, one uppercase and one lowercase letter!</strong> <button type="button" class="close" onclick="closeProfileAlert()"><span>&times;</span></button>';
		$("#changePasswordAlert").show();
		$("#profileSpinner").hide();

		return false;

	}
};

function ValidateEmail(input) {
	var emailformat = /^\w+([\.-]?\w+)*@swinburne.edu.my/;

	if (input.value.match(emailformat)) {
		return true;
	}
	else {
		var element = document.getElementById("userAlert");
		element.classList.add("alert-danger");

		document.getElementById("userAlert").innerHTML = '<strong>You have entered an invalid email address. Please use Swinburne email to register!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
		$("#userAlert").show();

		return false;

	}
};