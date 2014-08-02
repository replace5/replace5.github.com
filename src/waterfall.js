factory(function () {

    function waterfall(options) {

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

        function getStyle(ele, prop) {
            var style = ele.currentStyle ? ele.currentStyle : window.getComputedStyle(ele, null);
            var value = style[prop];
            switch(prop) {
                case 'width':
                case 'height':
                case 'left':
                case 'right':
                case 'top':
                case 'bottom':
                case 'borderLeftWidth':
                case 'borderRightWidth':
                case 'borderTopWidth':
                case 'borderBottomWidth':
                case 'paddingLeft':
                case 'paddingRight':
                case 'paddingTop':
                case 'paddingBottom':
                case 'marginLeft':
                case 'marginRight':
                case 'marginTop':
                case 'marginBottom':
                    return parseInt(value, 10) || 0;
                default:
                    return value;
            }
        }

        function getInnerWidth(ele) {
            return ele.offsetWidth - getStyle(ele, 'borderLeftWidth') - getStyle(ele, 'borderRightWidth') - getStyle(ele, 'paddingLeft') - getStyle(ele, 'paddingRight');
        }

        function addEvent(ele, type, fn) {
            if (window.addEventListener) {
                window.addEventListener(type, fn, false);
            } else {
                ele['e' + type + fn] = fn;
                ele[type + fn] = function() {ele['e' + type + fn](window.event);}
                ele.attachEvent('on' + type, fn);
            }
        }

        function WaterFall() {
            this.init = function(options) {
                var defaults = {
                    padding: 5,
                    cloumn_width: 200,
                    autoResize: false,
                    min_cloumn: 3,
                    container: null
                };
                this.options = extend(options, defaults);
                this.setup();
                return this;
            }
        }
        WaterFall.prototype.setup = function() {
            // 配置验证
            var options = this.options;
            var container = options.container;
            if (!container || !container.tagName) {
                throw "the option container must be a element node";
            }
            this.container = container;

            options.padding = options.padding > 0 ? +options.padding : 0;
            options.cloumn_width = options.cloumn_width > 20 ? +options.cloumn_width : 20;

            var container_position = getStyle(container, 'position');
            if (container_position == '' || container_position == 'static') {
                container.style.position = 'relative';
            }
            this.width = getInnerWidth(container);
            this.build();

            var that = this;
            addEvent(window, 'resize', function() {
                if (!that.layouting && options.autoResize) {
                    that.build();
                }
            });
        }
        WaterFall.prototype.build = function() {
            var container = this.container;
            container.style.width = this.width + 'px';

            var options = this.options;
            var padding = options.padding;
            var cloumn_width = options.cloumn_width;


            // 计算列宽
            this.rows = Math.floor((this.width + padding)/(cloumn_width + padding));
            if (this.rows < options.min_cloumn) {
                this.rows = options.min_cloumn;
            }
            this.columnsheight = [];
            for(var i = 0; i < this.rows; i++) {
                this.columnsheight[i] = 0;
            }

            this.index = 0;
            this.layout();
        }
        WaterFall.prototype.layout = function() {
            this.layouting = true;
            var container = this.container;
            for (var j = this.index, len = container.children.length; j < len; j++) {
               var item = container.children[j];
               this.processItem(item);
            }
            this.layouting = false;
        }
        WaterFall.prototype.append = function(ele) {
            if (!ele) {return ;}

            if (ele.length) {
                for (var i = 0; i < ele.length; i++) {
                    this.append(ele[i]);
                }
            } else if (typeof ele == 'function') {
                this.append(ele());
            } else if (ele.tagName) {
                this.container.appendChild(ele);
                this.processItem(ele);
            }
        }
        WaterFall.prototype.maxCloumn = function() {
            return Math.max.apply(Math, this.columnsheight);
        }
        WaterFall.prototype.minCloumn = function() {
            var index = 0;
            var columnsheight = this.columnsheight;
            var min = Math.min.apply(Math, columnsheight);
            for(var i = 0, j = columnsheight.length; i < j; i++) {
                if(columnsheight[i] == min) {
                    index = i;
                    break;
                }
            }
            return index;
        }
        WaterFall.prototype.processItem = function(item) {
            var options = this.options;

            var index = this.index++;

            var cloumn = this.minCloumn();
            var columnsheight = this.columnsheight;
            var oldheight = columnsheight[cloumn];
            columnsheight[cloumn] += item.offsetHeight + options.padding;

            this.height = this.maxCloumn();
            this.container.style.height = this.height + 'px';

            item.style.position = 'absolute';
            item.style.width = options.cloumn_width - getStyle(item, 'borderLeftWidth') - getStyle(item, 'borderRightWidth') - getStyle(item, 'paddingLeft') - getStyle(item, 'paddingRight')+ 'px';
            item.style.left = cloumn * (options.padding + options.cloumn_width) + 'px';
            item.style.top = oldheight + 'px';
        }

        return (new WaterFall()).init(options);
    }

    return waterfall;
});