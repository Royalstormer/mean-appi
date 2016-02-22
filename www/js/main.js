/*jslint devel: true, browser: true*/
/*jshint devel: true, jquery: true, browser: true, maxerr: 200*/
/*global $*/

/* Custom Javascript for this PhoneGap APP */


var verNumber = "v452";        //String defining the current version.

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id),
            listeningElement = parentElement.querySelector('.listening'),
            receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function onDeviceReady() {
    "use strict";
    //Phonegap is ready
    console.log("Phonegap is ready");
    console.log(cordova.file);
}




$(document).on("mobileinit", function () {
    "use strict";
	console.log("Initialize jQuery Mobile Phonegap Enhancement Configurations");
    // Make your jQuery Mobile framework configuration changes here!
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
    $.mobile.buttonMarkup.hoverDelay = 0;
    $.mobile.pushStateEnabled = false;
    $.mobile.defaultPageTransition = "none";

});

$(document).on("pagebeforeshow", "#gamePage", function () { // When entering pagetwo
    $('div[data-role="footer"]').html('<p>MeanAPPI ' + verNumber + '</p>').fadeIn('fast');
});


//Hiding the divs that aren't neccessary at start.

window.onload = function () {
    "use strict";
    console.log('onload');
    $('#popupbasic').hide();
    $("#timerBar").hide();
    $("#timerBarBG").hide();
    $("#dialogWindow").hide();
    $('<audio id="errorAudio"><source src="audio/error1.mp3"type="audio/mp3"></audio>').appendTo('body');
    $('<audio id="correctAudio"><source src="audio/correct1.wav"type="audio/wav"></audio>').appendTo('body');
    $('#menuButtons').css({top: '50%', left: '50%', margin: '-' + ($('#myDiv').height() / 2) + 'px 0 0 -' + ($('#menuButtons').width() / 2) + 'px'});

};




