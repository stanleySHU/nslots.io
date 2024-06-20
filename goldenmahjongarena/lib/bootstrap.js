var started = false;

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function bootstrap(config) {
    var platforms = ['web', 'mobile', 'mini', 'desktop'];
    var platform = getParameterByName("p");
    if (platform && platforms.indexOf(platform) > -1) {

    } else {
        platform = is.desktop() ? "web" : "mobile";
    }
    slotapp.config = config[platform];
    var u = document;
    var o = "script";
    var y = u.createElement(o);
    y.src = "./js/app." + slotapp.config["js"] + ".js?v=1718863925000";
    y.onreadystatechange = function () {
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
            startGame();
        }
    };
    y.onload = function () {
        startGame();
    };
    u.getElementsByTagName(o)[0].parentNode.appendChild(y);
}

function startGame() {
    if (!started) {
        started = true;
        slotapp.bootstrap();
    }
}