var app          = require('express')(),
    server       = require('http').Server(app),
    io           = require('socket.io')(server),
    childProcess = require('child_process'),
    fs           = require('fs');

function takeScreenshot() {
  setTimeout(function() {
    childProcess.exec('screencapture -x s.png', function(err) {
      if(err) { console.log(err); }

      fs.readFile('s.png', function(err, original_data){
        if(err) { console.log(err); }
        var base64Image = 'data:image/png;base64,' 
                        + original_data.toString('base64');
        io.sockets.emit('new_image', base64Image); 
      });
    });

    takeScreenshot();
  }, 1000);
}

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/socket.io.min.js', function (req, res) {
  res.sendFile(__dirname + '/socket.io.min.js');
});

takeScreenshot();

server.listen(4321, '0.0.0.0');
