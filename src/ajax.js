factory(function() {
    function ajax(options) {
        function noop() {}
        function is_func(variable) {
            return typeof variable == 'function';
        }
        function cancopy(variable) {
            var to_string = Object.prototype.toString;
            var call_res = to_string.call(variable);
            return call_res == '[object Array]' || call_res == '[object Object]';
        }

        function extend(target) {
            var args = [].slice.call(arguments, 1);
            for (var i = 0, len = args.length; i < len; i++ ) {
                var obj = args[i];
                if (cancopy(obj)) {
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            if (!(prop in target)) {
                               target[prop] = obj[prop];
                            }
                        }
                    }
                }
            }
            return target;
        }

        function xhr() {
            var fns = [
                function() {return new XMLHttpRequest()},
                function() {return new ActiveXObject('Msxml2.XMLHTTP')},
                function() {return new ActiveXObject('Microsof.XMLHTTP')}
            ];
            for (var i = 0; i < fns.length; i++) {
                try {
                    var _xhr = fns[i]();
                    xhr = fns[i];
                    return _xhr;
                } catch(e) {}
            }
            return false;
        }

        function Ajax() {
            this.init = function(options) {
                var defaults = {
                    async: true,
                    type: 'POST',
                    complete: noop
                };
                this.options = extend(options, defaults);
                this.options.type = this.options.type == 'POST' ? 'POST' : 'GET';
                this.xhr = xhr();
                if (this.xhr) {
                    this.send();
                }
                return this;
            }
        }
        Ajax.prototype.send = function() {
            var that = this;
            var options = this.options;
            var xhr = this.xhr;
            xhr.open(options.type, options.url, options.async);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    that.callback(xhr.responseText);
                    that = null;
                }
            }
            xhr.send(options.data || {});
        }
        Ajax.prototype.parseJSON = function(data) {
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(data);
            }
            return (new Function("return " + data))();
        }
        Ajax.prototype.callback = function(data) {
            var error;
            try {
                data = this.parseJSON(data);
            } catch(e) {
                error = e;
            }
            if (is_func(options.complete)) {
                options.complete(error, data);
            }
        }
        return (new Ajax()).init(options);

    }

    return ajax;
});