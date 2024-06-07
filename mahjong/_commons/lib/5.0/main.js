getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);    
    return string ? string[1] : "";
};

var timerResize = 0;
var timerSound = 0;
var firstMuted = false;
var muted = false;

function systemcheck()
{
    var sys = getQueryString("system",window.location.href).toLowerCase();
    if(sys === "kiosk" || sys === "koisk")
        removeLogo();
    else
        checkLogo();
}

function checkLogo()
{
    var logo = document.getElementById('logo');
	if(logo && logo.firstElementChild){		
		var lang = getQueryString("lang",window.location.href).toLowerCase();
		if(lang && (lang.search("zh") >= 0 || lang.search("cn") >= 0 || lang.search("cs")>= 0)){
			logo.firstElementChild.src = "";
			logo.firstElementChild.src = "../_commons/css/images/gp_logo_cn.png";
		}
		logo.firstElementChild.src += "?t="+Date.now();  
		logo.className += ' fadeLogo' ;
	}
}

function removeLogo()
{    
    var logo = document.getElementById('logo');
    logo.parentNode.removeChild(logo);
}

function resumeAudio(){ 
    try{
        var canvas = document.getElementById('stage');
        var context = Howler.ctx;
        if(context)
        {
            if (context.state === 'suspended') {
                context.resume();
            } 
            else if (context.state === 'running') {
                canvas.removeEventListener("click", resumeAudio);
                canvas.removeEventListener("touchstart", resumeAudio);
            }
            if(context.state === 'suspended' || context.state === 'running') {
                if(firstMuted && muted) {
                    unmuteSound();
                }
                firstMuted = false;
            }
        }
    }
    catch(e) {
        console.dir(e);
    }
}

function muteSound() {
    if(timerSound) clearTimeout(timerSound);
	muted = true;
    var retrySound = function() {
        timerSound = setTimeout(function () {
            if(muted) muteSound();
        }, 500);
    };
    try{
        if(Howler && Howler.ctx) {
            Howler.mute(muted);
        }
        else {
            retrySound();
        }
    }
    catch(e) {
        if(e && e.name === "ReferenceError") {
            retrySound();
        }
        else {
            console.dir(e);
        }
    }
}

function unmuteSound() {
    if(timerSound) clearTimeout(timerSound);
	muted = false;
    var retrySound = function() {
        timerSound = setTimeout(function () {
            if(!muted) unmuteSound();
        }, 500);
    };
    try {
        if(Howler && Howler.ctx) {
            Howler.mute(muted);
        }
        else {
            retrySound();
        }
    }
    catch(e) {
        if(e && e.name === "ReferenceError") {
            retrySound();
        }
        else {
            console.dir(e);
        }
    }
}

function isMuted() {
	return muted;
}

function addAudioListeners() {

    firstMuted = getQueryString("muted",window.location.href) === "1"
    if(firstMuted) muteSound();

    var canvas = document.getElementById('stage');
    canvas.addEventListener("click", resumeAudio);
    canvas.addEventListener("touchstart", resumeAudio);
}

window.onload = function()
{
    systemcheck();
    addAudioListeners();
    addEventListeners();
		
    var element = document.getElementById('errormessage');
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	if(MutationObserver) {		
		var observer = new MutationObserver(onErrorMessageAdded);
		observer.observe(element, {
			childList: true
		});
	}
}

function addEventListeners() {
	var historyFrame = document.getElementById("historyFrame");
	var real = getQueryString("fun",window.location.href) != "1";
    if(real && historyFrame) {
		adjustHistoryFrame();
		if(window.addEventListener) window.addEventListener("resize", resizeHistoryFrame);
		else if(window.attachEvent) window.attachEvent("onresize", resizeHistoryFrame);
        if (historyFrame.addEventListener) historyFrame.addEventListener('load', historyFrameLoaded);
        else if (historyFrame.attachEvent) historyFrame.attachEvent('onload', historyFrameLoaded);
    }
}

function onErrorMessageAdded() {
    var element = document.getElementById('errormessage');
    if(element && element.innerHTML === "undefined") {
        element.innerHTML = "Error!";
    }
}

function resizeHistoryFrame() {
    if(timerResize) clearInterval(timerResize);
    var count = timerResize = 0;
    timerResize = setInterval(function (){
        if(++count > 1 && timerResize) {
            clearInterval(timerResize);
        }
        adjustHistoryFrame();
    }, 500); // for delay resize
    adjustHistoryFrame();
}

function adjustHistoryFrame() {
	var historyFrame = document.getElementById("historyFrame");
	historyFrame.style.width = window.innerWidth + "px";
	historyFrame.style.height = window.innerHeight + "px";
}

function historyFrameLoaded() {	
	var historyFrame = document.getElementById("historyFrame");
	var histroyLoader = document.getElementById("historyLoader");
	if(histroyLoader && historyFrame.src) {
		histroyLoader.style.display = historyFrame.src.split("?")[0] === window.location.href.split("?")[0] ? "block" : "none";
	}
}