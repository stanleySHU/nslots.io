var platformConfig;

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
    platformConfig = config[platform];
    var script = document.createElement('script');
    script.src = "./js/app." + platformConfig["js"] + ".js";
    document.head.appendChild(script);
}