factory(function () {
    var readyList = [],
        isReady = false;

    function domReady(fn) {
        if (!isReady) {
            readyList.push(fn);
        } else {
            fn();
        }
    }

    function doReady() {
        if (isReady) {
            return;
        }
        isReady = true;

        var i = 0;
        while(i < readyList.length) {
            readyList[i]();
            i++;
        }
    }

    function DOMContentLoaded() {
        window.console && console.log('dom is ready');
        if (document.removeEventListener) {
            document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
        } else if (document.readyState == 'complete') {
            window.detachEvent('onreadystatechange', DOMContentLoaded);
        } else {
            return false;
        }
        doReady();
    }

    (function() {

        if (document.readyState == 'complete') {
            setTimeout(doReady, 1);
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
            window.addEventListener('load', doReady, false);
        } else {
            document.attachEvent('onreadystatechange', DOMContentLoaded);
            window.attachEvent('onload', doReady);

            var top = false;

            try {
                top = window.frameElement == null && document.documentElement;
            } catch(e) {};

            if (top && top.doScroll) {
                (function() {
                    try {
                        top.doScroll("left");
                    } catch (e) {
                        return arguments.callee();
                    }
                    doReady();
                })();
            }
        }
    })();

    return domReady;
});