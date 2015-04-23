(function(window, $, duration) {
	duration = duration || 100;
	var task = [];
	var timer = null;
	var noop = function() {};

	function start() {
		stop();
		if (!timer) {
			timer = window.setInterval(run, duration);
		}
	}

	function stop() {
		if (timer) {
			window.clearInterval(timer);
			timer = null;
		}
	}

	function run() {
		var item, i = 0; len = task.length;

		for (; i < len;) {
			item = task[i];
			if (!check(item || [], i)) {
				i++;
			}
		}
		if (!task.length) {
			stop();
		}
	}

	function check(item, index) {
		if (!item && item.length < 3) {
			return;
		}
		var selector = item[0];
		var type = item[1];
		var cb = item[2];
		var elm = $(document).find(selector);

		if (elm && elm.length) {
			elm.on(type, cb);
			task.splice(index, 1);
			return true;
		}
		return false;
	}

	function delayBind(selector, type,  cb) {
		start();
		task.push(arguments);
	}

	window.__delayBind = delayBind;
})(window, jQuery, 100);
//@ sourceURL=__delayBind.js


// 用法(需要jQuery)
// __delayBind(选择器, 事件（如click）, 响应函数)