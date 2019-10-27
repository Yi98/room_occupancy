
var socket = io();

socket.on("sensor", function(msg) {
	console.log(msg.temperature);
	// for loop assign to all room their respective sensor data
	let roomCards = document.getElementsByClassName("room-card");
	for (let i = 0; i < roomCards.length; i++) {
		let roomId = roomCards[i].getElementsByClassName("room-id");
		// change 0 to i later
		if (roomId[0].innerHTML == msg.roomId) {
			document.getElementsByClassName("temperature")[i].innerHTML = msg.temperature;
			document.getElementsByClassName("humidity")[i].innerHTML = msg.humidity;
		}
	}
});




function checkIsLogin() {			
	var http = new XMLHttpRequest();

	http.open('GET', 'http://localhost:3000/', true);

	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
					console.log(http.response);
			}
	}

	http.send();
};




function searchRoom(){
	var input, filter, ul, li, i, a, txtValue;
	input = document.getElementById("search");
	filter = input.value.toUpperCase();
	ul = document.getElementById("showRoom");
	li = ul.getElementsByTagName("div");
	for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("h4")[0];
		txtValue = a.textContent || a.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
				li[i].style.display = "";
		} else {
				li[i].style.display = "none";
		}
	}
}


function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
}

function showChart() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var pathname = url.pathname;
  var split = pathname.split("/");
	var roomId = split[2];
	xhrChart(roomId);

  $('#choosenRange').on('DOMSubtreeModified', function() {
    xhrChart(roomId);
  });
};

function xhrChart(roomId){
	var dateRange = document.getElementById("choosenRange").innerHTML.toString();
    var startDate = new Date(dateRange.substring(11, 0));
    var endDate = new Date(dateRange.substring(25, 14));
    var diff_in_days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    var peopleData = []; // people data
		var peopleDataCounter = []; // people data counter
    var tempData = []; // temp data
    var tempDataCounter = []; // temp data counter
    var humidData = []; // humidity data
    var humidDataCounter = []; // humidity data counter
		var hourTime = ['8:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','00:00'];
		var dailyTime = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var weeklyTime = ['Week 1', 'Week 2','Week 3', 'Week 4'];
		var monthlyTime = ['January', 'February','March','April','May','June','July','August','September','Octorber','November','December'];
		

	let room_name_found = false;
    var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'json';

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var result = this.response;

        for (var room in result.rooms) {
          if (result.rooms[room]._id == roomId) {
			  			if (room_name_found == false) {
							document.getElementById("room_name").innerHTML = result.rooms[room].name;
							room_name_found = true;
						}
						  
						//Today Chart
						if(diff_in_days == 0){
							console.log(diff_in_days);
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
							for(var index in result.rooms[room].people) {
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
								tempData[i] = Math.round((tempData[i]/tempDataCounter[i]) * 100) / 100;
							}
							
							for(var i=0; i<humidData.length; i++){
								humidData[i] = Math.round((humidData[i]/humidDataCounter[i]) * 100) / 100;
							}
							
							
							showPeopleChart(hourTime, peopleData); //Illustrate the chart
							showTemperatureChart(hourTime, tempData); //Illustrate the chart
							showHumidityChart(hourTime, humidData); //Illustrate the chart
						}
						
						//Daily Chart
						if(diff_in_days > 0 && diff_in_days <= 6){
							//Initialise the array
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
										for(var i=0; i<dailyTime.length;i++){
											if(dataDate.getUTCDay() == dailyTime.indexOf(dailyTime[i])){
												peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
												peopleDataCounter[i] ++;
											}
										}
									}
							}
							
							//Temperature Chart
							for(var index in result.rooms[room].temperature) {
								var dataDate = new Date(result.rooms[room].temperature[index].time);
									if(dataDate >= startDate && dataDate <= endDate){
										for(var i=0; i<dailyTime.length;i++){
											if(dataDate.getUTCDay() == dailyTime.indexOf(dailyTime[i])){
												tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
												tempDataCounter[i] ++;
											}
										}
									}
							}
							
							//Humidity Chart
							for(var index in result.rooms[room].humidity) {
								var dataDate = new Date(result.rooms[room].humidity[index].time);
									if(dataDate >= startDate && dataDate <= endDate){
										for(var i=0; i<dailyTime.length; i++){
											if(dataDate.getUTCDay() == dailyTime.indexOf(dailyTime[i])){
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
								tempData[i] = Math.round((tempData[i]/tempDataCounter[i]) * 100) / 100;
							}
							
							for(var i=0; i<humidData.length; i++){
								humidData[i] = Math.round((humidData[i]/humidDataCounter[i]) * 100) / 100;
							}
							
							
							showPeopleChart(dailyTime, peopleData); //Illustrate the chart
							showTemperatureChart(dailyTime, tempData); //Illustrate the chart
							showHumidityChart(dailyTime, humidData); //Illustrate the chart
						}
							
						//Weekly Chart
						if(diff_in_days > 6 && diff_in_days <= 29){
							
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
										for(var i=0; i<weeklyTime.length;i++){
											if(dataDate.getUTCDate() >= 1 && dataDate.getUTCDate() <= 7 && weeklyTime[i] == 'Week 1'){
												peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
												peopleDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 8 && dataDate.getUTCDate() <= 15 && weeklyTime[i] == 'Week 2'){
												peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
												peopleDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 16 && dataDate.getUTCDate() <= 23 && weeklyTime[i] == 'Week 3'){
												peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
												peopleDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 24  && dataDate.getUTCDate() <= 31 && weeklyTime[i] == 'Week 4'){
												peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
												peopleDataCounter[i] ++;
											}
										}
									}
							}
							
							//Temperature Chart
							for(var index in result.rooms[room].temperature) {
								var dataDate = new Date(result.rooms[room].temperature[index].time);
									if(dataDate >= startDate && dataDate <= endDate){
										for(var i=0; i<weeklyTime.length;i++){
											if(dataDate.getUTCDate() >= 1 && dataDate.getUTCDate() <= 7 && weeklyTime[i] == 'Week 1'){
												tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
												tempDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 8 && dataDate.getUTCDate() <= 15 && weeklyTime[i] == 'Week 2'){
												tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
												tempDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 16 && dataDate.getUTCDate() <= 23 && weeklyTime[i] == 'Week 3'){
												tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
												tempDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 24  && dataDate.getUTCDate() <= 31 && weeklyTime[i] == 'Week 4'){
												tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
												tempDataCounter[i] ++;
											}
										}
									}
							}
							
							//Humidity Chart
							for(var index in result.rooms[room].humidity) {
								var dataDate = new Date(result.rooms[room].humidity[index].time);
									if(dataDate >= startDate && dataDate <= endDate){
										for(var i=0; i<weeklyTime.length; i++){
											for(var i=0; i<weeklyTime.length;i++){
											if(dataDate.getUTCDate() >= 1 && dataDate.getUTCDate() <= 7 && weeklyTime[i] == 'Week 1'){
												humidData[i] = humidData[i] + result.rooms[room].humidity[index].data;
												humidDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 8 && dataDate.getUTCDate() <= 15 && weeklyTime[i] == 'Week 2'){
												humidData[i] = humidData[i] + result.rooms[room].humidity[index].data;
												humidDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 16 && dataDate.getUTCDate() <= 23 && weeklyTime[i] == 'Week 3'){
												humidData[i] = humidData[i] + result.rooms[room].humidity[index].data;
												humidDataCounter[i] ++;
											}
											if(dataDate.getUTCDate() >= 24  && dataDate.getUTCDate() <= 31 && weeklyTime[i] == 'Week 4'){
												humidData[i] = humidData[i] + result.rooms[room].humidity[index].data;
												humidDataCounter[i] ++;
											}
										}
										}
									}
							}
							
							//Get the average for each data in the time
							for(var i=0; i<peopleData.length; i++){
								peopleData[i] = Math.round((peopleData[i]/peopleDataCounter[i]) * 100) / 100;
							}
							
							for(var i=0; i<tempData.length; i++){
								tempData[i] = Math.round((tempData[i]/tempDataCounter[i]) * 100) / 100;
							}
							
							for(var i=0; i<humidData.length; i++){
								humidData[i] = Math.round((humidData[i]/humidDataCounter[i]) * 100) / 100;
							}
							
							showPeopleChart(weeklyTime, peopleData); //Illustrate the chart
							showTemperatureChart(weeklyTime, tempData); //Illustrate the chart
							showHumidityChart(weeklyTime, humidData); //Illustrate the chart
						}
						
						//Monthly Chart
						if(diff_in_days > 29 && diff_in_days <= 364){
							//Initialise the array
							for(var i=0; i<monthlyTime.length; i++){
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
										for(var i=0; i<monthlyTime.length;i++){
											if(dataDate.getUTCMonth() == monthlyTime.indexOf(monthlyTime[i])){
												peopleData[i] = peopleData[i] + result.rooms[room].people[index].data;
												peopleDataCounter[i] ++;
											}
										}
									}
							}
							
							//Temperature Chart
							for(var index in result.rooms[room].temperature) {
								var dataDate = new Date(result.rooms[room].temperature[index].time);
									if(dataDate >= startDate && dataDate <= endDate){
										for(var i=0; i<monthlyTime.length;i++){
											if(dataDate.getUTCMonth() == monthlyTime.indexOf(monthlyTime[i])){
												tempData[i] = tempData[i] + result.rooms[room].temperature[index].data;
												tempDataCounter[i] ++;
											}
										}
									}
							}
							
							//Humidity Chart
							for(var index in result.rooms[room].humidity) {
								var dataDate = new Date(result.rooms[room].humidity[index].time);
									if(dataDate >= startDate && dataDate <= endDate){
										for(var i=0; i<monthlyTime.length; i++){
											if(dataDate.getUTCMonth() == monthlyTime.indexOf(monthlyTime[i])){
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
								tempData[i] = Math.round((tempData[i]/tempDataCounter[i]) * 100) / 100;
							}
							
							for(var i=0; i<humidData.length; i++){
								humidData[i] = Math.round((humidData[i]/humidDataCounter[i]) * 100) / 100;
							}
							
							
							showPeopleChart(monthlyTime, peopleData); //Illustrate the chart
							showTemperatureChart(monthlyTime, tempData); //Illustrate the chart
							showHumidityChart(monthlyTime, humidData); //Illustrate the chart

						}
					}
				}
			}
		};
		xhttp.open("GET", "http://localhost:3000/api/rooms", true);

    xhttp.send();
}

function showPeopleChart(x,y){
	new Highcharts.chart('peopleChart', {
					credits: false,
				
					exporting:{
						buttons:{
							contextButton:{
									enabled:false
								}
						}
					},
				
					title: {
							text: 'Number Of People'
					},
					xAxis: {
							categories: x
					},
					series: [{
							data: y	,
							name: 'People Count'
					}]
			});
}

function showTemperatureChart(x,y){
	new Highcharts.chart('temperatureChart', {
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
					series: [{
							data: y,
							name: '°C'
					}]
			});
}

function showHumidityChart(x,y){
	new Highcharts.chart('humidityChart', {
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
					series: [{
							data: y,
							name: '%'
					}]
			});
}




function showDashboard(){
var xhttp = new XMLHttpRequest();
xhttp.responseType = 'json';

xhttp.onreadystatechange = function () {
	if(this.readyState == 4 && this.status == 200) {
		var result = this.response;

		const notifications = [];

		for(var room in result.rooms){
			var status = result.rooms[room].people.length;
			if(status < 25){
				var statusMsg = "Low";
			}
			
			if(status > 25){
				var statusMsg = "Moderate";
			}
			
			if(status > 50){
				var statusMsg = "Full";
			}

			notifications.push([{name: result.rooms[room].name, status: statusMsg}]);

			document.getElementById("showRoom").innerHTML += '<div class="room-card col-md-4 col-sm-4 col-xs-6" ><a onclick="window.open(\'/chart/' + result.rooms[room]._id + '\')"><div class="img-thumbnail">' +
									'<h4>' + result.rooms[room].name + '</h4>' +
									'<p>' + 'Number of People: ' + result.rooms[room].people.length + '</p>' +
									'<p>' + 'Temperature: ' + "<span class='temperature'>0</span>" + '&#x2103;</p>' +
									'<p>' + 'Humidity: ' + "<span class='humidity'>0</span>" + '</p>' + 
				  '<p>' + 'Status: <span class="roomStatus">' + statusMsg + '</span></p>'+
				  '<span style="display:none" class="room-id">'+ result.rooms[room]._id +'</span>' +
				  '</div></a></div>';
		}
		
		document.getElementById("showRoom").innerHTML += '<div class="room-card col-md-4 col-sm-4 col-xs-6" data-toggle="modal" data-target="#addRoomModal"><a><div class="img-thumbnail"><img src="https://image.flaticon.com/icons/svg/109/109615.svg" class="add-icon" title="Lyolya"/></div></a></div>';	
		
		localStorage.setItem('notifications', JSON.stringify(notifications));
		console.log(JSON.parse(localStorage.getItem('notifications')));
	}
};

	xhttp.open("GET","http://localhost:3000/api/rooms",true);

	xhttp.send();

};

function showDashboardRooms() {
	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';

	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			var result = this.response;

			const notifications = [];

			const placeholderRooms = document.getElementById('placeholderRooms');
			placeholderRooms.parentNode.removeChild(placeholderRooms);

			for(var room in result.rooms){
				var status = result.rooms[room].people.length;
				if(status < 25){
					var statusMsg = "Low";
				}
				
				if(status > 25){
					var statusMsg = "Moderate";
				}
				
				if(status > 50){
					var statusMsg = "Full";
				}

				notifications.push([{name: result.rooms[room].name, status: statusMsg}]);

				document.getElementById("roomCardContainer").innerHTML += `
					<div class="roomCard card mr-4 border-0 shadow-sm py-4 mb-4 bg-white rounded" style="width: 24rem;" onclick="onRoomClicked('${result.rooms[room].name}')">
						<div class="card-body pt-2 text-center">
							<h4 class="card-title mb-4">${result.rooms[room].name}</h4>
							<h6>Number of people: ${result.rooms[room].people.length}</h6>
							<h6>Temperature: <span class="currentTemp">0</span></h6>
							<h6>Humidity: <span class="currentHumid">0</span></h6>
						</div>
					</div>
				`
			}
			
			// document.getElementById("showRoom").innerHTML += '<div class="room-card col-md-4 col-sm-4 col-xs-6" data-toggle="modal" data-target="#addRoomModal"><a><div class="img-thumbnail"><img src="https://image.flaticon.com/icons/svg/109/109615.svg" class="add-icon" title="Lyolya"/></div></a></div>';	
			
			// localStorage.setItem('notifications', JSON.stringify(notifications));
			// console.log(JSON.parse(localStorage.getItem('notifications')));
		}
	};

	xhttp.open("GET","http://localhost:3000/api/rooms",true);

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

	// After the window load, run the function in the new opened window with those parameters
	report_window.addEventListener("load", function() {
		report_window.generateReport({room_name: room_name, date_range: date_range}, peopleChart, temperatureChart, humidityChart);
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
            for(var user in result.users){
                document.getElementById("showUser").innerHTML += 
                '<tbody>' + '<tr>' +
                '<td style="display: none;">' + result.users[user]._id + '</td>' +
                '<td>' + result.users[user].username + '</td>' +
                '<td>' + result.users[user].email + '</td>' +
				// '<td>' + result.users[user].role + '</td>' +
				'<td>' + '<input class="roleChangeButtons" onchange="updateUser(this, &#39;' + result.users[user]._id + '&#39;)" type="checkbox" data-toggle="toggle" data-on="Manager" data-off="Staff" data-onstyle="success" data-offstyle="outline-dark" data-size="xs">' + '</td>' +
				'<td>' + '<button class = "btn btn-danger" id = "deletebtn" onclick = "deleteUser(&#39;'+ result.users[user]._id + '&#39;)"><span class="fa fa-trash" style = "color: white"></span></button>' + '</td>' + '</tr>' + '</tbody>';
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

			// Initialize the checkbox to be applied by bootstrap toggle css
			$("[data-toggle='toggle']").bootstrapToggle();
		}

    };

	xhttp.open("GET","http://localhost:3000/api/users",true);	
    xhttp.send();
	
};

function addUser() {
    
    if(document.getElementById("role").value == "Pick a Role")
    {
        var element = document.getElementById("userAlert");
        element.classList.add("alert-danger");
        
        document.getElementById("userAlert").innerHTML = '<strong>Please pick a role!!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
    }

    if(document.getElementById("uemail").value === "")
    {
        document.getElementById("userAlert").innerHTML = '<strong>Please fill in your email!!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
    }
    
    if(document.getElementById("cupsd").value === "")
    {
        document.getElementById("userAlert").innerHTML = '<strong>Please fill in your confirm password!!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
    }
    
     if(document.getElementById("upsd").value === "")
    {
        document.getElementById("userAlert").innerHTML = '<strong>Please fill in your password!!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
    }
    
    if(document.getElementById("uname").value === "")
    {
        document.getElementById("userAlert").innerHTML = '<strong>Please fill in your name!!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
    } 
    
    if(document.getElementById("upsd").value !== document.getElementById("cupsd").value )
    {
        document.getElementById("userAlert").innerHTML = '<strong>Your Password and Confirm Password is not the same. Please fill in again!!</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
        $("#userAlert").show();
    }
    
    console.log
    
    if(document.getElementById("uname").value !== "" 
       && document.getElementById("upsd").value !== "" 
       && document.getElementById("cupsd").value !== "" 
       && document.getElementById("uemail").value !== "" 
       && document.getElementById("role").value !== "Pick a Role" 
       && (document.getElementById("upsd").value === document.getElementById("cupsd").value))
    {
        $("#spinner_adduser").show();
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';
        var url = 'http://localhost:3000/api/users';
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
                
                document.getElementById("showUser").innerHTML = "";
                var table = document.getElementById("showUser").innerHTML;
                table = showUserTable();
                
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
                
                document.getElementById("userAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserAlert()"><span>&times;</span></button>';
                
                $("#userAlert").show();
            }
        }

        xhttp.send(params); 

    }
};

function clear() {
    document.getElementById("uname").value = '';  
    document.getElementById("upsd").value = '';  
    document.getElementById("cupsd").value = '';  
    document.getElementById("uemail").value = '';  
    var r = document.getElementById("role");
    var role = r.options[r.selectedIndex].value = 'Pick a Role';
    document.getElementById("role").value = role;
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
            var r = document.getElementById("role");
            var role = r.options[r.selectedIndex].value = 'Pick a Role';
            document.getElementById("role").value = role;
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
        
				var url = 'http://localhost:3000/api/users/' + cells[0].innerHTML;
        
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
	var url = 'http://localhost:3000/api/users/' + id;
	var params = 'role=' + role;

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

        var url = 'http://localhost:3000/api/users/' + userIdDelete;

        xhttp.open("DELETE",url,true);

        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                $("#spinner").hide();

                document.getElementById("showUser").innerHTML = "";
                var table = document.getElementById("showUser").innerHTML;
                table = showUserTable();

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

function login(){

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
        var url = 'http://localhost:3000/api/users/login';
        var params = 'email=' + document.getElementById("loginEmail").value + '&password=' + document.getElementById("loginPassword").value;

                
        xhttp.open('POST',url,true);

        xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');

        xhttp.onreadystatechange = function() {

            if(xhttp.readyState == 4 && xhttp.status == 200) 
            {
                if(xhttp.response.status == "success")
                {
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
        var url = 'http://localhost:3000/api/users/forgotPassword';
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
                
                console.log(xhttp.response.message);
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
    
    
    if(document.getElementById("confirm_password").value === "") 
    {
        $("#spinner_reset").hide(); 
        
        document.getElementById("resetAlert").innerHTML = '<strong>Please fill in your confirm password!!</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
        $("#resetAlert").show();
    }
    
    if(document.getElementById("password").value === "")
    {
        $("#spinner_reset").hide(); 
        
        document.getElementById("resetAlert").innerHTML = '<strong>Please fill in your new password!!</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
        $("#resetAlert").show();
    }

    if(document.getElementById("password").value !== document.getElementById("confirm_password").value)
    {
        $("#spinner_reset").hide(); 
        
        document.getElementById("resetAlert").innerHTML = '<strong>Your new password and confirm password is not the same.\nPlease enter again!!</strong> <button type="button" class="close" onclick="closeResetAlert()"><span>&times;</span></button>';
        $("#resetAlert").show();
        
    }

    if(document.getElementById("password").value !== "" 
       && document.getElementById("confirm_password").value !== "" 
       && document.getElementById("password").value === document.getElementById("confirm_password").value)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';

        var url = 'http://localhost:3000/api/users/resetPassword';

        const token = window.location.pathname.split('/')[2];
        const password = document.getElementById("password").value;

        var params = `token=${token}&password=${password}`;

        xhttp.open('POST', url, true);

        xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');

        xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                if (xhttp.response.message == 'success') {
                    $("#spinner_reset").hide(); 
                    
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
    var table = '#userTable'
    $('#maxRows').on('change', function(){
        $('.pagination').html('')
        var trnum = 0
        var maxRows = parseInt($(this).val())
        var totalRows = $(table+' tbody tr').length
        $(table+' tr:gt(0)').each(function(){
            trnum++
            if(trnum > maxRows){
                $(this).hide()
            }
            if(trnum <= maxRows){
                $(this).show()
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
                    $(this).hide()
                } else{
                    $(this).show()
                }
            })
        })
    })
}

function onLogout() {
	window.location.replace('/login');

	var cookies = document.cookie.split(";");
	
	document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	document.cookie = "io=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
		var url = 'http://localhost:3000/api/rooms';
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
const dashTrendChart = document.getElementById('dashTrendChart').getContext('2d');

const peopleGradient = dashTrendChart.createLinearGradient(500, 0, 100, 0);
peopleGradient.addColorStop(0, "#667eea");
peopleGradient.addColorStop(1, "#764ba2");

const tempGradient = dashTrendChart.createLinearGradient(500, 0, 100, 0);
tempGradient.addColorStop(0, "#fc4a1a");
tempGradient.addColorStop(1, "#f7b733");

const humidGradient = dashTrendChart.createLinearGradient(500, 0, 100, 0);
humidGradient.addColorStop(0, "#ff758c");
humidGradient.addColorStop(1, "#ff7eb3");

const trendChart = new Chart(dashTrendChart, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
        datasets: [{
            label: 'Number of People',
            backgroundColor: peopleGradient,
            borderColor: peopleGradient,
						data: ["19", "20", "15", "17", "10", "25", "30"],
						fill: false
						},
						{
							label: 'Temperature',
							backgroundColor: tempGradient,
							borderColor: tempGradient,
							data: ["24", "23.5", "24.3", "24", "26", "25.1", "25.5"],
							fill: false
						},
						{
							label: 'Humidity',
							backgroundColor: humidGradient,
							borderColor: humidGradient,
							data: ["78", "68", "69", "59", "72", "62", "70"],
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


$( ".closeBtn" ).click(function() {
  $(this.parentNode).fadeOut(500 , function() {
		const noticeNum = document.getElementById('noticeNum');
		noticeNum.innerHTML -= 1;

		if (noticeNum.innerHTML == 0) {
			const emptyNotice = document.getElementById('emptyNotice');

			const noticeNum = document.getElementById('noticeNum');
			noticeNum.style.display = "none";

			$(emptyNotice).fadeIn(1500 , function() {
				emptyNotice.style.display = "block";
			});
		}
	});
});


$( "#clearNotice" ).click(function() {
	const allNotice = this.parentNode.parentNode.getElementsByTagName('p');
	const emptyNotice = document.getElementById('emptyNotice');

  $(allNotice).fadeOut(300 , function() {
		const noticeNum = document.getElementById('noticeNum');
		noticeNum.style.display = "none";
	});

	$(emptyNotice).fadeIn(1500 , function() {
		emptyNotice.style.display = "block";
	});
});


function onRoomClicked(roomName) {
	document.getElementById('insightRoom').innerHTML = roomName;
	document.getElementById('trendRoom').innerHTML = roomName;
}