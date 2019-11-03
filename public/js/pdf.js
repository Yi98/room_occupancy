const PDFDocument = require("pdfkit");
const blobStream  = require('blob-stream');
const canvg = require("canvg");

// Bugs:
// 1. Maybe change the implementation to sending the request to server or client and the data are contain within the url.
// 1. When hard reload the pdf file won't load
// 2. When ctrl+shift+tab the pdf file won't display the previous one
// 3. The design for the pdf file is not yet set
// 4. Some don't need to assigned to 'let' and can be straight away used in a function
window.generateReport = function (data, peopleChart, temperatureChart, humidityChart) {
    let doc = new PDFDocument();
    
    sessionStorage.setItem("passRoom", data.room_name);
    
    sessionStorage.setItem("passDate", data.date_range);

    doc.info['Title'] = `${data.room_name} Report (${data.date_range})`;

    let canvas = document.createElement("CANVAS");

    canvg(canvas, peopleChart);
    let peopleChart64 = canvas.toDataURL("image/png").slice('data:image/png;base64,'.length);
    
    sessionStorage.setItem("passPeople", peopleChart64);

    canvg(canvas, temperatureChart);
    let temperatureChart64 = canvas.toDataURL("image/png").slice('data:image/png;base64,'.length);
    
    sessionStorage.setItem("passTemperature", temperatureChart64);

    canvg(canvas, humidityChart);
    let humidityChart64 = canvas.toDataURL("image/png").slice('data:image/png;base64,'.length);
    
    sessionStorage.setItem("passHumidity", humidityChart64);

    let stream = doc.pipe(blobStream());

    // Report Title
    doc.font("Helvetica");
    doc.fontSize(17).text("Report on " + data.room_name, {align: "center"});
    doc.moveDown();

    // Report Date
    doc.font("Helvetica");
    doc.fontSize(17).text("Date: " + data.date_range, {align:"center"});
    doc.moveDown();

    // Insight Title
    doc.font("Helvetica-Bold");
    doc.fontSize(17).text("Insights", 50, 170, {align: "center"}).fillColor('red').fill('yellow');

    // Insight Title-Points separator line
    doc.font("Helvetica");
    doc.moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke();
    doc.moveDown();
    
    // Insights points
    //Date with most number of people
    doc.rect(50, 220, 240, 100).fillAndStroke('#3333FF', '#000000').fillColor('white');
    doc.fontSize(12).text("Date with most number of people:", 80, 240);
    doc.moveDown();
    doc.fontSize(12).text("10 Jan 2019 4:00AM - 5:00AM", 90, doc.y);
    doc.moveDown();
    doc.fontSize(12).text("100 People", 140, doc.y);
    doc.moveDown();
    
    //Date with lowest number of people
    doc.rect(320, 220, 240, 100).fillAndStroke('#3333FF', '#000000').fillColor('white');
    doc.fontSize(12).text("Date with lowest number of people:" , 350, 240);
    doc.moveDown();
    doc.fontSize(12).text("1 Jan 2019 4:00AM - 5:00AM" , 360, doc.y);
    doc.moveDown();
    doc.fontSize(12).text("6 People" , 410, doc.y);
    doc.moveDown();
    
    //Date with highest temperature
    doc.rect(50, 360, 240, 100).fillAndStroke('#FF9933', '#000000').fillColor('white');
    doc.fontSize(12).text("Date with highest temperature:", 80, 380);
    doc.moveDown();
    doc.fontSize(12).text("10 Jan 2019 2:00PM - 3:00PM", 90, doc.y);
    doc.moveDown();
    doc.fontSize(12).text("35 Celsius", 140, doc.y);
    doc.moveDown();
    
    //Date with lowest temperature
    doc.rect(320, 360, 240, 100).fillAndStroke('#FF9933', '#000000').fillColor('white');
    doc.fontSize(12).text("Date with lowest temperature:", 350, 380);
    doc.moveDown();
    doc.fontSize(12).text("15 Jan 2019 12:00AM - 1:00AM", 360, doc.y);
    doc.moveDown();
    doc.fontSize(12).text("23 Celsius", 410, doc.y);
    doc.moveDown();
    
    //Date with highest humidity
    doc.rect(50, 500, 240, 100).fillAndStroke('#FF3399', '#000000').fillColor('white');
    doc.fontSize(12).text("Date with highest humidity:", 80, 520);
    doc.moveDown();
    doc.fontSize(12).text("15 Jan 2019 4:00AM - 5:00AM", 90, doc.y);
    doc.moveDown();
    doc.fontSize(12).text("80 %", 140, doc.y);
    doc.moveDown();
    
    //Date with lowest humidity
    doc.rect(320, 500, 240, 100).fillAndStroke('#FF3399', '#000000').fillColor('white');
    doc.fontSize(12).text("Date with lowest humidity:", 350, 520);
    doc.moveDown();
    doc.fontSize(12).text("19 Jan 2019 8:00PM - 9:00PM", 360, doc.y);
    doc.moveDown();
    doc.fontSize(12).text("33 %", 410, doc.y);
    doc.moveDown();

    doc.font("Helvetica");
    doc.moveTo(doc.x, doc.y)
       .stroke();
    doc.moveDown();
    
    // Move to next page
    doc.moveDown(doc.page.height);
    
    doc.fillColor('black');
    
    // Charts' title
    doc.font("Helvetica-Bold");
    doc.fontSize(17).text("Charts", 50, doc.y, {align: "center"});

    // Charts' title-charts separator line
    doc.font("Helvetica");
    doc.moveTo(doc.x, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke();
    doc.moveDown();

    // Number of People's chart on specific time range
    doc.fillColor('#3333FF');
    doc.fontSize(15).text("Number of People from " + data.date_range, 140, doc.y);
    let peopleChartFinal = new Buffer(peopleChart64, "base64");
    doc.image(peopleChartFinal, 70, doc.y, {height:300});
    
    doc.moveDown();

    // Temperature's chart on specific time range
    doc.fillColor('#FF9933');
    doc.fontSize(15).text("Temperature from " + data.date_range, 140, doc.y);
    let temperatureChartFinal = new Buffer(temperatureChart64, "base64");
    doc.image(temperatureChartFinal, 70, doc.y, {height:300});

    // Move to next page
    doc.moveDown(doc.page.height);

    // Humidity's chart on specific time range
    doc.fillColor('#FF3399');
    doc.fontSize(15).text("Humidity for " + data.date_range, 140, doc.y);
    let humidityChartFinal = new Buffer(humidityChart64, "base64");
    doc.image(humidityChartFinal, 70, doc.y, {height:300});

    // End of the PDF document
    doc.end();
    stream.on('finish', function() {
        document.getElementById('pdf-display').src = stream.toBlobURL('application/pdf');
    });	
}


//check whether page is refresh
if (performance.navigation.type == 1) {
    
    var room = sessionStorage.getItem("passRoom");
    var date = sessionStorage.getItem("passDate");
    var ppl = sessionStorage.getItem("passPeople");
    var temp = sessionStorage.getItem("passTemperature");
    var hmd = sessionStorage.getItem("passHumidity");
    
    if(sessionStorage.getItem("passPeople")){
        
        let doc = new PDFDocument();

        doc.info['Title'] = `${room} Report (${date})`;

        let stream = doc.pipe(blobStream());

        // Report Title
        doc.font("Helvetica");
        doc.fontSize(17).text("Report on " + room, {align: "center"});
        doc.moveDown();

        // Report Date
        doc.font("Helvetica");
        doc.fontSize(17).text("Date: " + date, {align:"center"});
        doc.moveDown();

        // Insight Title
        doc.font("Helvetica-Bold");
        doc.fontSize(17).text("Insights", 50, 170, {align: "center"}).fillColor('red').fill('yellow');

        // Insight Title-Points separator line
        doc.font("Helvetica");
        doc.moveTo(50, doc.y)
           .lineTo(doc.page.width - 50, doc.y)
           .stroke();
        doc.moveDown();

        // Insights points
        //Date with most number of people
        doc.rect(50, 220, 240, 100).fillAndStroke('#3333FF', '#000000').fillColor('white');
        doc.fontSize(12).text("Date with most number of people:", 80, 240);
        doc.moveDown();
        doc.fontSize(12).text("10 Jan 2019 4:00AM - 5:00AM", 90, doc.y);
        doc.moveDown();
        doc.fontSize(12).text("100 People", 140, doc.y);
        doc.moveDown();

        //Date with lowest number of people
        doc.rect(320, 220, 240, 100).fillAndStroke('#3333FF', '#000000').fillColor('white');
        doc.fontSize(12).text("Date with lowest number of people:" , 350, 240);
        doc.moveDown();
        doc.fontSize(12).text("1 Jan 2019 4:00AM - 5:00AM" , 360, doc.y);
        doc.moveDown();
        doc.fontSize(12).text("6 People" , 410, doc.y);
        doc.moveDown();

        //Date with highest temperature
        doc.rect(50, 360, 240, 100).fillAndStroke('#FF9933', '#000000').fillColor('white');
        doc.fontSize(12).text("Date with highest temperature:", 80, 380);
        doc.moveDown();
        doc.fontSize(12).text("10 Jan 2019 2:00PM - 3:00PM", 90, doc.y);
        doc.moveDown();
        doc.fontSize(12).text("35 Celsius", 140, doc.y);
        doc.moveDown();

        //Date with lowest temperature
        doc.rect(320, 360, 240, 100).fillAndStroke('#FF9933', '#000000').fillColor('white');
        doc.fontSize(12).text("Date with lowest temperature:", 350, 380);
        doc.moveDown();
        doc.fontSize(12).text("15 Jan 2019 12:00AM - 1:00AM", 360, doc.y);
        doc.moveDown();
        doc.fontSize(12).text("23 Celsius", 410, doc.y);
        doc.moveDown();

        //Date with highest humidity
        doc.rect(50, 500, 240, 100).fillAndStroke('#FF3399', '#000000').fillColor('white');
        doc.fontSize(12).text("Date with highest humidity:", 80, 520);
        doc.moveDown();
        doc.fontSize(12).text("15 Jan 2019 4:00AM - 5:00AM", 90, doc.y);
        doc.moveDown();
        doc.fontSize(12).text("80 %", 140, doc.y);
        doc.moveDown();

        //Date with lowest humidity
        doc.rect(320, 500, 240, 100).fillAndStroke('#FF3399', '#000000').fillColor('white');
        doc.fontSize(12).text("Date with lowest humidity:", 350, 520);
        doc.moveDown();
        doc.fontSize(12).text("19 Jan 2019 8:00PM - 9:00PM", 360, doc.y);
        doc.moveDown();
        doc.fontSize(12).text("33 %", 410, doc.y);
        doc.moveDown();

        doc.font("Helvetica");
        doc.moveTo(doc.x, doc.y)
           .stroke();
        doc.moveDown();

        // Move to next page
        doc.moveDown(doc.page.height);

        doc.fillColor('black');

        // Charts' title
        doc.font("Helvetica-Bold");
        doc.fontSize(17).text("Charts", 50, doc.y, {align: "center"});

        // Charts' title-charts separator line
        doc.font("Helvetica");
        doc.moveTo(doc.x, doc.y)
           .lineTo(doc.page.width - 50, doc.y)
           .stroke();
        doc.moveDown();

        // Number of People's chart on specific time range
        doc.fillColor('#3333FF');
        doc.fontSize(15).text("Number of People from " + date, 140, doc.y);
        let peopleChartFinal = new Buffer(ppl, "base64");
        doc.image(peopleChartFinal, 70, doc.y, {height:300});

        doc.moveDown();

        // Temperature's chart on specific time range
        doc.fillColor('#FF9933');
        doc.fontSize(15).text("Temperature from " + date, 140, doc.y);
        let temperatureChartFinal = new Buffer(temp, "base64");
        doc.image(temperatureChartFinal, 70, doc.y, {height:300});

        // Move to next page
        doc.moveDown(doc.page.height);

        // Humidity's chart on specific time range
        doc.fillColor('#FF3399');
        doc.fontSize(15).text("Humidity for " + date, 140, doc.y);
        let humidityChartFinal = new Buffer(hmd, "base64");
        doc.image(humidityChartFinal, 70, doc.y, {height:300});

        // End of the PDF document
        doc.end();
        stream.on('finish', function() {
            document.getElementById('pdf-display').src = stream.toBlobURL('application/pdf');
        });	
        
    }
} 