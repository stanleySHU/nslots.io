getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);    
    return string ? string[1] : "";
};

getDomain = function (hostname) {
  let host = hostname || "";
  var segs = host.split(".");
  var l = segs.length;
  if (l > 1) {
    return `${segs[l - 2]}.${segs[l - 1]}`;
  }
  return host;
}

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

function resumeAudio(canvas)
{ 
    try{
        var context = Howler.ctx;
        if(context)
        { 
            if (context.state === 'suspended') {
                context.resume();
            } else if (context.state === 'running') {
                if(canvas) {
                    canvas.removeEventListener("click", resumeAudio);
                    canvas.removeEventListener("touchstart", resumeAudio);
                }
            }
        }
    }
    catch(e) {
        console.dir(e);
    }
}

var muted = false;

function muteSound() {
	muted = true;
    try{
        Howler.volume(0);
    }
    catch(e) {
        console.dir(e);
    }
}

function unmuteSound() {
	muted = false;
    resumeAudio();
    try{
        Howler.volume(1);
    }
    catch(e) {
        console.dir(e);
    }
}

function isMuted() {
	return muted;
}

function addAudioListeners() {
	window.addEventListener('message', function(event) {
		if(event.origin === "*"){			
			if (event.data === "muteSound") { 
				muteSound();
			} 
			else if (event.data === "unmuteSound") { 
				unmuteSound();
			} 
		}
	}); 
}

window.onload = function()
{
    systemcheck();
	addAudioListeners();
    var canvas = document.getElementById('stage');
    canvas.addEventListener("click", function() {
        resumeAudio(canvas);
    });
    canvas.addEventListener("touchstart", function() {
        resumeAudio(canvas);
    });
    var element = document.getElementById('errormessage');
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	if(MutationObserver) {		
		var observer = new MutationObserver(onErrorMessageAdded);
		observer.observe(element, {
			childList: true
		});
	}
}

function onErrorMessageAdded() {
    var element = document.getElementById('errormessage');
    if(element && element.innerHTML === "undefined") {
        element.innerHTML = "Error!";
    }
}