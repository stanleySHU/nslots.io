var appInsights = window.appInsights || function (config) {
    function i(config) {
        t[config] = function () {
            var i = arguments;
            t.queue.push(function () {
                t[config].apply(t, i)
            })
        }
    }
    var t = {
            config: config
        },
        u = document,
        e = window,
        o = "script",
        s = "AuthenticatedUserContext",
        h = "start",
        c = "stop",
        l = "Track",
        a = l + "Event",
        v = l + "Page",
        y = u.createElement(o),
        r, f;
    y.src = config.url || "https://az416426.vo.msecnd.net/scripts/a/ai.0.js";
    u.getElementsByTagName(o)[0].parentNode.appendChild(y);
    try {
        t.cookie = u.cookie
    } catch (p) {}
    for (t.queue = [], t.version = "1.0", r = ["Event", "Exception", "Metric", "PageView", "Trace", "Dependency"]; r.length;) i("track" + r.pop());
    return i("set" + s), i("clear" + s), i(h + a), i(c + a), i(h + v), i(c + v), i("flush"), config.disableExceptionTracking || (r = "onerror", i("_" + r), f = e[r], e[r] = function (config, i, u, e, o) {
        var s = f && f(config, i, u, e, o);
        return s !== !0 && t["_" + r](config, i, u, e, o), s
    }), t
}({
    instrumentationKey: "97cdc210-d6f7-4176-a9e8-9ed38cb8fe97",
    disableAjaxTracking: true
});
window.appInsights = appInsights;
appInsights.queue.push(function () {
    appInsights.context.addTelemetryInitializer(function (envelope) {
        var telemetryItem = envelope.data.baseData;

        // To check the telemetry item’s type:
        if (envelope.name === Microsoft.ApplicationInsights.Telemetry.PageView.envelopeType) {
            // this statement removes url from all page view documents
            telemetryItem.url = "URL";
        }

        // To set custom properties:
        telemetryItem.properties = telemetryItem.properties || {};
        telemetryItem.properties["Operator ID"] = slotapp.opid;
        telemetryItem.properties["Game ID"] = slotapp.gameid;

        // To set URL Referrer for the first page view:
        if(telemetryItem.name === "preload") {            
            telemetryItem.properties["URL Referrer"] = document.referrer;
        }
    });
});
appInsights.trackPageView(slotapp ? slotapp.gameid : null, null, {"URL Referrer": document.referrer});
appInsights.setAuthenticatedUserContext('-1');