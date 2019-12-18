const domain = 'http://localhost:3000';
// const domain = 'https://roomoccupancy.herokuapp.com';

var socket = io();

let currentRoom;

socket.on("people", function(msg) {
	// for loop assign to all room their respective sensor data
	let roomCards = document.getElementsByClassName("roomCard");
	let noticeMain = document.getElementById('noticeMain');
	let noticeTime = moment().format('MMM DD, h:mm A');
	let notify = false;
	let addToNotifications = true;
	let outerRoomId;
	let roomName;
	let roomStatus;
	let notifications;
	
	for (let i = 0; i < roomCards.length; i++) {
		let roomId = roomCards[i].getElementsByClassName("roomId");

		// change 0 to i later
		if (roomId[0].innerHTML == msg.roomId) {
			outerRoomId = msg.roomId;

			document.getElementsByClassName("people")[i].innerHTML = msg.people;
			document.getElementsByClassName('lastUpdatedTime')[i].innerHTML = noticeTime;
			roomName = document.getElementsByClassName("roomName")[i].innerHTML;
		}
	}

	// Push notifications
	if (!localStorage.getItem('notifications')) {
		localStorage.setItem("notifications", JSON.stringify([]));
	}

	if (msg.people > 10) {
		notify = true;
		roomStatus = 'full';
	}
	else if (msg.people > 5) {
		notify = true;
		roomStatus = 'moderate';
	}

	if (notify) {
			notifications = JSON.parse(localStorage.getItem('notifications'));

			if (notifications.length > 0) {
				for (let j=0; j<notifications.length; j++) {
					if (roomName == notifications[j].roomName && roomStatus == notifications[j].roomStatus) {
						addToNotifications = false;
					}
				}
			}
			
			if (addToNotifications) {
				notifications.push({noticeTime, roomName, roomStatus});

				noticeMain.innerHTML += `<div class="noticeContainer"><p class="m-0 noticeTime">${noticeTime}</p><p style="font-size:0.9rem;">${roomName} has reached <strong>${roomStatus}</strong> capacity.
					<button onclick="closeNoticeRow(this)" type="button" class="close closeBtn mr-3" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</p></div>`;

				document.getElementById('emptyNotice').style.display = "none";

				const noticeNum = document.getElementById('noticeNum');
				noticeNum.innerHTML = Number(noticeNum.innerHTML) + 1;
				noticeNum.style.display = "inline";
			}	
			
			localStorage.setItem('notifications', JSON.stringify(notifications));
		}

		if (currentRoom == roomName) {
			onUpdateTrend(outerRoomId, roomName);
		}
	});


socket.on("sensor", function(msg) {
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

	var content = null,
	$element = $("#choosenRange");

	setInterval(function() {
			var currentText = $element.text();

			if (currentText != content) {
					document.getElementById("pdfButton").disabled = true;
					// A change has happened
					content = currentText;
					let charts = Highcharts.charts;
					charts.splice(0,charts.length);
					document.getElementById("allChart").innerHTML = '<div class="d-flex h-100 justify-content-center"><div class="align-self-center"><div class="spinner-border text-danger" style="width:3rem; height:3rem;"><span class="sr-only">Loading...</span></div></div></div>';
					xhrChart(roomId);
					charts.splice(0,charts.length);
			}
	}, 500 /* check every 30 seconds */);

	var content2 = null,
	$element2 = $("#choosenTimeRange");

	setInterval(function() {
			var currentText2 = $element2.text();

			if (currentText2 != content2) {
					document.getElementById("pdfButton").disabled = true;
					// A change has happened
					content2 = currentText2;
					let charts = Highcharts.charts;
					charts.splice(0,charts.length);
					document.getElementById("allChart").innerHTML = '<div class="d-flex h-100 justify-content-center"><div class="align-self-center"><div class="spinner-border text-danger" style="width:3rem; height:3rem;"><span class="sr-only">Loading...</span></div></div></div>';
					xhrChart(roomId);
					charts.splice(0,charts.length);
			}
	}, 500 /* check every 30 seconds */);

	
  // $('.choosenRange').val().change(function() {
	// 	let charts = Highcharts.charts;
	// 	charts.splice(0,charts.length);
	// 	document.getElementById("allChart").innerHTML = '<div class="d-flex h-100 justify-content-center"><div class="align-self-center"><div class="spinner-border text-danger" style="width:3rem; height:3rem;"><span class="sr-only">Loading...</span></div></div></div>';
		
	// 	xhrChart(roomId);
	// 	charts.splice(0,charts.length);
	// });
};

function xhrChart(roomId){
	var dateRange = document.getElementById("choosenRange").innerHTML.toString();
	var timeRange = document.getElementById("choosenTimeRange").innerHTML.toString();
	var startDate = new Date(dateRange.substring(0, 10));
	var endDate = new Date(dateRange.substring(13, 23));
	var diff_in_days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
	var startTime = timeRange.substring(0,5);
	var endTime = timeRange.substring(8, 13);
	var diff_in_time = parseInt(endTime.substring(0,2)) - parseInt(startTime.substring(0,2));

	var peopleData = []; // people data
	var peopleDataCounter = []; // people data counter
	var tempData = []; // temp data
	var tempDataCounter = []; // temp data counter
	var humidData = []; // humidity data
	var humidDataCounter = []; // humidity data counter
	var hourTime = [];

	for (var i=0; i<=diff_in_time;i++){
		var timeCounter = parseInt(startTime.substring(0,2)) + i;
		hourTime.push(timeCounter.toString().concat(':00'));
	}
		
//  	var dailyTime = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var dailyTime = [];
	//var weeklyTime = ['Week 1', 'Week 2','Week 3', 'Week 4'];
	var weeklyTime = [];
	//var monthlyTime = ['January', 'February','March','April','May','June','July','August','September','Octorber','November','December'];
	var monthlyTime = [];
	
	let room_name_found = false;
    var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var result = this.response;
        var checkDay;
        var high_ppl_data, low_ppl_data, high_ppl_index, low_ppl_index, high_ppl_date, low_temp_date, high_temp_data, low_temp_data, high_temp_index, low_temp_index, high_temp_date, low_temp_date, high_humid_data, low_humid_data, high_humid_index, low_humid_index, high_humid_date, low_humid_date;

        for (var room in result.rooms) {
          if (result.rooms[room]._id == roomId) {
			  			if (room_name_found == false) {
							document.getElementById("room_name").innerHTML = result.rooms[room].name;
							room_name_found = true;
						}
						  
						//Today Chart
						if(diff_in_days == 0){
							//Initialise the array
							for(var i=0; i<hourTime.length; i++){
								peopleData[i] = 0;
								peopleDataCounter[i] = 0;
								tempData[i] = 0;
								tempDataCounter[i] = 0;
								humidData[i] = 0;
								humidDataCounter[i] = 0;
							}
							
							//People Chart
							for(var index in result.rooms[room].people){
								var dataDate = new Date(result.rooms[room].people[index].time);
								if((dataDate.getUTCDate() == startDate.getDate())){
									for(var i=0; i<hourTime.length;i++){
										if(dataDate.getUTCHours().toString().concat(':00') == hourTime[i]){
											peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
											peopleDataCounter[i] ++;
										}
									}
								}
							}
							
							//Temperature Chart
							for(var index in result.rooms[room].temperature) {
								var dataDate = new Date(result.rooms[room].temperature[index].time);
								if((dataDate.getUTCDate() == startDate.getDate())){
									for(var i=0; i<hourTime.length;i++){
										if(dataDate.getUTCHours().toString().concat(':00') == hourTime[i]){
											tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
											tempDataCounter[i] ++;
										}
									}
								}
							}
							
							//Humidity Chart
							for(var index in result.rooms[room].humidity) {
								var dataDate = new Date(result.rooms[room].humidity[index].time);
								if((dataDate.getUTCDate() == startDate.getDate())){
									for(var i=0; i<hourTime.length; i++){
										if(dataDate.getUTCHours().toString().concat(':00') == hourTime[i]){
											humidData[i] = humidData[i] + result.rooms[room].humidity[index].data;
											humidDataCounter[i] ++;
										}
									}
								}
							}
							
							//Get the average for each data in the time
							for(var i=0; i<peopleData.length; i++){
								peopleData[i] = Math.round((peopleData[i]/peopleDataCounter[i]) * 100) / 100;
							}
							
							for(var i=0; i<tempData.length; i++){
								tempData[i] = Math.round((tempData[i]/tempDataCounter[i]) * 10) / 10;
							}
							
							for(var i=0; i<humidData.length; i++){
								humidData[i] = Math.round((humidData[i]/humidDataCounter[i]) * 100) / 100;
							}
							
                            checkDay = 0;
                            sessionStorage.setItem("checkDay", checkDay);
                            
                            high_ppl_data = Math.max.apply(Math, (peopleData.filter(v => !isNaN(v))));
                            
                            if(high_ppl_data == "-Infinity")
                            {
                                sessionStorage.setItem("todayPeopleHighestData","N/A");
                                sessionStorage.setItem("todayPeopleHighestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("todayPeopleHighestData",high_ppl_data);
                                high_ppl_index = peopleData.indexOf(high_ppl_data);
                                high_ppl_date = hourTime[high_ppl_index];
                                sessionStorage.setItem("todayPeopleHighestDate", high_ppl_date);
                            }
                            
                            low_ppl_data = Math.min.apply(Math, (peopleData.filter(v => !isNaN(v))));
                            
                            if(low_ppl_data == "Infinity")
                            {
                                sessionStorage.setItem("todayPeopleLowestData","N/A");
                                sessionStorage.setItem("todayPeopleLowestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("todayPeopleLowestData",low_ppl_data);
                                low_ppl_index = peopleData.indexOf(low_ppl_data);
                                lowppldate = hourTime[low_ppl_index];
                                sessionStorage.setItem("todayPeopleLowestDate", lowppldate);
                            }
                            
                            high_temp_data = Math.max.apply(Math, (tempData.filter(v => !isNaN(v))));
                            
                            if(high_temp_data == "-Infinity")
                            {
                                sessionStorage.setItem("todayTempHighestData","N/A");
                                sessionStorage.setItem("todayTempHighestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("todayTempHighestData",high_temp_data);
                                high_temp_index = tempData.indexOf(high_temp_data);
                                high_temp_date = hourTime[high_temp_index];
                                sessionStorage.setItem("todayTempHighestDate", high_temp_date);
                            }
                            
                            low_temp_data = Math.min.apply(Math, (tempData.filter(v => !isNaN(v))));
                            
                            if(low_temp_data == "Infinity")
                            {
                                sessionStorage.setItem("todayTempLowestData","N/A");
                                sessionStorage.setItem("todayTempLowestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("todayTempLowestData",low_temp_data);
                                low_temp_index = tempData.indexOf(low_temp_data);
                                low_temp_date = hourTime[low_temp_index];
                                sessionStorage.setItem("todayTempLowestDate", low_temp_date);
                            }
                            
                            high_humid_data = Math.max.apply(Math, (humidData.filter(v => !isNaN(v))));
                            
                            if(high_humid_data == "-Infinity")
                            {
                                sessionStorage.setItem("todayHumidHighestData","N/A");
                                sessionStorage.setItem("todayHumidHighestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("todayHumidHighestData",high_humid_data);
                                high_humid_index = humidData.indexOf(high_humid_data);
                                high_humid_date = hourTime[high_humid_index];
                                sessionStorage.setItem("todayHumidHighestDate", high_humid_date);
                            }
                            
                            low_humid_data = Math.min.apply(Math, (humidData.filter(v => !isNaN(v))));
                            
                            if(low_humid_data == "Infinity")
                            {
                                sessionStorage.setItem("todayHumidLowestData","N/A");
                                sessionStorage.setItem("todayHumidLowestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("todayHumidLowestData",low_humid_data);
                                low_humid_index = humidData.indexOf(low_humid_data);
                                low_humid_date = hourTime[low_humid_index];
                                sessionStorage.setItem("todayHumidLowestDate", low_humid_date);
                            }
                            
							showAllChart(hourTime,peopleData,tempData,humidData);
							showPeopleChart(hourTime, peopleData); //Illustrate the chart
							showTemperatureChart(hourTime, tempData); //Illustrate the chart
							showHumidityChart(hourTime, humidData); //Illustrate the chart
							document.getElementById("pdfButton").disabled = false;

						}
						
						//Daily Chart
						if(diff_in_days > 0 && diff_in_days <= 6){
							var start = startDate.getDate();

							//Initialise the dailyTime array
							for(var i=0; i<diff_in_days+1; i++){
								dailyTime[i] = start;
								start ++;
							}
							
							//Initialise the data array
							for(var i=0; i<dailyTime.length; i++){
								peopleData[i] = 0;
								peopleDataCounter[i] = 0;
								tempData[i] = 0;
								tempDataCounter[i] = 0;
								humidData[i] = 0;
								humidDataCounter[i] = 0;
							}
							
							//People Chart
							for(var index in result.rooms[room].people) {
								var dataDate = new Date(result.rooms[room].people[index].time);
								if(dataDate >= startDate && dataDate <= endDate){
									if(dataDate.getUTCHours() >= parseInt(startTime.substring(0,2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0,2))){
										for(var i=0; i<dailyTime.length;i++){
											if(dataDate.getUTCDate() == dailyTime[i]){
												peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
												peopleDataCounter[i] ++;
											}
										}
									}
								}
							}
							
							//Temperature Chart
							for(var index in result.rooms[room].temperature) {
								var dataDate = new Date(result.rooms[room].temperature[index].time);
								if(dataDate >= startDate && dataDate <= endDate){
									if(dataDate.getUTCHours() >= parseInt(startTime.substring(0,2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0,2))){
										for(var i=0; i<dailyTime.length;i++){
											if(dataDate.getUTCDate() == dailyTime[i]){
												tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
												tempDataCounter[i] ++;
											}
										}
									}
								}
							}
							
							//Humidity Chart
							for(var index in result.rooms[room].humidity) {
								var dataDate = new Date(result.rooms[room].humidity[index].time);
								if(dataDate >= startDate && dataDate <= endDate){
									if(dataDate.getUTCHours() >= parseInt(startTime.substring(0,2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0,2))){
										for(var i=0; i<dailyTime.length; i++){
											if(dataDate.getUTCDay() == dailyTime[i]){
												humidData[i] = humidData[i] + result.rooms[room].humidity[index].data;
												humidDataCounter[i] ++;
											}
										}
									}
								}
							}
							
							//Get the average for each data in the time
							for(var i=0; i<peopleData.length; i++){
								peopleData[i] = ((peopleData[i]/peopleDataCounter[i]) | 0);
							}
							
							for(var i=0; i<tempData.length; i++){
								tempData[i] = Math.round((tempData[i]/tempDataCounter[i]) * 10) / 10;
							}
							
							for(var i=0; i<humidData.length; i++){
								humidData[i] = Math.round((humidData[i]/humidDataCounter[i]) | 0);
							}
							
							//Convert the day to string day
						  for(var i=0; i<dailyTime.length; i++){
								if(startDate <= endDate){
									if(startDate.getDay() == 0){
										dailyTime[i] = "Sunday";
									}
									if(startDate.getDay() == 1){
										dailyTime[i] = "Monday";
									}
									if(startDate.getDay() == 2){
										dailyTime[i] = "Tuesday";
									}
									if(startDate.getDay() == 3){
										dailyTime[i] = "Wednesday";
									}
									if(startDate.getDay() == 4){
										dailyTime[i] = "Thursday";
									}
									if(startDate.getDay() == 5){
										dailyTime[i] = "Friday";
									}
									if(startDate.getDay() == 6){
										dailyTime[i] = "Saturday";
									}
									startDate.setDate(startDate.getDate()+1);
								}
							}
							
                            checkDay = 1;
                            sessionStorage.setItem("checkDay", checkDay);
                            
                            high_ppl_data = Math.max.apply(Math, (peopleData.filter(v => !isNaN(v))));
                            
                            if(high_ppl_data == "-Infinity")
                            {
                                sessionStorage.setItem("dailyPeopleHighestData","N/A");
                                sessionStorage.setItem("dailyPeopleHighestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("dailyPeopleHighestData",high_ppl_data);
                                high_ppl_index = peopleData.indexOf(high_ppl_data);
                                high_ppl_date = dailyTime[high_ppl_index];
                                sessionStorage.setItem("dailyPeopleHighestDate", high_ppl_date);
                            }
                            
                            low_ppl_data = Math.min.apply(Math, (peopleData.filter(v => !isNaN(v))));
                            
                            if(low_ppl_data == "Infinity")
                            {
                                sessionStorage.setItem("dailyPeopleLowestData","N/A");
                                sessionStorage.setItem("dailyPeopleLowestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("dailyPeopleLowestData",low_ppl_data);
                                low_ppl_index = peopleData.indexOf(low_ppl_data);
                                lowppldate = dailyTime[low_ppl_index];
                                sessionStorage.setItem("dailyPeopleLowestDate", lowppldate);
                            }
                            
                            high_temp_data = Math.max.apply(Math, (tempData.filter(v => !isNaN(v))));
                            
                            if(high_temp_data == "-Infinity")
                            {
                                sessionStorage.setItem("dailyTempHighestData","N/A");
                                sessionStorage.setItem("dailyTempHighestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("dailyTempHighestData",high_temp_data);
                                high_temp_index = tempData.indexOf(high_temp_data);
                                high_temp_date = dailyTime[high_temp_index];
                                sessionStorage.setItem("dailyTempHighestDate", high_temp_date);
                            }
                            
                            low_temp_data = Math.min.apply(Math, (tempData.filter(v => !isNaN(v))));
                            
                            if(low_temp_data == "Infinity")
                            {
                                sessionStorage.setItem("dailyTempLowestData","N/A");
                                sessionStorage.setItem("dailyTempLowestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("dailyTempLowestData",low_temp_data);
                                low_temp_index = tempData.indexOf(low_temp_data);
                                low_temp_date = dailyTime[low_temp_index];
                                sessionStorage.setItem("dailyTempLowestDate", low_temp_date);
                            }
                            
                            high_humid_data = Math.max.apply(Math, (humidData.filter(v => !isNaN(v))));
                            
                            if(high_humid_data == "-Infinity")
                            {
                                sessionStorage.setItem("dailyHumidHighestData","N/A");
                                sessionStorage.setItem("dailyHumidHighestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("dailyHumidHighestData",high_humid_data);
                                high_humid_index = humidData.indexOf(high_humid_data);
                                high_humid_date = dailyTime[high_humid_index];
                                sessionStorage.setItem("dailyHumidHighestDate", high_humid_date);
                            }
                            
                            low_humid_data = Math.min.apply(Math, (humidData.filter(v => !isNaN(v))));
                            
                            if(low_humid_data == "Infinity")
                            {
                                sessionStorage.setItem("dailyHumidLowestData","N/A");
                                sessionStorage.setItem("dailyHumidLowestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("dailyHumidLowestData",low_humid_data);
                                low_humid_index = humidData.indexOf(low_humid_data);
                                low_humid_date = dailyTime[low_humid_index];
                                sessionStorage.setItem("dailyHumidLowestDate", low_humid_date);
                            }
                            
							showAllChart(dailyTime,peopleData,tempData,humidData);
							showPeopleChart(dailyTime, peopleData); //Illustrate the chart
							showTemperatureChart(dailyTime, tempData); //Illustrate the chart
							showHumidityChart(dailyTime, humidData); //Illustrate the chart
							document.getElementById("pdfButton").disabled = false;

						}
							
						//Weekly Chart
						if(diff_in_days > 6 && diff_in_days <= 30){
							
							var tempStart = new Date(dateRange.substring(0, 10));

							//Initialise the weeklyTime array
							for(var i=0; i< Math.ceil((diff_in_days+1)/7); i++){
								if(tempStart <= endDate){
									if(tempStart.getDate() >= 1 && tempStart.getDate() <= 7){
										weeklyTime[i] = "Week 1";
									}
									if(tempStart.getDate() >= 8 && tempStart.getDate() <= 14){
										weeklyTime[i] = "Week 2";
									}
									if(tempStart.getDate() >= 15 && tempStart.getDate() <= 21){
										weeklyTime[i] = "Week 3";
									}
									if(tempStart.getDate() >= 22 && tempStart.getDate() <= 28){
										weeklyTime[i] = "Week 4";
									}
									if(tempStart.getDate() >= 29 && tempStart.getDate() <= 31){
										weeklyTime[i] = "Week 5";
									}
									
									tempStart.setDate(tempStart.getDate()+7);
								}
							}
							
							//Initialise the array
							for(var i=0; i<weeklyTime.length; i++){
								peopleData[i] = 0;
								peopleDataCounter[i] = 0;
								tempData[i] = 0;
								tempDataCounter[i] = 0;
								humidData[i] = 0;
								humidDataCounter[i] = 0;
							}
							
							//People Chart
							for(var index in result.rooms[room].people) {
								var dataDate = new Date(result.rooms[room].people[index].time);
								if(dataDate >= startDate && dataDate <= endDate){
									if(dataDate.getUTCHours() >= parseInt(startTime.substring(0,2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0,2))){
										for(var i=0; i<weeklyTime.length;i++){
											if(dataDate.getUTCDate() >= 1 && dataDate.getUTCDate() <= 7 && weeklyTime[i] == 'Week 1'){
												peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
												peopleDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 8 && dataDate.getUTCDate() <= 14 && weeklyTime[i] == 'Week 2'){
												peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
												peopleDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 15 && dataDate.getUTCDate() <= 21 && weeklyTime[i] == 'Week 3'){
												peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
												peopleDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 22  && dataDate.getUTCDate() <= 28 && weeklyTime[i] == 'Week 4'){
												peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
												peopleDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 29  && dataDate.getUTCDate() <= 31 && weeklyTime[i] == 'Week 5'){
												peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
												peopleDataCounter[i] ++;
											}
										}
									}
								}
							}
							
							//Temperature Chart
							for(var index in result.rooms[room].temperature) {
								var dataDate = new Date(result.rooms[room].temperature[index].time);
									if(dataDate >= startDate && dataDate <= endDate){
										if(dataDate.getUTCHours() >= parseInt(startTime.substring(0,2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0,2))){
											for(var i=0; i<weeklyTime.length;i++){
												if(dataDate.getUTCDate() >= 1 && dataDate.getUTCDate() <= 7 && weeklyTime[i] == 'Week 1'){
													tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
													tempDataCounter[i] ++;
												}
												if(dataDate.getUTCDate() >= 8 && dataDate.getUTCDate() <= 14 && weeklyTime[i] == 'Week 2'){
													tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
													tempDataCounter[i] ++;
												}
												if(dataDate.getUTCDate() >= 15 && dataDate.getUTCDate() <= 21 && weeklyTime[i] == 'Week 3'){
													tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
													tempDataCounter[i] ++;
												}
												if(dataDate.getUTCDate() >= 22  && dataDate.getUTCDate() <= 28 && weeklyTime[i] == 'Week 4'){
													tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
													tempDataCounter[i] ++;
												}
												if(dataDate.getUTCDate() >= 29  && dataDate.getUTCDate() <= 31 && weeklyTime[i] == 'Week 5'){
													tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
													tempDataCounter[i] ++;
												}
											}
										}
									}
							}
							
							//Humidity Chart
							for(var index in result.rooms[room].humidity) {
								var dataDate = new Date(result.rooms[room].humidity[index].time);
									if(dataDate >= startDate && dataDate <= endDate){
										if(dataDate.getUTCHours() >= parseInt(startTime.substring(0,2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0,2))){
											for(var i=0; i<weeklyTime.length; i++){
												for(var i=0; i<weeklyTime.length;i++){
													if(dataDate.getUTCDate() >= 1 && dataDate.getUTCDate() <= 7 && weeklyTime[i] == 'Week 1'){
														humidData[i] = humidData[i] + result.rooms[room].humidity[index].data;
														humidDataCounter[i] ++;
													}
													if(dataDate.getUTCDate() >= 8 && dataDate.getUTCDate() <= 14 && weeklyTime[i] == 'Week 2'){
														humidData[i] = humidData[i] + result.rooms[room].humidity[index].data;
														humidDataCounter[i] ++;
													}
													if(dataDate.getUTCDate() >= 15 && dataDate.getUTCDate() <= 21 && weeklyTime[i] == 'Week 3'){
														humidData[i] = humidData[i] + result.rooms[room].humidity[index].data;
														humidDataCounter[i] ++;
													}
													if(dataDate.getUTCDate() >= 22  && dataDate.getUTCDate() <= 28 && weeklyTime[i] == 'Week 4'){
														humidData[i] = humidData[i] + result.rooms[room].humidity[index].data;
														humidDataCounter[i] ++;
													}
													if(dataDate.getUTCDate() >= 29  && dataDate.getUTCDate() <= 31 && weeklyTime[i] == 'Week 5'){
														humidData[i] = humidData[i] + result.rooms[room].humidity[index].data;
														humidDataCounter[i] ++;
													}
												}
											}
										}
									}
							}
							
							//Get the average for each data in the time
							for(var i=0; i<peopleData.length; i++){
								peopleData[i] = ((peopleData[i]/peopleDataCounter[i]) | 0);
							}
							
							for(var i=0; i<tempData.length; i++){
								tempData[i] = Math.round((tempData[i]/tempDataCounter[i]) * 10) / 10;
							}
							
							for(var i=0; i<humidData.length; i++){
								humidData[i] = Math.round((humidData[i]/humidDataCounter[i]) | 0);
							}
							
                            checkDay = 2;
                            sessionStorage.setItem("checkDay", checkDay);
                            
                            high_ppl_data = Math.max.apply(Math, (peopleData.filter(v => !isNaN(v))));
                            
                            if(high_ppl_data == "-Infinity")
                            {
                                sessionStorage.setItem("weeklyPeopleHighestData","N/A");
                                sessionStorage.setItem("weeklyPeopleHighestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("weeklyPeopleHighestData",high_ppl_data);
                                high_ppl_index = peopleData.indexOf(high_ppl_data);
                                high_ppl_date = weeklyTime[high_ppl_index];
                                sessionStorage.setItem("weeklyPeopleHighestDate", high_ppl_date);
                            }
                            
                            low_ppl_data = Math.min.apply(Math, (peopleData.filter(v => !isNaN(v))));
                            
                            if(low_ppl_data == "Infinity")
                            {
                                sessionStorage.setItem("weeklyPeopleLowestData","N/A");
                                sessionStorage.setItem("weeklyPeopleLowestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("weeklyPeopleLowestData",low_ppl_data);
                                low_ppl_index = peopleData.indexOf(low_ppl_data);
                                lowppldate = weeklyTime[low_ppl_index];
                                sessionStorage.setItem("weeklyPeopleLowestDate", lowppldate);
                            }
                            
                            high_temp_data = Math.max.apply(Math, (tempData.filter(v => !isNaN(v))));
                            
                            if(high_temp_data == "-Infinity")
                            {
                                sessionStorage.setItem("weeklyTempHighestData","N/A");
                                sessionStorage.setItem("weeklyTempHighestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("weeklyTempHighestData",high_temp_data);
                                high_temp_index = tempData.indexOf(high_temp_data);
                                high_temp_date = weeklyTime[high_temp_index];
                                sessionStorage.setItem("weeklyTempHighestDate", high_temp_date);
                            }
                            
                            low_temp_data = Math.min.apply(Math, (tempData.filter(v => !isNaN(v))));
                            
                            if(low_temp_data == "Infinity")
                            {
                                sessionStorage.setItem("weeklyTempLowestData","N/A");
                                sessionStorage.setItem("weeklyTempLowestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("weeklyTempLowestData",low_temp_data);
                                low_temp_index = tempData.indexOf(low_temp_data);
                                low_temp_date = weeklyTime[low_temp_index];
                                sessionStorage.setItem("weeklyTempLowestDate", low_temp_date);
                            }
                            
                            high_humid_data = Math.max.apply(Math, (humidData.filter(v => !isNaN(v))));
                            
                            if(high_humid_data == "-Infinity")
                            {
                                sessionStorage.setItem("weeklyHumidHighestData","N/A");
                                sessionStorage.setItem("weeklyHumidHighestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("weeklyHumidHighestData",high_humid_data);
                                high_humid_index = humidData.indexOf(high_humid_data);
                                high_humid_date = weeklyTime[high_humid_index];
                                sessionStorage.setItem("weeklyHumidHighestDate", high_humid_date);
                            }
                            
                            low_humid_data = Math.min.apply(Math, (humidData.filter(v => !isNaN(v))));
                            
                            if(low_humid_data == "Infinity")
                            {
                                sessionStorage.setItem("weeklyHumidLowestData","N/A");
                                sessionStorage.setItem("weeklyHumidLowestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("weeklyHumidLowestData",low_humid_data);
                                low_humid_index = humidData.indexOf(low_humid_data);
                                low_humid_date = weeklyTime[low_humid_index];
                                sessionStorage.setItem("weeklyHumidLowestDate", low_humid_date);
                            }
                            
							showAllChart(weeklyTime,peopleData,tempData,humidData);
							showPeopleChart(weeklyTime, peopleData); //Illustrate the chart
							showTemperatureChart(weeklyTime, tempData); //Illustrate the chart
							showHumidityChart(weeklyTime, humidData); //Illustrate the chart
							document.getElementById("pdfButton").disabled = false;

						}
						
						//Monthly Chart
						if(diff_in_days > 30 && diff_in_days <= 364){
							var startMonth = startDate.getMonth();
							var diff_in_months = diff_in_days / 30;
							
							for(var i=0; i<diff_in_months; i++){
								if(startMonth <= 11){
									monthlyTime[i] = startMonth;
									startMonth ++;
								} else {
									startMonth = 0;
									monthlyTime[i] = startMonth;
									startMonth ++;
								}
							}
							
							//Initialise the array
							for(var i=0; i<monthlyTime.length; i++){
								peopleData[i] = 0;
								peopleDataCounter[i] = 0;
								tempData[i] = 0;
								tempDataCounter[i] = 0;
								humidData[i] = 0;
								humidDataCounter[i] = 0;
							}
							var newppldata = [];
							//People Chart
							for(var index in result.rooms[room].people) {
								var dataDate = new Date(result.rooms[room].people[index].time);
									if(dataDate >= startDate && dataDate <= endDate){
										if(dataDate.getUTCHours() >= parseInt(startTime.substring(0,2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0,2))){
                                            
											for(var i=0; i<monthlyTime.length;i++){
												if(dataDate.getUTCMonth() == monthlyTime[i]){
													peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
                                                    newppldata.push(peopleData[i]);
													peopleDataCounter[i] ++;
												}
											}
										}
									}
							}
							
							//Temperature Chart
							for(var index in result.rooms[room].temperature) {
								var dataDate = new Date(result.rooms[room].temperature[index].time);
									if(dataDate >= startDate && dataDate <= endDate){
										if(dataDate.getUTCHours() >= parseInt(startTime.substring(0,2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0,2))){
											for(var i=0; i<monthlyTime.length;i++){
												if(dataDate.getUTCMonth() == monthlyTime[i]){
													tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
													tempDataCounter[i] ++;
												}
											}
										}
									}
							}
							
							//Humidity Chart
							for(var index in result.rooms[room].humidity) {
								var dataDate = new Date(result.rooms[room].humidity[index].time);
									if(dataDate >= startDate && dataDate <= endDate){
										if(dataDate.getUTCHours() >= parseInt(startTime.substring(0,2)) && dataDate.getUTCHours() <= parseInt(endTime.substring(0,2))){
											for(var i=0; i<monthlyTime.length; i++){
												if(dataDate.getUTCMonth() == monthlyTime[i]){
													humidData[i] = humidData[i] + result.rooms[room].humidity[index].data;
													humidDataCounter[i] ++;
												}
											}
										}
									}
							}
							
							for(var i=0; i<monthlyTime.length; i++){
								if(monthlyTime[i] == 0){
									monthlyTime[i] = "January";
								}
								if(monthlyTime[i] == 1){
									monthlyTime[i] = "February";
								}
								if(monthlyTime[i] == 2){
									monthlyTime[i] = "March";
								}
								if(monthlyTime[i] == 3){
									monthlyTime[i] = "April";
								}
								if(monthlyTime[i] == 4){
									monthlyTime[i] = "May";
								}
								if(monthlyTime[i] == 5){
									monthlyTime[i] = "June";
								}
								if(monthlyTime[i] == 6){
									monthlyTime[i] = "July";
								}
								if(monthlyTime[i] == 7){
									monthlyTime[i] = "August";
								}
								if(monthlyTime[i] == 8){
									monthlyTime[i] = "September";
								}
								if(monthlyTime[i] == 9){
									monthlyTime[i] = "October";
								}
								if(monthlyTime[i] == 10){
									monthlyTime[i] = "November";
								}
								if(monthlyTime[i] == 11){
									monthlyTime[i] = "December";
								}
							}
							
							//Get the average for each data in the time
							for(var i=0; i<peopleData.length; i++){
								peopleData[i] = Math.round((peopleData[i]/peopleDataCounter[i]) | 0);
							}
							
							for(var i=0; i<tempData.length; i++){
								tempData[i] = Math.round((tempData[i]/tempDataCounter[i]) * 10) / 10;
							}
							
							for(var i=0; i<humidData.length; i++){
								humidData[i] = Math.round((humidData[i]/humidDataCounter[i]) | 0);
							}
                            
                            checkDay = 3;
                            sessionStorage.setItem("checkDay", checkDay);
                            
                            high_ppl_data = Math.max.apply(Math, (peopleData.filter(v => !isNaN(v))));
                            
                            if(high_ppl_data == "-Infinity")
                            {
                                sessionStorage.setItem("monthlyPeopleHighestData","N/A");
                                sessionStorage.setItem("monthlyPeopleHighestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("monthlyPeopleHighestData",high_ppl_data);
                                high_ppl_index = peopleData.indexOf(high_ppl_data);
                                high_ppl_date = monthlyTime[high_ppl_index];
                                sessionStorage.setItem("monthlyPeopleHighestDate", high_ppl_date);
                            }
                            
                            low_ppl_data = Math.min.apply(Math, (peopleData.filter(v => !isNaN(v))));
                            
                            if(low_ppl_data == "Infinity")
                            {
                                sessionStorage.setItem("monthlyPeopleLowestData","N/A");
                                sessionStorage.setItem("monthlyPeopleLowestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("monthlyPeopleLowestData",low_ppl_data);
                                low_ppl_index = peopleData.indexOf(low_ppl_data);
                                lowppldate = monthlyTime[low_ppl_index];
                                sessionStorage.setItem("monthlyPeopleLowestDate", lowppldate);
                            }
                            
                            high_temp_data = Math.max.apply(Math, (tempData.filter(v => !isNaN(v))));
                            
                            if(high_temp_data == "-Infinity")
                            {
                                sessionStorage.setItem("monthlyTempHighestData","N/A");
                                sessionStorage.setItem("monthlyTempHighestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("monthlyTempHighestData",high_temp_data);
                                high_temp_index = tempData.indexOf(high_temp_data);
                                high_temp_date = monthlyTime[high_temp_index];
                                sessionStorage.setItem("monthlyTempHighestDate", high_temp_date);
                            }
                            
                            low_temp_data = Math.min.apply(Math, (tempData.filter(v => !isNaN(v))));
                            
                            if(low_temp_data == "Infinity")
                            {
                                sessionStorage.setItem("monthlyTempLowestData","N/A");
                                sessionStorage.setItem("monthlyTempLowestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("monthlyTempLowestData",low_temp_data);
                                low_temp_index = tempData.indexOf(low_temp_data);
                                low_temp_date = monthlyTime[low_temp_index];
                                sessionStorage.setItem("monthlyTempLowestDate", low_temp_date);
                            }
                            
                            high_humid_data = Math.max.apply(Math, (humidData.filter(v => !isNaN(v))));
                            
                            if(high_humid_data == "-Infinity")
                            {
                                sessionStorage.setItem("monthlyHumidHighestData","N/A");
                                sessionStorage.setItem("monthlyHumidHighestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("monthlyHumidHighestData",high_humid_data);
                                high_humid_index = humidData.indexOf(high_humid_data);
                                high_humid_date = monthlyTime[high_humid_index];
                                sessionStorage.setItem("monthlyHumidHighestDate", high_humid_date);
                            }
                            
                            low_humid_data = Math.min.apply(Math, (humidData.filter(v => !isNaN(v))));
                            
                            if(low_humid_data == "Infinity")
                            {
                                sessionStorage.setItem("monthlyHumidLowestData","N/A");
                                sessionStorage.setItem("monthlyHumidLowestDate", "N/A");
                            }
                            else
                            {   
                                sessionStorage.setItem("monthlyHumidLowestData",low_humid_data);
                                low_humid_index = humidData.indexOf(low_humid_data);
                                low_humid_date = monthlyTime[low_humid_index];
                                sessionStorage.setItem("monthlyHumidLowestDate", low_humid_date);
                            }
                            
							showAllChart(monthlyTime,peopleData,tempData,humidData);
							showPeopleChart(monthlyTime, peopleData); //Illustrate the chart
							showTemperatureChart(monthlyTime, tempData); //Illustrate the chart
							showHumidityChart(monthlyTime, humidData); //Illustrate the chart
							document.getElementById("pdfButton").disabled = false;

						}
					}
				}
			}
		};
		xhttp.open("GET", `${domain}/api/rooms`, true);

    xhttp.send();
}

function showAllChart(x,y1,y2,y3){
	
	Highcharts.chart('allChart', {
			credits: false,

			exporting:{
				buttons:{
					contextButton:{
							enabled:false
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

function showPeopleChart(x,y){
	
	Highcharts.chart('peopleChart', {
			credits: false,

			exporting:{
				buttons:{
					contextButton:{
							enabled:false
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
		
			yAxis:{
					text:'Counts'
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
					data: y	,
					name: 'People Count'
			}]
	});
}

function showTemperatureChart(x,y){
	
	Highcharts.chart('temperatureChart', {
		credits: false,
		
		exporting:{
			buttons:{
				contextButton:{
						enabled:false
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

function showHumidityChart(x,y){
	
	Highcharts.chart('humidityChart', {
		credits: false,
		
		exporting:{
			buttons:{
				contextButton:{
						enabled:false
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
		if(this.readyState == 4 && this.status == 200) {
			var result = this.response;

			let parseNotices = JSON.parse(localStorage.getItem('notifications'));

			if (parseNotices) {
				if (parseNotices.length > 0) {
					document.getElementById('noticeNum').innerHTML = parseNotices.length;
					document.getElementById('noticeNum').style.display = 'inline';

					document.getElementById('emptyNotice').style.display = "none";
					for (let i=0; i<parseNotices.length; i++) {
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

			for(var room in result.rooms){
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
							<p class="lastUpdated mt-4">Last updated: <span class="lastUpdatedTime">N/A<span></p>
              <span class="roomId" style="display:none">${result.rooms[room]._id}</span>
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
							<p class="lastUpdated mt-4">Last updated: <span class="lastUpdatedTime">N/A<span></p>
							<div class="status-indicator"></div>
              <span class="roomId" style="display:none">${result.rooms[room]._id}</span>
						</div>
					</div>
				`;
				}	
			}

			document.getElementById("roomCardContainer").innerHTML += `
				<div id="noRoomCard" class="card mr-4 border-0 shadow-sm py-4 mb-4 bg-white rounded" style="width: 24rem; height: 13rem; display: none"	>
					<div class="card-body pt-2 text-center">
						<h4 class="card-title mb-4">No room available</h4>
						<h6 style="color: white">empty</h6>
						<h6 style="color: white">empty</h6>
						<h6 style="color: white">empty</h6>
					</div>
				</div>
			`;
		}
	};

	xhttp.open("GET",`${domain}/api/rooms/details`, true);

	xhttp.send();
}

// Issue:
// 1. the generate report only work after the chart has been generated on the web page
function directToPdf() {
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
	
	// Open the new window that show the PDF file
	let report_window = window.open("/report");
	report_window.focus();

	let room_name = document.getElementById("room_name").innerHTML;
	let date_range = document.getElementById("choosenRange").innerHTML;
    let time_range = document.getElementById("choosenTimeRange").innerHTML;

	// After the window load, run the function in the new opened window with those parameters
	report_window.addEventListener("load", function() {
		report_window.generateReport({room_name: room_name, date_range: date_range, time_range: time_range}, peopleChart, temperatureChart, humidityChart);
	})
}



function showUserTable(){
    $("#spinner_adduser").hide();
    $("#userAlert").hide();
    $("#userEditAlert").hide();
    $("#userEditModalAlert").hide();
    
    var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';

    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            $("#spinner").hide();
            var result = this.response;
            var c = 0;
            var a = 0;
            
            for(var user in result.users){
                
                document.getElementById("showUser").innerHTML += 
                '<tbody>' + '<tr>' +
                '<td style="display: none;">' + result.users[user]._id + '</td>' +
                '<td>' + result.users[user].username + '</td>' +
                '<td>' + result.users[user].email + '</td>' +
				// '<td>' + result.users[user].role + '</td>' +
				'<td class="roleButtons">' + '<input class="roleChangeButtons" id = "rolebtn" onchange="updateUser(this, &#39;' + result.users[user]._id + '&#39;)" type="checkbox" data-toggle="toggle" data-on="Manager" data-off="Staff" data-onstyle="success" data-offstyle="outline-dark" data-size="xs">' + '</td>' +
				'<td>' + '<button class = "deleteuserbtn btn btn-danger" id = "deletebtn" disabled = "disabled" onclick = "deleteUser(&#39;'+ result.users[user]._id + '&#39;)"><span class="fa fa-trash" style = "color: white"></span></button>' + '</td>' + '</tr>' + '</tbody>';
                
			};
            

			// Set the checkbox checked value to either staff or manager according to the user roles
			let roleChangeButtons = document.getElementsByClassName("roleChangeButtons");
            
            
			for(var user in result.users) { 
				if (result.users[user].role == "staff") {
					roleChangeButtons[user].checked = false;
				} else {
					roleChangeButtons[user].checked = true;
				}
			}
            
            
            var userID = sessionStorage.getItem("passLoginUserID");
            var userIndex;
            
            for(var user in result.users) { 
				if (result.users[user]._id === userID) {
					roleChangeButtons[user].disabled = true;
                    userIndex = user;
				} 
			}

			// Initialize the checkbox to be applied by bootstrap toggle css
			$("[data-toggle='toggle']").bootstrapToggle();
          
            if((sessionStorage.getItem("passLoginUserRole")) == "manager")
            {
                var deletebtns = document.getElementsByClassName("deleteuserbtn");
                
                for(var i = 0; i < deletebtns.length; i++)
                {
                    deletebtns[i].disabled = false;
                    deletebtns[userIndex].disabled = true;
                    
                }

            }
            
            if((sessionStorage.getItem("passLoginUserRole")) == "staff")
            {
                $("[data-toggle='toggle']").prop('disabled', true);
                $("[data-toggle='collapse']").prop('disabled', true);
                
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

function showHint() {
    if(document.getElementById("upsd").value === '')
    {
        document.getElementById("showPasswordHint").innerHTML = '8-12 character, at lease one uppercase, one lowercase and one numeric digit';
    }

}

function showcpsdHint() {
    if(document.getElementById("cupsd").value === '')
    {
        document.getElementById("showConfirmPasswordHint").innerHTML = '8-12 character, at lease one uppercase, one lowercase and one numeric digit';
    } 
}

function showNewpsdHint() {
    if(document.getElementById("password").value === '')
    {
        document.getElementById("showNewPasswordHint").innerHTML = '8-12 character, one uppercase, one lowercase and one numeric digit';
    } 
}

function showNewconfirmpsdHint() {
    if(document.getElementById("confirm_password").value === '')
    {
        document.getElementById("showNewConfirmPasswordHint").innerHTML = '8-12 character, one uppercase, one lowercase and one numeric digit';
    } 
}

function toggle() {
    function toggleOpen(e) 
    {
        $(e.target).prev('.card-header').find(".expand-icon").text("remove_circle");
    }

    function toggleClose(e) 
    {
        $(e.target).prev('.card-header').find(".expand-icon").text("add_circle");
    }
    
    $('.panel-group').on('hidden.bs.collapse', toggleClose);
    $('.panel-group').on('shown.bs.collapse', toggleOpen);
}

function addUser() {
    
    if(document.getElementById("role").value == "Pick a Role")
    {
        var element = document.getElementById("userAlert");
        element.classList.add("alert-danger");
        
        document.getElementById("userAlert").innerHTML = '<strong>Please pick a role!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
    }
        
    if(document.getElementById("upsd").value !== document.getElementById("cupsd").value )
    {
        document.getElementById("userAlert").innerHTML = '<strong>Your Password and Confirm Password is not the same. Please fill in again!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
    }

    CheckPassword(document.getElementById("cupsd"));
    
    if(document.getElementById("cupsd").value === "")
    {
        document.getElementById("userAlert").innerHTML = '<strong>Please fill in your confirm password!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
    }
    
    CheckPassword(document.getElementById("upsd"));
    
    if(document.getElementById("upsd").value === "")
    {
        document.getElementById("userAlert").innerHTML = '<strong>Please fill in your password!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
    }
    
    if(document.getElementById("uemail").value === "")
    {
        document.getElementById("userAlert").innerHTML = '<strong>Please fill in your email!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
    }
    
    if(document.getElementById("uname").value === "")
    {
        document.getElementById("userAlert").innerHTML = '<strong>Please fill in your name!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
    } 
    
    if(document.getElementById("uname").value !== "" 
       && document.getElementById("upsd").value !== "" 
       && document.getElementById("cupsd").value !== "" 
       && document.getElementById("uemail").value !== "" 
       && document.getElementById("role").value !== "Pick a Role" 
       && (document.getElementById("upsd").value === document.getElementById("cupsd").value)
       && CheckPassword(document.getElementById("upsd")) === true
       && CheckPassword(document.getElementById("cupsd")) === true)
    {
        $("#spinner_adduser").show();
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';
        var url = `${domain}/api/users`;
        var params = 'role=' + document.getElementById("role").value 
                    + '&username=' + document.getElementById("uname").value 
                    + '&email=' + document.getElementById('uemail').value
                    + '&password=' + document.getElementById('upsd').value;

				xhttp.open('POST',url,true);

				xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');

        xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == 201) {
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
            
            if(xhttp.readyState == 4 && xhttp.status == 401) {
                $("#spinner_adduser").hide();
                
                clear();
                
                document.getElementById("showUser").innerHTML = "";
                var table = document.getElementById("showUser").innerHTML;
                table = showUserTable();
                
                document.getElementById("userAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
                $("#userAlert").show();
    
            }
            
            if(xhttp.readyState == 4 && xhttp.status == 500) {
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

function CheckPassword(input)
{
    var validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;

    if(input.value.match(validPassword))
    {
//        var element = document.getElementById("userAlert");
//        element.classList.remove("alert-danger")
//        element.classList.add("alert-success");
//        
//        document.getElementById("userAlert").innerHTML = '<strong>Your Password is valid!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
//        $("#userAlert").show();
        
        return true;
    }
    else
    {
        var element = document.getElementById("userAlert");
        element.classList.add("alert-danger");
        
        document.getElementById("userAlert").innerHTML = '<strong>Your Password or Confirm Password is invalid. Please enter a password which contain 8 to 12 character, at least one numeric digit, one uppercase and one lowercase letter!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
        
        return false;

    }
};

function CheckResetPassword(input)
{
    var validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;

    if(input.value.match(validPassword))
    {   
        return true;
    }
    else
    {
        var element = document.getElementById("resetAlert");
        element.classList.add("alert-danger");
        
        document.getElementById("resetAlert").innerHTML = '<strong>Your New Password or Confirm Password is invalid. Please enter a password which contain 8 to 12 character, at least one numeric digit, one uppercase and one lowercase letter!</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
        
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
    if(document.getElementById("uname").value !== "" 
       || document.getElementById("upsd").value !== "" 
       || document.getElementById("cupsd").value !== "" 
       || document.getElementById("uemail").value !== "" 
       || document.getElementById("role").value !== "Pick a Role")
    {
        var answer = window.confirm("Are you sure you want to clear?");
        
        if (answer)
        {
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

function showModal(){
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
        if (target) 
        {
            
            var cells = target.getElementsByTagName("td");

        }

        var xhttp = new XMLHttpRequest();
				xhttp.responseType = 'json';
        
				var url = `${domain}/api/users/` + cells[0].innerHTML;
        
        document.getElementById("id").value = cells[0].innerHTML;
        document.getElementById("previousRole").value = cells[3].innerHTML;

        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                var result = this.response;
                
                document.getElementById("edit_role").value = result.user.role;

            }
        };
        
        xhttp.open("GET",url,true);

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

	xhttp.open('PUT',url,true);
	xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState == 4 && xhttp.status == 200) 
		{
			$("#spinner").hide();

			var element = document.getElementById("userEditAlert");
			element.classList.add("alert-success");
			
			document.getElementById("userEditAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserEditAlert()"><span>&times;</span></button>';
			$("#userEditAlert").show();
		}
		
		if(xhttp.readyState == 4 && xhttp.status == 401) 
		{
			$("#spinner").hide();
			
			var element = document.getElementById("userEditAlert");
			element.classList.add("alert-danger");
			
			document.getElementById("userEditAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserEditAlert()"><span>&times;</span></button>';
			$("#userEditAlert").show();
		}
	}

	xhttp.send(params);
};


function closeModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
};

function deleteUser(userIdDelete){
    
    $("#spinner").show();
    
    var table = document.getElementsByTagName("table")[0];
    
    var tbody = table.getElementsByTagName("tbody")[0];
    
    var answer = window.confirm("Are you sure you want to delete this user?");
    if (answer)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';

        var url = `${domain}/api/users/` + userIdDelete;

        xhttp.open("DELETE",url,true);

        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
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

            if(this.readyState == 4 && this.status == 401) {
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
    else
    {
        $("#spinner").hide();
    }
};

function loginPage() {
    $("#spinner_login").hide(); 
    $("#spinner_forget").hide(); 
    $("#loginAlert").hide();
    $("#forgetAlert").hide();
};

async function login(){
    
    $("#loginAlert").hide();
    
    if(document.getElementById("loginPassword").value === "")
    {
        document.getElementById("loginAlert").innerHTML = '<strong>Please enter your password!!</strong> <button type="button" class="close" onclick="closeLoginAlert()"><span>&times;</span></button>';
        $("#loginAlert").show();
    }
    
    if(document.getElementById("loginEmail").value === "")
    {
        document.getElementById("loginAlert").innerHTML = '<strong>Please enter your username!!</strong> <button type="button" class="close" onclick="closeLoginAlert()"><span>&times;</span></button>';
        $("#loginAlert").show();
    }
    
    if((document.getElementById("loginEmail").value != "") && (document.getElementById("loginPassword").value != ""))
    {
        $("#spinner_login").show(); 
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';
				var url = `${domain}/api/users/login`;
        var params = 'email=' + document.getElementById("loginEmail").value + '&password=' + document.getElementById("loginPassword").value;
                
        xhttp.open('POST',url,true);

        xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');

        xhttp.onreadystatechange = function() {

            if(xhttp.readyState == 4 && xhttp.status == 200) 
            {
                
                if(xhttp.response.status == "success")
                {
                    sessionStorage.setItem("passLoginUserID", xhttp.response.userId);
										sessionStorage.setItem("passLoginUserRole", xhttp.response.role);
										sessionStorage.setItem("firstLogin", xhttp.response.firstLogin.toString());
                    
                    $("#spinner_login").hide(); 

										document.cookie = "token=" + xhttp.response.token;										
									
										window.location.replace("/dashboard");
                }
            }
            
            if((xhttp.readyState == 4 && xhttp.status == 401) || (xhttp.readyState == 4 && xhttp.status == 404)) 
            {
                $("#spinner_login").hide(); 
                document.getElementById("loginAlert").innerHTML = '<strong>Login credentials invalid!!</strong> <button type="button" class="close" onclick="closeLoginAlert()"><span>&times;</span></button>';
                $("#loginAlert").show();
            }
            
            if(xhttp.readyState == 4 && xhttp.status == 500) 
            {
                $("#spinner_login").hide();
                document.getElementById("loginAlert").innerHTML = '<strong>' + xhttp.response.message + ' maybe something is wrong with the server</strong> <button type="button" class="close" onclick="closeLoginAlert()"><span>&times;</span></button>';
                $("#loginAlert").show();
                
            }
        }

        xhttp.send(params);    
    }
};

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

function closeResetAlert() {
    $("#resetAlert").hide();
};

function openForgetEmail() {
    var modal = document.getElementById("modalEmail");
    modal.style.display = "block";  
};

function closeForget() {
    var modal = document.getElementById("modalEmail");
    modal.style.display = "none";  
};

function checkEmail(){
    
    $("#spinner_forget").show();
    
    if(document.getElementById("forgetEmail").value === "")
    {
        $("#spinner_forget").hide();
        
        var element = document.getElementById("forgetAlert");
        element.classList.add("alert-danger");
        
        document.getElementById("forgetAlert").innerHTML = '<strong>Please enter an email!!</strong> <button type="button" class="close" onclick="closeForgetAlert()"><span>&times;</span></button>';
        $("#forgetAlert").show();
    }
    else 
    {
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';
        var url = `${domain}/api/users/forgotPassword`;
        var params = 'email=' + document.getElementById("forgetEmail").value;

        xhttp.open('POST',url,true);
        xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');

        xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == 200) 
            {
                $("#spinner_forget").hide(); 
                
                var element = document.getElementById("forgetAlert");
                element.classList.remove("alert-danger");
                element.classList.add("alert-success");
                
                document.getElementById("forgetAlert").innerHTML = '<strong>' + xhttp.response.message +'</strong> <button type="button" class="close" onclick="closeForgetAlert()"><span>&times;</span></button>';
                $("#forgetAlert").show();
                document.getElementById("forgetEmail").value = "";

            }

            if(xhttp.status == 404) 
            {
                $("#spinner_forget").hide(); 
                
                var element = document.getElementById("forgetAlert");
                element.classList.add("alert-danger");
                
                document.getElementById("forgetAlert").innerHTML = '<strong>' + xhttp.response.message +'</strong> <button type="button" class="close" onclick="closeForgetAlert()"><span>&times;</span></button>';
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
    
    if(document.getElementById("password").value !== document.getElementById("confirm_password").value)
    {
        $("#spinner_reset").hide(); 
        
        document.getElementById("resetAlert").innerHTML = '<strong>Your new password and confirm password is not the same.\nPlease enter again!!</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
        $("#resetAlert").show();
    }
    
    CheckResetPassword(document.getElementById("confirm_password"));
    
    if(document.getElementById("confirm_password").value === "") 
    {
        $("#spinner_reset").hide(); 
        
        document.getElementById("resetAlert").innerHTML = '<strong>Please fill in your confirm password!!</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
        $("#resetAlert").show();
    }
    
    CheckResetPassword(document.getElementById("password"));
    
    if(document.getElementById("password").value === "")
    {
        $("#spinner_reset").hide(); 
        
        document.getElementById("resetAlert").innerHTML = '<strong>Please fill in your new password!!</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
        $("#resetAlert").show();
    }

    if(document.getElementById("password").value !== "" 
       && document.getElementById("confirm_password").value !== "" 
       && document.getElementById("password").value === document.getElementById("confirm_password").value
       && CheckResetPassword(document.getElementById("password")) === true
       && CheckResetPassword(document.getElementById("confirm_password")) === true)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';

        var url = `${domain}/api/users/resetPassword`;

        const token = window.location.pathname.split('/')[2];
        const password = document.getElementById("password").value;

        var params = `token=${token}&password=${password}`;

        xhttp.open('POST', url, true);

        xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');

        xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                if (xhttp.response.message == 'success') {
                    $("#spinner_reset").hide(); 
                    
                    document.getElementById("showNewPasswordHint").innerHTML = '';
                    document.getElementById("showNewConfirmPasswordHint").innerHTML = '';
                    
                    var element = document.getElementById("resetAlert");
                    element.classList.remove("alert-danger")
                    element.classList.add("alert-success");
                    
                    document.getElementById("resetAlert").innerHTML = '<strong>Successfully reset password</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
                    $("#resetAlert").show();
                    
                    setTimeout(function(){ window.location.replace("/login"); }, 3000);

                }
            }
            
            if(xhttp.readyState == 4 && xhttp.status == 404) {
                $("#spinner_reset").hide(); 
                
                document.getElementById("resetAlert").innerHTML = '<strong>Failed to reset password.\nPlease go to enter your forget email again.</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
                $("#resetAlert").show();
                
            }
            
            
            if(xhttp.readyState == 4 && xhttp.status == 500) {
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
    $('#maxRows').on('change', function(){
        $('.pagination').html('')
        var trnum = 0
        var maxRows = parseInt($(this).val())
        var totalRows = $(table+' tbody tr').length
        $(table+' tr:gt(0)').each(function(){
            trnum++
            if(trnum > maxRows){
                $(this).hide();
                for(var i = 0 ; i < $(this).length; i++)
                {
                    var td = $(this)[i].cells[i];
                }
            }
            if(trnum <= maxRows){
                $(this).show();
                for(var i = 0 ; i < $(this).length; i++)
                {
                    var td = $(this)[i].cells[i];
                }
            }
        })
        if(totalRows > maxRows){
            var pagenum = Math.ceil(totalRows/maxRows)
            for(var i=1;i<=pagenum;){
                $('.pagination').append('<li class = "active" data-page="'+i+'">\<span><a class="page-link">'+ i++ + '<span class="sr-only">(current)</span></span></a>\</li>').show()
            }
        }
        $('.pagination li:first-child').addClass('active')
        $('.pagination li').on('click',function(){
            var pageNum = $(this).attr('data-page')
            var trIndex = 0;
            $('.pagination li').removeClass('active')
            $(this).addClass('active')
            $(table+' tr:gt(0)').each(function(){
                trIndex++
                if(trIndex > (maxRows*pageNum) || trIndex <= ((maxRows*pageNum)-maxRows)){
                    $(this).hide();
                    for(var i = 0 ; i < $(this).length; i++)
                    {
                        var td = $(this)[i].cells[i];
                    }
                } else{
                    $(this).show();
                    for(var i = 0 ; i < $(this).length; i++)
                    {
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

function addRoom(){
	var newRoom = document.getElementById("room-name").value;
	
	if(newRoom == ""){
		$( ".shakeInput" ).effect("shake",{direction: "left", distance:0.5, times:2}, 200);
	} else {
		var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';
		var url = `${domain}/api/rooms`;
		var params = 'name=' + document.getElementById("room-name").value;

		xhttp.open('POST',url,true);

		xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');

		xhttp.onreadystatechange = function() {
			if(xhttp.readyState == 4 && xhttp.status == 200) {
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
humidGradient.addColorStop(0, "#ff758c");
humidGradient.addColorStop(1, "#ff7eb3");

let timeline = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];

let currentHour = moment().hours();
timeline = timeline.slice(0, currentHour + 1);

let peopleData = [];
let temperatureData = [];
let humidityData = [];

for (let i=0; i<timeline.length; i++) {
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
            label: 'Number of People',
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
	let highestTemperature = {data: 0, time: null};
	let highestHumidity = {data: 0, time: null};
	let highestPeople = {data: 0, time: null};
	let lowestTemperature = {data: 0, time: null};
	let lowestHumidity = {data: 0, time: null};


	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			let result = this.response;

			const currentHour = moment().hours();

			timeline = timeline.slice(0, currentHour + 1);

			for (let i=0; i<timeline.length; i++) {
				newPeople.push(0);
				newTemperature.push(0);
				newHumidity.push(0);
			}
			
			
			for (let i=0; i<result.room.people.length; i++) {
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

			for (let i=0; i<result.room.temperature.length; i++) {
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


			for (let i=0; i<result.room.humidity.length; i++) {
				if (moment(result.room.humidity[i].time).isSame(new Date(), "day")){
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

	if (updateView) {
		for (let i=0; i<dotsLoaders.length; i++) {
			dotsLoaders[i].style.display = "inline";
		}
	
		for (let i=0; i<defaultRooms.length; i++) {
			defaultRooms[i].style.display = "none";
		}
	}
	
	// Trend's variables
	timeline = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];
	let newPeople = [];
	let newTemperature = [];
	let newHumidity = [];

	// Insight's vatiables
	let highestTemperature = {data: 0, time: null};
	let highestHumidity = {data: 0, time: null};
	let highestPeople = {data: 0, time: null};
	let lowestTemperature = {data: 0, time: null};
	let lowestHumidity = {data: 0, time: null};


	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			var result = this.response;

			const currentHour = moment().hours();

			timeline = timeline.slice(0, currentHour + 1);

			for (let i=0; i<timeline.length; i++) {
				newPeople.push(0);
				newTemperature.push(0);
				newHumidity.push(0);
			}

			console.log(result);
			
			
			for (let i=0; i<result.room.people.length; i++) {
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

			for (let i=0; i<result.room.temperature.length; i++) {
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


			for (let i=0; i<result.room.humidity.length; i++) {
				if (moment(result.room.humidity[i].time).isSame(new Date(), "day")){
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
				for (let i=0; i<dotsLoaders.length; i++) {
					dotsLoaders[i].style.display = "none";
				}
	
				for (let i=0; i<defaultRooms.length; i++) {
					defaultRooms[i].style.display = "inline";
				}

				document.getElementById('insightRoom').innerHTML = " - " + roomName;
				document.getElementById('trendRoom').innerHTML = " - " + roomName;
				document.getElementById('viewRoomDetails').href = `/chart/${roomId}`;
			}
		}
	};

	xhttp.open("GET", `${domain}/api/rooms/${roomId}?period=today`, true);

	xhttp.send();

}

function closeNoticeRow(element) {
	const totalChildCount = document.getElementById('noticeMain').childElementCount;

	const time = element.parentNode.parentNode.getElementsByClassName('noticeTime')[0].innerHTML;

	if (!localStorage.getItem('notifications')) {
		localStorage.setItem("notifications", JSON.stringify([]));
	}

	const notifications = JSON.parse(localStorage.getItem('notifications'));

	for (let i=0; i<notifications.length; i++) {
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

	for (let i=0; i<content.length; i++) {
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

		xhttp.open('PUT',url,true);

		xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');

		xhttp.onreadystatechange = function() {
			if(xhttp.readyState == 4 && xhttp.status == 200) {}
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
		.oncomplete(function() {
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














/* Everything goes above here */
// ---------------------------------------------------------------------------------------------------------
// Testing purpose
function testGetRoomData(period) {
	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			var result = this.response;
			console.log(result);
		}
	};

	xhttp.open("GET",`${domain}/api/rooms/5db583ed1c9d4400009a20f2?period=${period}&start=2019-11-14&end=2019-11-15`, true);

	xhttp.send();
}