function telerobotic_controller(name, deps) {
    var cp = require('child_process'); 
    var serialNumber;
    var serialProc = cp.spawn('bash', ['/opt/openrov/cockpit/linux/bb-show-serial.sh']);
    serialProc.stdout.on('data', function(data){
        serialNumber = data.toString();
        var parts = serialNumber.split(':');
        if (parts.length > 0) {
          serialNumber = parts[parts.length -1].trim();
      }
    });
    console.log("This is where plugin code for telerobotic_controller loads in the node process.");
    
  //This is how you would register a listner to traffic from the browser
  /*
  deps.io.sockets.on('connection', function (socket) {
    socket.on('some_message_from_browser', function () {
      //sending on to the rov via the serial connection
      deps.rov.send('msg(0)');
      console.log('msg(0) sent');
    });
  });
  */

  //This is how you would register a listner to traffic from the ardunio
  //or other parts of the node modules and forward it to the browser
  /*
  deps.globalEventLoop.on('messageIwantToForward', function (data) {
    deps.io.sockets.emit('messageIwantToForward', data);
  });
  */
};

module.exports = telerobotic_controller;
