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
                '<td>' + result.users[user].role + '</td>' +
                '<td>' + '<button class = "btn btn-success" id = "editbtn" onclick = "showModal()"><span class="fa fa-edit" style = "color: white"></span></button>' + '</td>' +
                '<td>' + '<button class = "btn btn-danger" id = "deletebtn" onclick = "deleteUser()"><span class="fa fa-trash" style = "color: white"></span></button>' + '</td>' + '</tr>' + '</tbody>';

            };
        }
    };

    xhttp.open("GET","http://localhost:3000/api/users",true);
    xhttp.send();
	
};


function addUser() {
    
    if(document.getElementById("role").value === "Pick a Role")
    {
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

function updateUser() {
    
    if(document.getElementById("previousRole").value !== document.getElementById("edit_role").value)
    {
        $("#spinner").show();
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';
        var url = 'http://localhost:3000/api/users/' + document.getElementById("id").value;
        var params = 'role=' + document.getElementById("edit_role").value;

        xhttp.open('PUT',url,true);
        

        xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');

        xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == 200) 
            {
                $("#spinner").hide();
                
                document.getElementById("showUser").innerHTML = "";
                var table = document.getElementById("showUser").innerHTML;
                table = showUserTable();
                
                document.getElementById("userEditAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserEditAlert()"><span>&times;</span></button>';
                $("#userEditAlert").show();
            }
        }

        xhttp.send(params); 
        
        closeModal();
    }
    else
    {
        document.getElementById("userEditModalAlert").innerHTML = '<strong>User role remain the same.\nTo update please change the role else click cancel</strong> <button type="button" class="close" onclick="closeUserEditModalAlert()"><span>&times;</span></button>';
        $("#userEditModalAlert").show();
    }
};


function closeModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
};

function deleteUser(){
    $("#spinner").show();
    
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
        
        var answer = window.confirm("Are you sure you want to delete this user?");
        if (answer)
        {
            var xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';

            var url = 'http://localhost:3000/api/users/' + cells[0].innerHTML;

            xhttp.onreadystatechange = function () {
                if(this.readyState == 4 && this.status == 200) {
                    $("#spinner").hide();
                    
                    document.getElementById("showUser").innerHTML = "";
                    var table = document.getElementById("showUser").innerHTML;
                    table = showUserTable();
                    
                    document.getElementById("userEditAlert").innerHTML = '<strong>' + xhttp.response.message + '</strong> <button type="button" class="close" onclick="closeUserEditAlert()"><span>&times;</span></button>';
                    $("#userEditAlert").show();
                }
            };

            xhttp.open("DELETE",url,true);

            xhttp.send();
        }
        else
        {
            $("#spinner").hide();
        }
    };
};


function loginPage() {
    $("#spinner_login").hide(); 
    $("#spinner_forget").hide(); 
    $("#loginAlert").hide();
    $("#forgetAlert").hide();
};

function login(){
    
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
    $('.alert').alert('close');
};

function checkEmail(){
    
    $("#spinner_forget").show();
    
    if(document.getElementById("forgetEmail").value === "")
    {
        $("#spinner_forget").hide();
        
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
                document.getElementById("forgetAlert").innerHTML = '<strong>' + xhttp.response.message +'</strong> <button type="button" class="close" onclick="closeForgetAlert()"><span>&times;</span></button>';
                $("#forgetAlert").show();
                document.getElementById("forgetEmail").value = "";

            }

            if(xhttp.status == 404) 
            {
                $("#spinner_forget").hide(); 
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
                    
                    alert("Successfully reset password");                    
                    
                    window.location.replace("/login");
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