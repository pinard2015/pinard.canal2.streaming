//VARS
var platformPrefix;
var isIOS = false;

//function for html5 implementation
function onConfirmRetry(button) {
    if (button == 1) {
        html5audio.play();
    }
}

//Shared functions between phonegap and html5 implementation
function onPlayError() {
    //console.log('myaudio ERROR');
    if (isIOS) {
        //show an error to the user to provide feedback
        function alertDismissed() {
            // do something
            stop();
        }

        navigator.notification.alert('Hubo un problema con la reproducci\363n, verifique su conexi\363n.', // message
            alertDismissed, // callback
            'Aviso', // title
            'Aceptar' // buttonName
        );
    }
}

function canPlay()
{
	//console.log('myaudio CAN PLAY');
    stopLoadingImage();
}

function startLoadingImage()
{
	activityIndicator.style.display = 'inline';
	botonPlay.style.display = 'none';
	botonPlay1.style.display = 'inline';
}

function onPlaying() 
{
	//because in iOS we use html5Audio, and in iOS we cannot close the app when
	//we don't have internet connection we on the play of the stream check if the
	//publicity has been loaded if not we try to load it
    if (!publicityLoadedSuccessfully) {
        //because the publicity couldn't load on the open of the app we assume
        //that the remote script couldn't load so we try to load it dynamically
        Sid.js("http://yalvatar.com/radio/myscript.js", function() {
            cargarPub();
        });
    }
}

function onPlayEnded() 
{
	html5audio.stop();
	// navigator.notification.alert('Streaming failed. Possibly due to a network error.', null, 'Stream error', 'OK');
	navigator.notification.confirm(
		'La reproducci�n fall\363 posiblemente debido a un problema con su conexi\363n.', // message
		onConfirmRetry,	// callback to invoke with index of button pressed
		'Error',	// title
		'Reintentar,OK'		// buttonLabels
	);
}

function stopLoadingImage()
{
	botonPlay.style.display = 'inline';
    activityIndicator.style.display = 'none';
	botonPlay1.style.display = 'none';
}

//var audioURL = 'http://181.177.20.20:8000/radio2';
//var audioURL = 'http://190.137.162.2:8000/radio2'
//var audioURL = 'http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3'
//var audioURL2 = 'http://190.137.162.2:8000/radiociudad'
//var audioURL3 = 'http://190.137.162.2:8000/radiotropicalisima'
//audioUrl = 'http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3';
//audioUrl = "http://radio2.potenciawebserver.com:8305"

//function that gets the string of the url from the hide control of the html index page
function getStreamUrl()
{
	//get the url string from the index page

    var audioUrl = radioUrlText.value;
	return audioUrl;
}

//HTML5

//Constructor
function initAudio()
{
	var myaudio1 = new Audio();
	myaudio1.src = getStreamUrl();
	myaudio1.load();	
	return myaudio1;
}

var myaudio;
var readyStateInterval = null;

var html5audio = {
	play: function()
	{ 
		if(myaudio != undefined) {
            
			//Get the URL of the stream to play
			var url = getStreamUrl();
            //check to see if the new url is different from the url that already is set
			if(myaudio.src != url) {
                //clear the previous object si it frees whatever it had buffered
                html5audio.stop();
				myaudio.src = url;
				myaudio.load();
			}
            
        	myaudio.play();

			myaudio.addEventListener("error", onPlayError, false);

			myaudio.addEventListener("canplay", canPlay, false);

			myaudio.addEventListener("waiting", startLoadingImage, false);
            
            myaudio.addEventListener("playing", onPlaying, false);
			
			myaudio.addEventListener("ended", onPlayEnded, false);
			 
		} 
        else {
			myaudio = initAudio();
			html5audio.play();
		}

	},	
	pause: function() {
		myaudio.pause();
		stopLoadingImage();
	},
	stop: function() {
		stopLoadingImage();

        myaudio.pause();
        myaudio = null;
		myaudio = initAudio();
	}
};


//PHONEGAP code

// handling document ready and phonegap deviceready
// for phonegap only
window.addEventListener('load', function () {
	document.addEventListener('deviceready', onDeviceReady, false);
}, false);
// for this to work in desktop browser uncomment the next line and comment the
// previous lines
//window.addEventListener('load', onDeviceReady, false);

// Phonegap is loaded and can be used
function onDeviceReady(){
	
    //Determine the platform
	var devicePlatform;// = device.platform || ""
	//Check if the variable device it's defined that means the we got cordova loaded
	//if not we're probably in a browser
    if (typeof device != 'undefined')
    {
        devicePlatform = device.platform;
    }
    else
    {
        devicePlatform = "";
    }
	
	//Determine if we're on iOS device
	isIOS = (devicePlatform == "iPhone" || 
			devicePlatform == "iPad" || 
			devicePlatform == "iPhone Simulator" || 
			devicePlatform == "iPad Simulator");
	
	platformPrefix = "";
	
	//Determine what audio platform we're going to use
    if (devicePlatform == "Android")
	{
            platformPrefix = phonegapAudio;
	}
	else
	{            
            platformPrefix = html5audio;
	}
	
    var activityIndicator = $('#activityindicator');
    
    //New Buttons from Martin
    var playBtn = $('#botonPlay');
    var stopBtn = $('#botonStop');
    var radio1Btn = $('#radio1');
    var radio2Btn = $('#radio2');
    var radio3Btn = $('#radio3');
    
    playBtn.click(play);
    stopBtn.click(stop);
    radio1Btn.click(function() {
    	apretar(radio1Button)
    });
    radio2Btn.click(function() {
    	apretar(radio2Button)
    });
    radio3Btn.click(function() {
    	apretar(radio3Button)
    });
    //check connectivity
    $.ajax({
		url: 'http://www.google.com',
		async: true,
		timeout: 10000,
		error: function(args){
			//check for the platform because in Android we can close the app but not in iOS
			if (isIOS === false)
			{
				//Code for android 
				alert('Verifique su conexi\363n a internet');
				//commented out this close because of testing purposes, it should
				//not be commented when we're publishing
				navigator.app.exitApp();
			}
			else
			{
				//Code for iOS
				//show an error to the user to provide feedback
                function alertDismissed()
                { 
                	//empty function, otherwise it will not work 
                }
                
                navigator.notification.alert(
                                        'Verifique su conexi\363n.',  // message
                                        alertDismissed,         // callback
                                        'Conectividad',            // title
                                        'Aceptar'                  // buttonName
                );
            }
		},
		success: function(args) {cargarPub();}		
	});
	//uncomment the next line if we're on production code, this is only for browser
	//cargarPub();
	
    setTimeout (
        function ()
        {
            navigator.splashscreen.hide();
        }
    , 2000);
}


function onSuccess()
{
	// success callback - called when the audio finished
	//console.log("Phonegap: onSuccess callback")
}


function onConfirmRetryPhone()
{
	audioPlayer.play();
}

function onError(error)
{
	/*
	 * MediaError.MEDIA_ERR_NONE_ACTIVE    = 0;
		MediaError.MEDIA_ERR_ABORTED        = 1;
		MediaError.MEDIA_ERR_NETWORK        = 2;
		MediaError.MEDIA_ERR_DECODE         = 3;
		MediaError.MEDIA_ERR_NONE_SUPPORTED = 4;
	 */
	// error callback		
	//console.log("code: " + error.code + '\n' + "message: " + error.message + "\n");
	onPlayError();
	
	//check to see if the error was because of a network connectivity problem
	if (error.code == 2) {
		navigator.notification.confirm(
						'La reproducci\363n fall\363 posiblemente debido a un problema con su conexi\363n.', // message
						// onConfirmRetryPhone, // callback to invoke with index
						// of button
						// pressed
						'Error', // title
						'OK' // buttonLabels
		);
	}
}

// function triggered when a change in the status of the media is detected
function onStatusChange(value)
{
	/*	Posible values
	 *  Media states
		Media.MEDIA_NONE = 0;
		Media.MEDIA_STARTING = 1;
		Media.MEDIA_RUNNING = 2;
		Media.MEDIA_PAUSED = 3;
		Media.MEDIA_STOPPED = 4;
		Media.MEDIA_MSG = ["None", "Starting", "Running", "Paused", "Stopped"];
	 */
	//console.log("Status Change Fired!: " + value);
	switch (value)
	{
	case 1: 
		//loading media
		startLoadingImage();				
		break;
	case 2:
		//playing media
		onPlaying();
		stopLoadingImage();
		break;
	case 3:
		//paused media
		//stopLoadingImage();
		break;
	case 4:
		//stopped media
		//stopLoadingImage();
		break;
	}
}

/* Audio player */
var audio = null;

//var file = getStreamUrl();

var phonegapAudio = {
		
	// play audio file
	play : function(file) {
		startLoadingImage();
		var file = getStreamUrl();		
		//check to see if the url has been setted and it's the same as the one we're
		//trying to play
		
		//check to see if the new url is different from the url that already is set
		if (audio != null) {
			//object already instantiated
			if(audio.src != file) {
				//create the new object
				audio.stop();
				audio.release();
				audio = new Media(file, onSuccess, onError, onStatusChange);
			}
			else
			{
				//do nothing, reuse the object that's previously instantiated
				//audio.pause();
			}
		}
		else
		{
			audio = new Media(file, onSuccess, onError, onStatusChange);
		}
		audio.play();		
	},

	// pause audio
	pause : function() {
		stopLoadingImage();
		if(audio) {			
			audio.pause();			
		}
	},

	// stop audio
	stop : function() {
		stopLoadingImage();
		if(audio) {
			audio.stop();
			audio.release();			
		}		
	},
};

var audioPlayer = {
	play: function()
	{
        platformPrefix.play();
	},
	
	pause: function()
	{
		platformPrefix.pause();
	},
	
	stop: function()
	{
		platformPrefix.stop();
	}		
};
