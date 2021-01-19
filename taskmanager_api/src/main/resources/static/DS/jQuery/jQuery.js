if (typeof jQuery !== "undefined") {
    define("DS/collected/plugins/jquery", function() {
        return jQuery
    })
} else {
    if (require.toUrl("DS/collected/plugins/jquery").indexOf("latest") === -1) {
        var lJQueryPath = require.toUrl("DS/collected/plugins/jquery/latest/");
        var lIndexOfQuestionMark = lJQueryPath.indexOf("?");
        if (lIndexOfQuestionMark > -1) {
            lJQueryPath = lJQueryPath.substring(0, lIndexOfQuestionMark)
        }
        require.config({
            paths: {
                "DS/collected/plugins/jquery": lJQueryPath + "jquery"
            },
            shim: {
                "DS/collected/plugins/jquery": {
                    exports: "jQuery"
                }
            }
        })
    }
}
define("DS/jQuery/jQuery", ["DS/collected/plugins/jquery"], function(jQuery) {
    jQuery.noConflict();
    return jQuery;
});