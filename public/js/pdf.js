const PDFDocument = require("pdfkit");
const blobStream  = require('blob-stream');
const canvg = require("canvg");

window.generateReport = function (data, peopleChart, temperatureChart, humidityChart) {
    
    let doc = new PDFDocument();

    console.log(data);
    sessionStorage.setItem("passRoom", data.room_name);
    
    sessionStorage.setItem("passDate", data.date_range);
    
    sessionStorage.setItem("passTime", data.time_range);

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
    
    // Report Time
    doc.font("Helvetica");
    doc.fontSize(17).text("Time: " + data.time_range, {align:"center"});
    doc.moveDown();
    
    var days = sessionStorage.getItem("checkDay");
    
    var high_ppl_data, low_ppl_data, high_ppl_date, low_temp_date, high_temp_data, low_temp_data, high_temp_date, low_temp_date, high_humid_data, low_humid_data, high_humid_date, low_humid_date, date;
    
    
    if(days === '0')
    {
        date = "Hour";
        
        high_ppl_data = sessionStorage.getItem("todayPeopleHighestData");
        high_ppl_date = sessionStorage.getItem("todayPeopleHighestDate");
        high_temp_data = sessionStorage.getItem("todayTempHighestData");
        high_temp_date = sessionStorage.getItem("todayTempHighestDate");
        high_humid_data = sessionStorage.getItem("todayHumidHighestData");
        high_humid_date = sessionStorage.getItem("todayHumidHighestDate");
        low_ppl_data = sessionStorage.getItem("todayPeopleLowestData");
        low_ppl_date = sessionStorage.getItem("todayPeopleLowestDate");
        low_temp_data = sessionStorage.getItem("todayTempLowestData");
        low_temp_date = sessionStorage.getItem("todayTempLowestDate");
        low_humid_data = sessionStorage.getItem("todayHumidLowestData");
        low_humid_date = sessionStorage.getItem("todayHumidLowestDate");
    }
    else if(days === '1')
    {
        date = "Day";
        
        high_ppl_data = sessionStorage.getItem("dailyPeopleHighestData");
        high_ppl_date = sessionStorage.getItem("dailyPeopleHighestDate");
        high_temp_data = sessionStorage.getItem("dailyTempHighestData");
        high_temp_date = sessionStorage.getItem("dailyTempHighestDate");
        high_humid_data = sessionStorage.getItem("dailyHumidHighestData");
        high_humid_date = sessionStorage.getItem("dailyHumidHighestDate");
        low_ppl_data = sessionStorage.getItem("dailyPeopleLowestData");
        low_ppl_date = sessionStorage.getItem("dailyPeopleLowestDate");
        low_temp_data = sessionStorage.getItem("dailyTempLowestData");
        low_temp_date = sessionStorage.getItem("dailyTempLowestDate");
        low_humid_data = sessionStorage.getItem("dailyHumidLowestData");
        low_humid_date = sessionStorage.getItem("dailyHumidLowestDate");
    }
    else if(days === '2')
    {
        date = "Week";
        
        high_ppl_data = sessionStorage.getItem("weeklyPeopleHighestData");
        high_ppl_date = sessionStorage.getItem("weeklyPeopleHighestDate");
        high_temp_data = sessionStorage.getItem("weeklyTempHighestData");
        high_temp_date = sessionStorage.getItem("weeklyTempHighestDate");
        high_humid_data = sessionStorage.getItem("weeklyHumidHighestData");
        high_humid_date = sessionStorage.getItem("weeklyHumidHighestDate");
        low_ppl_data = sessionStorage.getItem("weeklyPeopleLowestData");
        low_ppl_date = sessionStorage.getItem("weeklyPeopleLowestDate");
        low_temp_data = sessionStorage.getItem("weeklyTempLowestData");
        low_temp_date = sessionStorage.getItem("weeklyTempLowestDate");
        low_humid_data = sessionStorage.getItem("weeklyHumidLowestData");
        low_humid_date = sessionStorage.getItem("weeklyHumidLowestDate");
    }
    else if(days === '3')
    {
        date = "Month";
        
        high_ppl_data = sessionStorage.getItem("monthlyPeopleHighestData");
        high_ppl_date = sessionStorage.getItem("monthlyPeopleHighestDate");
        high_temp_data = sessionStorage.getItem("monthlyTempHighestData");
        high_temp_date = sessionStorage.getItem("monthlyTempHighestDate");
        high_humid_data = sessionStorage.getItem("monthlyHumidHighestData");
        high_humid_date = sessionStorage.getItem("monthlyHumidHighestDate");
        low_ppl_data = sessionStorage.getItem("monthlyPeopleLowestData");
        low_ppl_date = sessionStorage.getItem("monthlyPeopleLowestDate");
        low_temp_data = sessionStorage.getItem("monthlyTempLowestData");
        low_temp_date = sessionStorage.getItem("monthlyTempLowestDate");
        low_humid_data = sessionStorage.getItem("monthlyHumidLowestData");
        low_humid_date = sessionStorage.getItem("monthlyHumidLowestDate");      
    }
    
    // Insight Title
    doc.font("Helvetica-Bold");
    doc.fontSize(17).text("Insights", 50, 200, {align: "center"});

    // Insight Title-Points separator line
    doc.font("Helvetica");
    doc.moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke();
    doc.moveDown();
    
    // Insights points
    //Date with highest and lowest number of people
    doc.fontSize(17).text("Table of People", 50, 270, {align: "center"});
    
    doc.lineCap('butt')
      .moveTo(180, 300)
      .lineTo(180, 360)
      .stroke()
    
    doc.lineCap('butt')
      .moveTo(380, 300)
      .lineTo(380, 360)
      .stroke()
    
    row(doc, 300);
    row(doc, 320);
    row(doc, 340);

    textInRowFirst(doc, "Highest", 322, 80);
    textInRowFirst(doc, "Lowest", 343, 80);
    textInRowFirst(doc, date, 302, 245);
    textInRowFirst(doc, "Value", 302, 425);
    textInRowFirst(doc, high_ppl_data, 322, 440);
    textInRowFirst(doc, high_ppl_date, 322, 240);
    textInRowFirst(doc, low_ppl_data, 342, 440);
    textInRowFirst(doc, low_ppl_date, 342, 240);
    
    
    //Date with highest and lowest number of temperature
    doc.fontSize(17).text("Table of Temperature", 50, 420, {align: "center"});
    
    doc.lineCap('butt')
      .moveTo(180, 450)
      .lineTo(180, 510)
      .stroke()

    doc.lineCap('butt')
      .moveTo(380, 450)
      .lineTo(380, 510)
      .stroke()

    row(doc, 450);
    row(doc, 470);
    row(doc, 490);
    
    
    textInRowFirst(doc, "Highest", 472, 80);
    textInRowFirst(doc, "Lowest", 493, 80);
    textInRowFirst(doc, date, 452, 245);
    textInRowFirst(doc, "Value", 452, 425);
    textInRowFirst(doc, high_temp_data, 472, 440);
    textInRowFirst(doc, high_temp_date, 472, 240);
    textInRowFirst(doc, low_temp_data, 492, 440);
    textInRowFirst(doc, low_temp_date, 492, 240);
    
    //Date with highest and lowest number of humidity
    doc.fontSize(17).text("Table of Humidity", 50, 570, {align: "center"});
    
    doc.lineCap('butt')
      .moveTo(180, 600)
      .lineTo(180, 660)
      .stroke()

    doc.lineCap('butt')
      .moveTo(380, 600)
      .lineTo(380, 660)
      .stroke()

    row(doc, 600);
    row(doc, 620);
    row(doc, 640);
    
    
    textInRowFirst(doc, "Highest", 622, 80);
    textInRowFirst(doc, "Lowest", 643, 80);
    textInRowFirst(doc, date, 602, 245);
    textInRowFirst(doc, "Value", 602, 425);
    textInRowFirst(doc, high_humid_data, 622, 440);
    textInRowFirst(doc, high_humid_date, 622, 240);
    textInRowFirst(doc, low_humid_data, 642, 440);
    textInRowFirst(doc, low_humid_date, 642, 240);
    
    sessionStorage.setItem("passDayType", date);
    sessionStorage.setItem("pass_high_ppl_data",high_ppl_data);
    sessionStorage.setItem("pass_high_ppl_date",high_ppl_date);
    sessionStorage.setItem("pass_high_temp_data",high_temp_data);
    sessionStorage.setItem("pass_high_temp_date",high_temp_date);
    sessionStorage.setItem("pass_high_humid_data",high_humid_data);
    sessionStorage.setItem("pass_high_humid_date",high_humid_date);
    sessionStorage.setItem("pass_low_ppl_data",low_ppl_data);
    sessionStorage.setItem("pass_low_ppl_date",low_ppl_date);
    sessionStorage.setItem("pass_low_temp_data",low_temp_data);
    sessionStorage.setItem("pass_low_temp_date",low_temp_date);
    sessionStorage.setItem("pass_low_humid_data",low_humid_data);
    sessionStorage.setItem("pass_low_humid_date",low_humid_date);

    // Move to next page
    doc.moveDown(doc.page.height);
    
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
    let peopleChartFinal = new Buffer(peopleChart64, "base64");
    doc.image(peopleChartFinal, 70, doc.y, {height:300});
    
    doc.moveDown();

    // Temperature's chart on specific time range
    let temperatureChartFinal = new Buffer(temperatureChart64, "base64");
    doc.image(temperatureChartFinal, 70, doc.y, {height:300});

    // Move to next page
    doc.moveDown(doc.page.height);

    // Humidity's chart on specific time range
    doc.fontSize(15).text("", 140, doc.y);
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
    var time = sessionStorage.getItem("passTime");
    var dayType = sessionStorage.getItem("passDayType");
    var ppl = sessionStorage.getItem("passPeople");
    var temp = sessionStorage.getItem("passTemperature");
    var hmd = sessionStorage.getItem("passHumidity");
    var high_ppl_data, low_ppl_data, high_ppl_date, low_temp_date, high_temp_data, low_temp_data, high_temp_date, low_temp_date, high_humid_data, low_humid_data, high_humid_date, low_humid_date;
    
    high_ppl_data = sessionStorage.getItem("pass_high_ppl_data");
    high_ppl_date = sessionStorage.getItem("pass_high_ppl_date");
    high_temp_data = sessionStorage.getItem("pass_high_temp_data");
    high_temp_date = sessionStorage.getItem("pass_high_temp_date");
    high_humid_data = sessionStorage.getItem("pass_high_humid_data");
    high_humid_date = sessionStorage.getItem("pass_high_humid_date");
    low_ppl_data = sessionStorage.getItem("pass_low_ppl_data");
    low_ppl_date = sessionStorage.getItem("pass_low_ppl_date");
    low_temp_data = sessionStorage.getItem("pass_low_temp_data");
    low_temp_date = sessionStorage.getItem("pass_low_temp_date");
    low_humid_data = sessionStorage.getItem("pass_low_humid_data");
    low_humid_date = sessionStorage.getItem("pass_low_humid_date");
    
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
        
        // Report Time
        doc.font("Helvetica");
        doc.fontSize(17).text("Time: " + time, {align:"center"});
        doc.moveDown();

        // Insight Title
        doc.font("Helvetica-Bold");
        doc.fontSize(17).text("Insights", 50, 200, {align: "center"});

        // Insight Title-Points separator line
        doc.font("Helvetica");
        doc.moveTo(50, doc.y)
           .lineTo(doc.page.width - 50, doc.y)
           .stroke();
        doc.moveDown();

        // Insights points
        //Date with highest and lowest number of people
        doc.fontSize(17).text("Table of People", 50, 270, {align: "center"});

        doc.lineCap('butt')
          .moveTo(180, 300)
          .lineTo(180, 360)
          .stroke()

        doc.lineCap('butt')
          .moveTo(380, 300)
          .lineTo(380, 360)
          .stroke()

        row(doc, 300);
        row(doc, 320);
        row(doc, 340);

        textInRowFirst(doc, "Highest", 322, 80);
        textInRowFirst(doc, "Lowest", 343, 80);
        textInRowFirst(doc, dayType, 302, 245);
        textInRowFirst(doc, "Value", 302, 425);
        textInRowFirst(doc, high_ppl_data, 322, 440);
        textInRowFirst(doc, high_ppl_date, 322, 240);
        textInRowFirst(doc, low_ppl_data, 342, 440);
        textInRowFirst(doc, low_ppl_date, 342, 240);


        //Date with highest and lowest number of temperature
        doc.fontSize(17).text("Table of Temperature", 50, 420, {align: "center"});

        doc.lineCap('butt')
          .moveTo(180, 450)
          .lineTo(180, 510)
          .stroke()

        doc.lineCap('butt')
          .moveTo(380, 450)
          .lineTo(380, 510)
          .stroke()

        row(doc, 450);
        row(doc, 470);
        row(doc, 490);


        textInRowFirst(doc, "Highest", 472, 80);
        textInRowFirst(doc, "Lowest", 493, 80);
        textInRowFirst(doc, dayType, 452, 245);
        textInRowFirst(doc, "Value", 452, 425);
        textInRowFirst(doc, high_temp_data, 472, 440);
        textInRowFirst(doc, high_temp_date, 472, 240);
        textInRowFirst(doc, low_temp_data, 492, 440);
        textInRowFirst(doc, low_temp_date, 492, 240);

        //Date with highest and lowest number of humidity
        doc.fontSize(17).text("Table of Humidity", 50, 570, {align: "center"});

        doc.lineCap('butt')
          .moveTo(180, 600)
          .lineTo(180, 660)
          .stroke()

        doc.lineCap('butt')
          .moveTo(380, 600)
          .lineTo(380, 660)
          .stroke()

        row(doc, 600);
        row(doc, 620);
        row(doc, 640);


        textInRowFirst(doc, "Highest", 622, 80);
        textInRowFirst(doc, "Lowest", 643, 80);
        textInRowFirst(doc, dayType, 602, 245);
        textInRowFirst(doc, "Value", 602, 425);
        textInRowFirst(doc, high_humid_data, 622, 440);
        textInRowFirst(doc, high_humid_date, 622, 240);
        textInRowFirst(doc, low_humid_data, 642, 440);
        textInRowFirst(doc, low_humid_date, 642, 240);

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
        let peopleChartFinal = new Buffer(ppl, "base64");
        doc.image(peopleChartFinal, 70, doc.y, {height:300});

        doc.moveDown();

        // Temperature's chart on specific time range
        let temperatureChartFinal = new Buffer(temp, "base64");
        doc.image(temperatureChartFinal, 70, doc.y, {height:300});

        // Move to next page
        doc.moveDown(doc.page.height);

        // Humidity's chart on specific time range
        doc.fontSize(15).text("", 140, doc.y);
        let humidityChartFinal = new Buffer(hmd, "base64");
        doc.image(humidityChartFinal, 70, doc.y, {height:300});

        // End of the PDF document
        doc.end();
        stream.on('finish', function() {
            document.getElementById('pdf-display').src = stream.toBlobURL('application/pdf');
        });	
        
    }
} 

function textInRowFirst(doc, text, heigth, width) {
  doc.y = heigth;
  doc.x = width;
  doc.fillColor('black')
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: 'justify',
    columns: 2,
  });
  return doc
}


function row(doc, heigth) {
  doc.lineJoin('miter')
    .rect(55, heigth, 500, 20)
    .stroke()
  return doc
}

