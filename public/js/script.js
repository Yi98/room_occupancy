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
			document.getElementById("showRoom").innerHTML += '<div class="room-card col-md-4 col-sm-4 col-xs-6" ><a onclick="window.open(\'/chart\')"><div class="img-thumbnail">' +
									'<h4>' + result.rooms[room].name + '</h4>' +
									'<p>' + 'Number of People: ' + result.rooms[room].people.length + '</p>' +
									'<p>' + 'Temperature: ' + "<span class='temperature'>0</span>" + '&#x2103;</p>' +
									'<p>' + 'Humidity: ' + "<span class='humidity'>0</span>" + '</p>' + 
                  '<p>' + 'Status: ' + statusMsg + '<p>' + 
                  '<p class="room-id" style="display:none">'+ result.rooms[room]._id +'<p></div></a></div>';
		};
	}
};

xhttp.open("GET","http://localhost:3000/api/room",true);
xhttp.send();
	
};

function showChart(){
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	
	xhr.onreadystatechange = function (){
		if(this.readyState == 4 && this.status == 200){
			var result = this.response;
			for(var room in result.rooms){
				
			}
			
			
		}
	};
	xhr.open("GET","http://localhost:3000/api/room",true);
	xhr.send();
};