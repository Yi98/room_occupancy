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

    doc.info['Title'] = `${data.room_name} Report (${data.date_range})`;

    let canvas = document.createElement("CANVAS");

    canvg(canvas, peopleChart);
    let peopleChart64 = canvas.toDataURL("image/png").slice('data:image/png;base64,'.length);

    canvg(canvas, temperatureChart);
    let temperatureChart64 = canvas.toDataURL("image/png").slice('data:image/png;base64,'.length);

    canvg(canvas, humidityChart);
    let humidityChart64 = canvas.toDataURL("image/png").slice('data:image/png;base64,'.length);

    let stream = doc.pipe(blobStream());

    // Report Title
    doc.font("Helvetica");
    doc.fontSize(15).text("Report on " + data.room_name, {align:"center"});
    doc.moveDown();

    // Report Date
    doc.font("Helvetica");
    doc.fontSize(15).text("Date: " + data.date_range, {align:"center"});
    doc.moveDown();

    // Insight Title
    doc.font("Helvetica-Bold");
    doc.fontSize(15).text("Insights", 50, doc.y);

    // Insight Title-Points separator line
    doc.font("Helvetica");
    doc.moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke();
    doc.moveDown();
    
    // Insights points
    doc.fontSize(10).text("Date with most number of people: 10 Jan 2019 4:00AM - 5:00AM - 100 People", 50, doc.y);
    doc.moveDown();
    doc.fontSize(10).text("Date with lowest number of people: 1 Jan 2019 4:00AM - 5:00AM - 6 People" , 50, doc.y);
    doc.moveDown();
    doc.fontSize(10).text("Date with highest temperature: 10 Jan 2019 2:00PM - 3:00PM - 35 Celsius", 50, doc.y);
    doc.moveDown();
    doc.fontSize(10).text("Date with lowest temperature: 15 Jan 2019 12:00AM - 1:00AM - 23 Celsius", 50, doc.y);
    doc.moveDown();
    doc.fontSize(10).text("Date with highest humidity: 15 Jan 2019 4:00AM - 5:00AM - 80 %", 50, doc.y);
    doc.moveDown();
    doc.fontSize(10).text("Date with lowest humidity: 19 Jan 2019 8:00PM - 9:00PM - 33 %", 50, doc.y);
    doc.moveDown();

    // Charts' title
    doc.font("Helvetica-Bold");
    doc.fontSize(15).text("Charts", 50, doc.y);

    // Charts' title-charts separator line
    doc.font("Helvetica");
    doc.moveTo(doc.x, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke();
    doc.moveDown();

    // Number of People's chart on specific time range
    doc.fontSize(15).text("Number of People from " + data.date_range, 50, doc.y);
    let peopleChartFinal = new Buffer(peopleChart64, "base64");
    doc.image(peopleChartFinal, {height:300});

    // Move to next page
    doc.moveDown(doc.page.height);

    // Temperature's chart on specific time range
    doc.fontSize(15).text("Temperature from " + data.date_range, 50, doc.y);
    let temperatureChartFinal = new Buffer(temperatureChart64, "base64");
    doc.image(temperatureChartFinal, {height:300});

    doc.moveDown();

    // Humidity's chart on specific time range
    doc.fontSize(15).text("Humidity for " + data.date_range, 50, doc.y);
    let humidityChartFinal = new Buffer(humidityChart64, "base64");
    doc.image(humidityChartFinal, {height:300});

    // End of the PDF document
    doc.end();
    stream.on('finish', function() {
        document.getElementById('pdf-display').src = stream.toBlobURL('application/pdf');
    });	
}