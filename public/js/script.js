const canvg = require("canvg");

//$(document).ready(function(){
//		var date_input=$('input[name="startDate"]'); //our date input has the name "startDate"
//		date_input.datepicker({
//			format: 'dd/mm/yyyy',
//			todayHighlight: true,
//			autoclose: true,
//		})  
//        
//    var date_input=$('input[name="endDate"]'); //our date input has the name "endDate"
//		date_input.datepicker({
//			format: 'dd/mm/yyyy',
//			todayHighlight: true,
//			autoclose: true,
//		})
//		
//		var date_input=$('input[name="date"]'); //our date input has the name "date"
//		date_input.datepicker({
//			format: 'dd/mm/yyyy',
//			todayHighlight: true,
//			autoclose: true,
//		})
//});
//$(document).ready(function(){
//  $('[data-toggle="tooltip"]').tooltip();
//});

var socket = io();
	socket.on("sensor", function(msg) {
		console.log(msg.temperature);
		// for loop assign to all room their respective sensor data
		roomCards = document.getElementsByClassName("room-card");
		for (let i = 0; i < roomCards.length; i++) {
			roomId = roomCards[i].getElementsByClassName("room-id");
			if (roomId[0].innerHTML == msg.roomId) {
				document.getElementsByClassName("temperature")[i].innerHTML = msg.temperature;
				document.getElementsByClassName("humidity")[i].innerHTML = msg.humidity;
			}
		}
	});


function showDashboard(){
var xhttp = new XMLHttpRequest();
xhttp.responseType = 'json';

xhttp.onreadystatechange = function () {
	if(this.readyState == 4 && this.status == 200) {
		var result = this.response;
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
			document.getElementById("showRoom").innerHTML += '<div class="room-card col-md-4 col-sm-4 col-xs-6" ><a onclick="window.open(\'/chart/' + result.rooms[room]._id + '\')"><div class="img-thumbnail">' +
									'<h4>' + result.rooms[room].name + '</h4>' +
									'<p>' + 'Number of People: ' + result.rooms[room].people.length + '</p>' +
									'<p>' + 'Temperature: ' + "<span class='temperature'>0</span>" + '&#x2103;</p>' +
									'<p>' + 'Humidity: ' + "<span class='humidity'>0</span>" + '</p>' + 
                  '<p>' + 'Status: ' + statusMsg + '</p></div></a></div>';
		}
	}
};

xhttp.open("GET","http://localhost:3000/api/rooms",true);
xhttp.send();
	
};

function showChart() {
	var url_string = window.location.href;
	var url = new URL(url_string);
	var pathname = url.pathname;
	var split = pathname.split("/"); 
	var roomId = split[2];	
	var peopleNo = []; //No of people in array from Jan-Dec
	var tempNo = []; //Temperature value in array from Jan-Dec
	var humidNo = []; //Humidity value in array from Jan-Dec
	
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	
	xhr.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200){
			var result = this.response;	
			var tp = []; 
			var counter = [];
			for(var room in result.rooms){	
				if(result.rooms[room]._id == roomId){
					
					for(var i = 0; i < 12; i++){
							tp[i] = 0;
							counter[i] = 0;
					}
					
					for(var people in result.rooms[room].people){
						var time = result.rooms[room].people[people].time;
						var date = new Date(time);
						
						for(var i = 0; i < 12; i ++){
							if(date.getMonth() == i+1)
								tp[i] += result.rooms[room].people[people].data;
								counter[i] = counter[i] + 1;
						}
						
						for(var i = 0; i < 12; i++){
							peopleNo[i] = (tp[i]/counter[i]).toFixed(1);
							peopleNo[i] = parseInt(peopleNo[i]);
						}						
					}

					for(var i = 0; i < 12; i++){
							tp[i] = 0;
							counter[i] = 0;
					}
					
					for(var temp in result.rooms[room].temperature){
						var time = result.rooms[room].temperature[temp].time;
						var date = new Date(time);
						for(var i = 0; i < 12; i++){
							if(date.getMonth() == i+1)
								tp[i] += result.rooms[room].temperature[temp].data;
								counter[i] = counter[i] + 1;
						}
						
						for(var i = 0; i < 12; i++){
							tempNo[i] = (tp[i]/counter[i]).toFixed(1);
							tempNo[i] = parseInt(tempNo[i]);
						}
						
					}
					
					for(var i = 0; i < 12; i++){
							tp[i] = 0;
							counter[i] = 0;
					}
					
					for(var humid in result.rooms[room].humidity){
						var time = result.rooms[room].humidity[humid].time;
						var date = new Date(time);
						for(var i = 0; i < 12; i++){
							if(date.getMonth() == i+1)
								tp[i] += result.rooms[room].humidity[humid].data;
								counter[i] = counter[i] + 1;
						}
						
						for(var i = 0; i < 12; i++){
							humidNo[i] = (tp[i]/counter[i]).toFixed(1);
							humidNo[i] = parseInt(humidNo[i]);
						}
					}
					
				}
			}
			
			new Highcharts.chart('peopleChart', {
					title: {
							text: 'Number Of People'
					},
					xAxis: {
							categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
					},
					series: [{
							data: peopleNo,
							name: 'People Count'
					}]
			});

			new Highcharts.chart('temperatureChart', {
					title: {
							text: 'Temperature'
					},
					xAxis: {
							categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
					},
					series: [{
							data: tempNo,
							name: 'Temperature'
					}]
			});
			
			new Highcharts.chart('humidityChart', {
					title: {
							text: 'Humidity'
					},
					xAxis: {
							categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
					},
					series: [{
							data: humidNo,
							name: 'Humidity'
					}]
			});
		}
	};
	xhr.open("GET","http://localhost:3000/api/rooms" ,true);
	xhr.send();
};

// Bugs:
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

	// After the window load, run the function in the new opened window with those parameters
	report_window.addEventListener("load", function() {
		report_window.generateReport({}, peopleChart, temperatureChart, humidityChart);
	})
}

function showUserTable(){
var xhttp = new XMLHttpRequest();
xhttp.responseType = 'json';

xhttp.onreadystatechange = function () {
	if(this.readyState == 4 && this.status == 200) {
		var result = this.response;
		for(var user in result.users){
			document.getElementById("showUser").innerHTML += '<div class="table-responsive" style = "text-align: center"><table class = "table table-striped table-hover">' + '<tr>' + '<th>' + 'UserID' + '</th>' +
            '<th>' + 'Name' + '</th>' +
            '<th>' + 'Email' + '</th>' +
            '<th>' + 'Contact Number' + '</th>' +
            '<th>' + 'Role' + '</th>' +
            '<th>' + 'Edit' + '</th>' +
            '<th>' + 'Delete' + '</th>' +'</tr>' + '<tr>' +
            '<td>' + result.users[user]._id + '</td>' +
            '<td>' + result.users[user].username + '</td>' +
            '<td>' + result.users[user].email + '</td>' +
            '<td>' + 'empty' + '</td>' +
            '<td>' + result.users[user].role + '</td>' +
            '<td>' + '<button class = "btn btn-success" onclick = "showModal()"><span class="fa fa-edit" style = "color: white"></span></button>' + '</td>' +
            '<td>' + '<button class = "btn btn-danger"><span class="fa fa-trash" style = "color: white"></span></button>' + '</td>' + '</tr>' + '</table></div>';
                                   
		};
	}
};

xhttp.open("GET","http://localhost:3000/api/users",true);
xhttp.send();
	
};


//function addUser(){
//var xhttp = new XMLHttpRequest();
////xhttp.responseType = 'json';
//
//xhttp.onreadystatechange = function () {
//	if(this.readyState == 4 && this.status == 200) {
//		var result = this.response;
////        console.log(document.getElementById("uemail").value);
//        document.getElementById("uemail").innerHTML = result;
//	}
//};
//
//xhttp.open("POST","http://localhost:3000/api/users",true);
//xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//xhttp.send("email=alice@gmail.com");
//	
//};
//

function addUser() {
  var xhttp = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/users';
    var params = 'username=peter&email=peter@gmail.com&password=12345';
    xhttp.open('POST',url,true);
    
    xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            alert(xhttp.responseText);
        }
    }
    
    xhttp.send(params);


//let data = JSON.stringify({
//    email: document.getElementById("uemail").value,
//    password: document.getElementById("upsd").value
//});
//
//xhttp.open("POST","http://localhost:3000/api/users");
//xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
//xhttp.send(data);  
//    
//xhttp.onload = function (){
//var users = JSON.parse(xhttp.responseText);
//if (xhttp.readyState == 4 & xhttp.status == "201") {
//    console.table(users);
//} 
//else
//{
//    console.error(users);
//}
//}    

};

//function show() {
//  console.log(document.getElementById("uname").value);  
//  console.log(document.getElementById("upsd").value);  
//  console.log(document.getElementById("cupsd").value);  
//  console.log(document.getElementById("uemail").value);  
//  console.log(document.getElementById("unumber").value);  
//    
//};



function cancel() {
    var answer = window.confirm("Are you sure you want to clear?");
    if (answer)
    {
        document.getElementById("uname").value = '';  
        document.getElementById("upsd").value = '';  
        document.getElementById("cupsd").value = '';  
        document.getElementById("uemail").value = '';  
        document.getElementById("unumber").value = '';  
        var r = document.getElementById("role");
        var role = r.options[r.selectedIndex].value = 'Pick a Role';
        document.getElementById("role").value = role;
    }   

};

function showModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
};

function closeModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
};

function editUser(){
    
};
