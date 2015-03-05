(function (window, $, undefined) {
    'use strict';

    var telerobotic_controller;
    var OT_apiKey, OT_token, OT_sessionId;
    telerobotic_controller = function telerobotic_controller(cockpit) {
        console.log("Loading telerobotic_controller plugin in the browser.");

        // Instance variables
        this.cockpit = cockpit;

    //example keyboard hook
    this.cockpit.emit('inputController.register',
      {
        name: "telerobotic_controller.keyBoardMapping",
        description: "Turns it on",
        defaults: { keyboard: 'alt+5', gamepad: '' },
        down: function() { console.log('telerobotic_controller alt-5 pressed'); },
      });

    // for plugin management:
    this.name = 'telerobotic_controller';   // for the settings
    this.viewName = 'telerobotic_controller plugin'; // for the UI
    this.canBeDisabled = true; //allow enable/disable
    this.enable = function () {
      alert('telerobotic_controller enabled');
    };
    this.disable = function () {
      alert('telerobotic_controller disabled');
    };
  };

  //This will be called by the input manager automatically
  telerobotic_controller.prototype.listen = function listen() {
    var rov = this;

    //This snippet allows you to listen to events coming
    //from the beaglebone.  Those coulbe be navdata, status, etc...

    this.cockpit.socket.on('test', function (data) {
      console.log("recieved test message from browser.");
      //rov.dosomethingwith(data);
    });

    //This example will put an entry in the pop-up Heads Up Menu
    /*
    var item = {
      label: ko.observable("telerobotic_controller menu"),
      callback: function () {
        alert('telerobotic_controller menu item');
        item.label(this.label() + " Foo Bar");
      }
    };
    rov.cockpit.emit('headsUpMenu.register', item);
    */


    //the code below is used to load other asssets that have a path relative to the current
    //path of the executing javascript file.
    var jsFileLocation = urlOfJsFile('telerobotic_controller.js');

    
    // $.getScript(jsFileLocation + './data-channel.js',function(data){
    //   console.log(data);
    // });
    

    // If you have more than a couple lines of HTML it might be better
    // to place them in a seperate .html file. The code below will load
    // them in to an element.

    // $('body').prepend('<div id="data-channel"></div>')
    // $('#data-channel').load(jsFileLocation + '../partial.html',function(data){
    //   console.log('partial template loaded');
    // });

    var room;
    var users = {};
    var dataChannels = {};
    var self = this.cockpit;
    $.getScript("http://static.opentok.com/v2.4/js/opentok.min.js", function (data,status) {
      console.log("loaded opentok successfully");
      var rov = self;
      $.get("https://openrov-liveview.herokuapp.com/channels/1/telerobotic_credentials", function (data, status){
        OT_apiKey = data.api_key;
        OT_token = data.token;
        OT_sessionId = data.session_id;
        console.log("OT_sessiondId: " + OT_sessionId + "\nOT_apiKey: " + OT_apiKey + "\nOT_token: " + OT_token);
        var session = OT.initSession(OT_apiKey, OT_sessionId)
        session.connect(OT_token, function(error) {
          console.log("session connected");
        });
        var self = rov;

        // Lights
        session.on("signal:light",function(event){
          console.log("light: signal sent from connection: " + event.from.id);
          self.socket.emit('brightness_update',1);
        });

        // Lasers
        session.on("signal:laser", function(event){
          console.log("laser: signal sent from connection: " + event.from.id);
          self.socket.emit('laser_update',1);
        });

        // move forward
        session.on("signal:move-forward", function(event){
          console.log("remote - move:forward session event")
          self.socket.emit('throttle',1)
        })

        // stop moving forward
        session.on('signal:move-forward-stop', function(event){
          console.log("remote - move:forward session event")
          self.socket.emit('throttle',0)
        })

        //move left
        session.on('signal:move-left', function(event){
          console.log('remote - move:left session event')
          self.socket.emit('yaw',-1)
        })

        //stop moving left
        session.on('signal:move-left-stop', function(event){
          console.log('remote - move:left-stop session event')
          self.socket.emit('yaw',0)
        })

        //move right
        session.on('signal:move-right', function(event) {
          console.log('remote - move:right session event')
          self.socket.emit('yaw',1)
        })

        //stop moving right
        session.on('signal:right-stop', function(event){
          console.log('remote - move:right-stop session event ')
          self.socket.emit('yaw', 0)
        })

        // lift up
        session.on('signal:move-up', function(event){
          self.socket.emit('lift', -1)
        })

        session.on('signal:move-up-stop', function(event){
          self.socket.emit('lift',0)
        })

        session.on('signal:move-down-stop', function(event){
          self.socket.emit('lift',0)
        })

        // push down
        session.on('siganl:move-down', function(event){
          self.socket.emit('lift', -1)
        })

      });
    });


  };

    window.Cockpit.plugins.push(telerobotic_controller);

}(window, jQuery));
