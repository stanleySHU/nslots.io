getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);    
    return string ? string[1] : "";
};

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
	
	var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
	if(isSafari && getOsVersion() === 13) {
		window.addEventListener("resize", resize);
	}
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

    var element = document.getElementById('errormessage');
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	if(MutationObserver) {		
		var observer = new MutationObserver(onErrorMessageAdded);
		observer.observe(element, {
			childList: true
		});
	}
}

function resize(){	
	if (window.matchMedia("(orientation: landscape)").matches) {
		setTimeout(function() {
			window.scrollTo(0, -1);
		}, 500);
	}
}

function getOsVersion() {
    var agent = window.navigator.userAgent,
    start = agent.indexOf( "OS " );
    if( ( agent.indexOf( "iPhone" ) > -1 || agent.indexOf( "iPad" ) > -1 ) && start > -1 ){
        return window.Number( agent.substr( start + 3, 3 ).replace( "_", "." ) );
    }
    return 0;    
}

function onErrorMessageAdded() {
    var element = document.getElementById('errormessage');
    if(element && element.innerHTML === "undefined") {
        element.innerHTML = "Error!";
    }
}