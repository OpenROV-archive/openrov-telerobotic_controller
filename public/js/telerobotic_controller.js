(function (window, $, undefined) {
    'use strict';

    var telerobotic_controller;

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

    /*
    $.get(jsFileLocation + '../somefile.txt',function(data){
      console.log(data);
    });
    */

    // If you have more than a couple lines of HTML it might be better
    // to place them in a seperate .html file. The code below will load
    // them in to an element.

    $('#divtoloadcontent').load(jsFileLocation + '../partial.html',function(data){
      console.log('partial template loaded');
    });

    //Load internet based js files
    $.getScript("htttp://...");

    //For loading third party libraries that are bower dependencies
    /*
    $.getScript('plugin_components/<projectname>/<filetoload>.js',function(){
      console.log("loaded");
    });
    */

  };

    window.Cockpit.plugins.push(telerobotic_controller);

}(window, jQuery));
