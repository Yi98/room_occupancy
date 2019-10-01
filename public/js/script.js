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

<<<<<<< HEAD
//$(document).ready(function() {
//		$('.tooltip').tooltipster();
//});
//
//$('.tooltip').tooltipster({
//    theme: 'tooltipster-noir'
//});

function showDashboard(){
var xhttp = new XMLHttpRequest();
xhttp.responseType = 'json';

xhttp.onreadystatechange = function () {
	if(this.readyState == 4 && this.status == 200) {
		var result = this.response;
		console.log(result);
//		document.getElementById("test").innerHTML = ;
	}
};

xhttp.open("GET","http://localhost:3000/api/room",true);
xhttp.send();
	
};
=======
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});


var filesLoaded = 0;

var files = {
  img1: {
    url: "https://pdfkit.org/docs/images/test.jpeg"
  },
  img2: {
    url: "https://pbs.twimg.com/profile_images/519367942866104320/PB96rDH_.png"
  },
  img3: {
    url:
      "https://img.freepik.com/free-icon/github-character-silhouette_318-40485.jpg?size=338&ext=jpg"
  }
};

var doc = new PDFDocument({
  layout: "landscape",
  size: [311.83, 595.28],
  margins: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});
var stream = doc.pipe(blobStream());

function loadedFile(xhr) {
  for (var file in files) {
    if (files[file].url === xhr.responseURL) {
      files[file].data = xhr.response;
    }
  }
  filesLoaded += 1;
  if (filesLoaded == Object.keys(files).length) {
    showPDF();
  }
}

for (var file in files) {
  files[file].xhr = new XMLHttpRequest();
  files[file].xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      loadedFile(this);
    }
  };
  files[file].xhr.responseType = "arraybuffer";
  files[file].xhr.open("GET", files[file].url);
  files[file].xhr.send(null);
}

function showPDF() {
  doc.rect(10, 10, 430, 20).fill("#000000");
  doc.rect(450, 10, 135, 20).fill("#000000");

  doc
    .moveTo(10, 180)
    .lineTo(430, 180)
    .stroke();
  doc
    .moveTo(10, 240)
    .lineTo(310, 240)
    .stroke();
  doc
    .moveTo(10, 280)
    .lineTo(310, 280)
    .stroke();
  doc
    .moveTo(445, 10)
    .lineTo(445, 300)
    .dash(5)
    .stroke();

  // pass loaded ArrayBuffer data instead of a path to image
  doc.image(files.img1.data, 455, 80, { fit: [80, 80] });
  doc.image(files.img2.data, 455, 200, { fit: [80, 80] });
  doc.image(files.img3.data, 350, 200, { fit: [80, 80] });

  doc.fontSize(17);
  doc.fillColor("white").text("TEST1", 12, 13);
  doc.fillColor("white").text("TEST2", 452, 13);

  doc.end();
}

const a = document.createElement("a");
document.body.appendChild(a);
a.style = "display: none";

let blob = null;

function download() {
  if (!blob) return;
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'test.pdf';
  a.click();
  window.URL.revokeObjectURL(url);
}

stream.on("finish", function() {
   // get a blob you can do whatever you like with
  blob = stream.toBlob("application/pdf");

  const url = stream.toBlobURL('application/pdf');
  const iframe = document.querySelector('iframe')
  iframe.src = url;
});

>>>>>>> 8ca46d11a651aba1adfe8665cd0cc0977ba52bb9
