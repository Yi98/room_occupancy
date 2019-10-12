const PDFDocument = require("pdfkit");
const blobStream  = require('blob-stream');
const canvg = require("canvg");

// Bugs:
// 1. When hard reload the pdf file won't load
// 2. When ctrl+shift+tab the pdf file won't display the previous one
window.generateReport = function (data, peopleChart, temperatureChart, humidityChart) {
    let doc = new PDFDocument();
    let canvas = document.createElement("CANVAS");

    canvg(canvas, peopleChart);
    let peopleChart64 = canvas.toDataURL("image/png").slice('data:image/png;base64,'.length);

    canvg(canvas, temperatureChart);
    let temperatureChart64 = canvas.toDataURL("image/png").slice('data:image/png;base64,'.length);

    canvg(canvas, humidityChart);
    let humidityChart64 = canvas.toDataURL("image/png").slice('data:image/png;base64,'.length);

    let stream = doc.pipe(blobStream());

    doc.fontSize(25).text("Chart for number of people", 100, 80);
    let peopleChartFinal = new Buffer(peopleChart64, "base64");
    doc.image(peopleChartFinal, {height:200});

    doc.fontSize(25).text("Chart for temperature", 100, 300);
    let temperatureChartFinal = new Buffer(temperatureChart64, "base64");
    doc.image(temperatureChartFinal, {height:200});

    doc.fontSize(25).text("Chart for humidity", 100, 520);
    let humidityChartFinal = new Buffer(humidityChart64, "base64");
    doc.image(humidityChartFinal, {height:200});

    doc.end();
    stream.on('finish', function() {
        document.getElementById('pdf-display').src = stream.toBlobURL('application/pdf');
    });	
}