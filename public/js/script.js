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

function showChart(){
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
	
	xhr.onreadystatechange = function (){
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
			
			
			Highcharts.chart('peopleChart', {
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
			
			Highcharts.chart('temperatureChart', {
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
			
			Highcharts.chart('humidityChart', {
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

function showUserTable(){
var xhttp = new XMLHttpRequest();
xhttp.responseType = 'json';

xhttp.onreadystatechange = function () {
	if(this.readyState == 4 && this.status == 200) {
		var result = this.response;
		for(var user in result.users){
			document.getElementById("showUser").innerHTML += 
            '<tbody>' + 
            '<td>' + result.users[user]._id + '</td>' +
            '<td>' + result.users[user].username + '</td>' +
            '<td>' + result.users[user].email + '</td>' +
            '<td>' + 'empty' + '</td>' +
            '<td>' + result.users[user].role + '</td>' +
            '<td>' + '<button class = "btn btn-success" onclick = "showModal()"><span class="fa fa-edit" style = "color: white"></span></button>' + '</td>' +
            '<td>' + '<button class = "btn btn-danger"><span class="fa fa-trash" style = "color: white"></span></button>' + '</td>' + '</tr>' + '</tbody>';
                                   
		};
	}
};

xhttp.open("GET","http://localhost:3000/api/users",true);
xhttp.send();
	
};


function addUser() {
    var xhttp = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/users';
    var params = 'role=' + document.getElementById("role").value 
                + '&username=' + document.getElementById("uname").value 
                + '&email=' + document.getElementById('uemail').value
                + '&password=' + document.getElementById('upsd').value;
    
    xhttp.open('POST',url,true);
    
    xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    
    alert('A new user has been add!!');
    
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            alert(xhttp.responseText);
        }
    }
    
    xhttp.send(params); 
    
    clear();

};

//function show() {
//  console.log(document.getElementById("uname").value);  
//  console.log(document.getElementById("upsd").value);  
//  console.log(document.getElementById("cupsd").value);  
//  console.log(document.getElementById("uemail").value);  
//  console.log(document.getElementById("unumber").value);  
//    
//};

function clear() {
    document.getElementById("uname").value = '';  
    document.getElementById("upsd").value = '';  
    document.getElementById("cupsd").value = '';  
    document.getElementById("uemail").value = '';  
    document.getElementById("unumber").value = '';  
    var r = document.getElementById("role");
    var role = r.options[r.selectedIndex].value = 'Pick a Role';
    document.getElementById("role").value = role;
};


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

function updateUser() {
 
    var xhttp = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/users/' + document.getElementById("id").value;
    var params = 'role=' + document.getElementById("edit_role").value;
    
    xhttp.open('PUT',url,true);
    
    xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) 
        {
            alert("Update user successfully!!");
        }
    }
    
    xhttp.send(params); 
    
    closeModal();
  
};


function closeModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
};

