// client-side js
// run by the browser each time your view template is loaded
var express = require('express');
var app = express();

var request = require('request');
var fs = require('fs');
var tmp = require('tmp');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/data", function (_, response) {
    // Or use something fancier like Dropbox.
    // > Use any Dropbox public 'share' link for an xlsx file, 
    // > and be sure to add "?dl=1" to the end to make it direct.
    var dropboxUrl = "https://www.dropbox.com/s/5daiul14xtmby4q/WelcomeWatermelonEvents.xlsx?dl=1";
    
    // We'll use this dropbox url by default.
    var url = dropboxUrl;
    
    var r = request(url);
    r.on('response', (res) => {
      // Our excel parsing library expects to read from a file,
      // So we do a little bit of temp file dance to wire it up.
      // For the moment it only support .xlsx files,
      // but .csv, .xls, etc., are fairly easy extensions.
      
      var tmpobj = tmp.fileSync({postfix:'.xlsx'});

      var fileName = tmpobj.name;
      
      res.pipe(fs.createWriteStream(fileName));
      
      var parseXlsx = require('excel');
      parseXlsx(fileName, (err, data) => {
        if(err) throw err;
        response.send(data);
      });
    });
    r.on('error', (err) => {
        throw err;
    });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});



$(function() {
    $.getJSON('/data', function (data) {
      
      // Basic table rendering
      // http://stackoverflow.com/questions/17066636/parsing-json-objects-for-html-table
      // Take it an extra mile with some styling or filters...
      var table = $('<table>');
      data.forEach(function(row) {
          var tr = $('<tr/>');
          row.forEach(function(col) {
            //tr.append("<td>" + col + "</td>");
            tr.append(col + "<br/>");
          });
          table.append(tr);
          table.append("<tr/>"); //these are to provide space between each activity
          table.append("<tr/>");
          table.append("<tr/>");
          table.append("<tr/>");
          table.append("<tr/>");
          table.append("<tr/>");
          table.append("<tr/>");
      });
      $('#data-container').html(table);
      
    });
});
