(function(window){
    function exec(fn){
        try {
            return fn();
        } catch(e) {
            return null;
        }
    }
    /**
     * 加载js文件并回调
     * @param  {Array|String} src [可以有数组，script的src]
     * @param  {Function}     cb  [回调函数，如果src为数组，则在所有script加载完后调用]
     */
    function loadScript(src, cb) {
        if (typeof src == 'string') {
            src = [src];
        }

        var i = 0,
            length = src.length,
            factories = new Array(length),
            fn = function(factory, index) {
                i++;
                factories[index] = exec(factory);
                if (i == src.length) {
                    typeof cb == 'function' && cb.apply(window, factories);
                    i = fn = null;
                }
            },
            args = [].slice.call(arguments, 2);


        for (var j = 0; j < length; j++) {
            addScript(src[j], fn, j);
        }

    }
    function addScript(src, fn, index) {
        var script,
            head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;

        if (src.slice(-3) != '.js') {
            src += '.js';
        }

        script = document.createElement('script');
        script.async = "async";
        script.charset = 'utf8';
        script.src = src;
        script.onload = script.onreadystatechange = function() {
            if (!script.readyState || script.readyState in {'loaded': 1, 'complete': 1}) {
                script.onload = script.onreadystatechange = null;
                fn(curent_factory, index);
                head.removeChild(script);
                curent_factory = script = index = null;
            }
        }
        head.insertBefore(script, head.firstChild);
    }

    var curent_factory = null;
    function factory(fn) {
        if (curent_factory) {
            return setTimeout(function() {
                factory(fn);
            }, 10);
        }
        curent_factory = fn;
    }

    window.loadScript = loadScript;
    window.factory = factory;
})(window);