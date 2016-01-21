(function() {
	if (!Function.prototype['bind']) {
	    Function.prototype['bind'] = function (object) {
	        var originalFunction = this;
	        if (arguments.length === 1) {
	            return function () {
	                return originalFunction.apply(object, arguments);
	            };
	        } else {
	            var partialArgs = Array.prototype.slice.call(arguments, 1);
	            return function () {
	                var args = partialArgs.slice(0);
	                args.push.apply(args, arguments);
	                return originalFunction.apply(object, args);
	            };
	        }
	    };
	}

	function ObjectCount(object) {
		var count = 0;
		for (var i in object) {
			if (object.hasOwnProperty(i)) {
				count++;
			}
		}
		return count;
	}

	function getViewSize() {
		var viewElement = document.documentElement;
		if (document.compatMode !== "CSS1Compat") {
			viewElement = document.body;
		}
		return {
			width: viewElement.clientWidth,
			height: viewElement.clientHeight
		};
	}

	function newElement(tag, target, klazz, style, isBefore) {
		var element = document.createElement(tag);
		element.className = klazz || '';

		var cssText = [];
		if (style) {
			for (var prop in style) {
				if (style.hasOwnProperty(prop)) {
					cssText.push([prop, style[prop]].join(':'));
				}
			}
		}

		if (cssText.length) {
			element.style.cssText = cssText.join(';');
		}

		if (isBefore) {
			target.insertBefore(element, target.firstChild);
		} else {
			target.appendChild(element);
		}
		return element;
	}

	function hasClass(elm, klazz) {
	    return elm.className.match(new RegExp('(\\s|^)' + klazz + '(\\s|$)'));
	}

	var endSpace = /\s+$/;
	function addClass(elm, klazz) {
	    if (!hasClass(elm, klazz)) {
			elm.className = (elm.className || "").replace(endSpace, '')  + " " + klazz;
		}
	}

	function removeClass(elm, klazz) {
	    if (hasClass(elm, klazz)) {
	        var reg = new RegExp('(\\s|^)' + klazz + '(\\s|$)');
	        elm.className = elm.className.replace(reg, ' ');
	    }
	}

	function _convetPx(pxData) {
		if (typeof pxData === 'number') {
			if (pxData > 1 || pxData < -1) {
				pxData += 'px';
			} else {
				pxData = pxData * 100 + '%';
			}
		}
		return pxData;
	}

	function resizeElement(elm, width, height) {
		if (typeof width === 'object') {
			height = width.height;
			width = width.width;
		}

		if (width != null) {
			elm.style.width = _convetPx(width);
		}

		if (height != null) {
			elm.style.height = _convetPx(height);
		}

		return elm;
	}

	function positionElement(elm, left, top) {
		if (typeof left === 'object') {
			top = left.top;
			left = left.left;
		}

		if (left != null) {
			elm.style.left = _convetPx(left);
		}

		if (top != null) {
			elm.style.top = _convetPx(top);
		}

		return elm;
	}

	function addEvent(elm, type, handle, capture) {
		if (elm.addEventListener) {
			elm.addEventListener(type, handle, !!capture);
		} else if (elm.attachEvent) {
			elm.attachEvent("on" + type, handle);
		}
	}

	function $(selector) {
		return document.querySelector(selector);
	}

	function $$(selector) {
		return document.querySelectorAll(selector);
	}


	function Lottery(data, frequency, delay) {
		// 切换频率，即每秒钟跳动次数
		this.frequency = frequency || 50;
		// 延时时间，即停止后延时跳动时长（单位: s）
		this.delay = delay || 3;
		// 是否在抽奖中
		// 抽奖状态 1: 未开始，2：开始，3：已停止在延时执行
		this.status = 1;
		// 员工数据
		this.data = data.slice(0);
		// 中奖人员 人员 -> 第几轮中奖
		this.winners = {};
		// 第x轮
		this.round = 0;
		// 定时器句柄
		this.timer = null;
		// 当前跳动人员索引
		this.current = -1;
		// dom缓存
		this.doms = null;
		// 尺寸相关信息缓存
		this.size = {
			// 页面留白
			bodyPadding: 15,
			// 右侧宽度
			rightWidth: 256,
			// 左右最小间距
			centerPadding: 30,
			// 单项padding占图片的比例
			itemPaddingPercent: 0.05,
			// 中奖结果横行排列个数
			winnersXCount: 4,
			// 中奖结果单项padding占图片的比例
			winnersItemPaddingPercent: 0.05,
			// 聚焦大图的百分比
			focusPercent: 0.6,
			// 抽奖跳动的激活class
			currentClass: 'current',
			// 已抽中的头像class
			firedClass: 'opacity'
		};

		this.init();
	}
	Lottery.prototype.init = function() {
		this.render();
		this.renderList();
		this.layout();
		this.updateTriggerText();
		this.bindEvent();
		this.nextRound();
		return this;
	};
	// 渲染
	Lottery.prototype.render = function() {
		document.body.innerHTML = [
			'<div class="container">',
				'<div class="right">',
					'<div class="ctrl">',
						'<span class="trigger"></span>',
						'<span class="next">下一轮</span>',
					'</div>',
					'<div class="result">',
						'<h2>中奖结果</h2>',
						'<div class="winners"></div>',
					'</div>',
				'</div>',
				'<ul class="left">',
					'<div class="focus"></div>',
					'<div class="list"></div>',
				'</ul>',
			'</div>',
			'<audio class="music" src="music/hundoulu.mp3" loop="loop"></audio>'
		].join('');

		this.doms = {
			'container': $('.container'),
			'left': $('.left'),
			'focus': $('.focus'),
			'list': $('.list'),
			'right': $('.right'),
			'trigger': $('.trigger'),
			'next': $('.next'),
			'result': $('.result'),
			'winners': $('.winners'),
			'music': $('.music')
		};
		return this;
	};
	// 渲染列表
	Lottery.prototype.renderList = function() {
		for (var i = 0; i < this.data.length; i++) {
			var item = this.data[i];
			var elm = newElement('li', this.doms.list);
			elm.index = i;
			var img = newElement('img', elm);
			img.title = item.name;
			img.src = item.avatar;
		}
		return this;
	};
	// 计算尺寸并排列
	// 按类似瀑布流的方式排列所有头像
	Lottery.prototype.layout = function() {
		var viewport = getViewSize();
		document.body.style.padding = this.size.bodyPadding + 'px';
		viewport.width -= this.size.bodyPadding * 2;
		viewport.height -= this.size.bodyPadding * 2;

		// 右侧宽度
		var rightWidth = this.size.rightWidth;
		// 左侧宽度
		var leftWidth = viewport.width - rightWidth - this.size.centerPadding;

		// 初始尺寸
		var itemSize = 1;
		// 横向排列个数
		var xCount;
		// 纵向排列个数
		var yCount;
		// 如果尺寸个数计算出来未溢出，则增加1px
		while(xCount = Math.floor(leftWidth / itemSize), yCount = Math.floor(viewport.height / itemSize),  xCount * yCount > this.data.length) {
			itemSize += 1;
		}
		// 此时多1px已经溢出，回退
		itemSize -= 1;
		this.size.itemSize = itemSize;
		this.size.xCount = xCount = Math.floor(leftWidth / itemSize);
		this.size.yCount = yCount = Math.floor(viewport.height / itemSize);

		// 根据itemSize，重新计算leftWidth和留白
		this.size.leftWidth = leftWidth = xCount * itemSize;
		this.size.centerPadding = viewport.width - leftWidth - rightWidth;
		this.size.viewport = viewport;


		// 设置容器的尺寸
		resizeElement(this.doms.container, viewport);
		resizeElement(this.doms.left, leftWidth, viewport.height);
		resizeElement(this.doms.right, rightWidth, viewport.height);

		// padding尺寸
		var itemPadding = Math.floor(itemSize * this.size.itemPaddingPercent);
		var items = this.doms.list.children;
		for (var i = 0; i < items.length; i++) {
			resizeElement(items[i], itemSize - itemPadding * 2, itemSize - itemPadding * 2);
			items[i].style.padding = itemPadding + 'px';
			positionElement(items[i], (i % xCount) * itemSize, Math.floor(i / xCount) * itemSize);
		}

		return this;
	};
	Lottery.prototype.updateTriggerText = function() {
		var text;
		switch (this.status) {
			case 1:
				text = "开始";
			break;
			case 2:
				text = "停止";
			break;
			case 3:
				text = "拼了";
			break;
		}
		this.doms.trigger.innerText = text;
		return this;
	};
	// 绑定事件
	Lottery.prototype.bindEvent = function() {
		addEvent(this.doms.trigger, 'click', this._triggerClick.bind(this));
		addEvent(document.body, 'keyup', this._shortCutKey.bind(this));
		addEvent(this.doms.next,  'click',this.nextRound.bind(this));
		addEvent(window, 'resize', this.layout.bind(this));
		return this;
	};
	Lottery.prototype._shortCutKey = function(evt) {
		evt = evt || window.event;
		var key = evt.keyCode || evt.charCode || evt.which;

		switch (key) {
			case 13:
				this.start();
			break;
			case 32:
				this.stop();
			break;
		}
	};
	// 点击事件
	Lottery.prototype._triggerClick = function() {
		if (this.status === 2) {
			this.stop();
		} else if (this.status === 1) {
			this.start();
		}
	};
	// 高亮当前
	Lottery.prototype.highlightCurrent = function() {
		var currentClass = this.size.currentClass;
		var last = $('.' + currentClass);
		if (last) {
			setTimeout(function() {
				removeClass(last, currentClass)
			}, 2);
		}
		addClass(this.getCurrentElement(), currentClass);
		return this;
	};
	// 获取当前命中的数据
	Lottery.prototype.getCurrentData = function() {
		return this.data[this.current];
	};
	// 获取当前命中的节点
	Lottery.prototype.getCurrentElement = function() {
		var all = this.doms.list.children;
		for (var i = 0; i < all.length; i++) {
			if (all[i].index === this.current) {
				return all[i];
			}
		}
		return null;
	};
	// 抽奖跳动
	Lottery.prototype.run = function(frequency) {
		var current;
		if (ObjectCount(this.winners) >= this.data.length) {
			alert("所有人都中奖了，还抽什么");
			return this;
		}

		do {
			current = Math.floor(Math.random() * this.data.length);
		} while(current in this.winners)

		this.current = current;
		this.highlightCurrent();
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(this.run.bind(this, frequency), frequency);
		return this;
	};
	// 开始抽奖
	Lottery.prototype.start = function(frequency) {
		if (this.status === 1) {
			this.hideFocus();
			this.stopImmediate();
			this.status = 2;
			this.updateTriggerText();
			// 初始频率跳动
			this.run(1000 / this.frequency);
			// 播放音乐
			this.doms.music.play();
		}
	};
	// 停止抽奖，会延时跳动一段时间
	Lottery.prototype.stop = function() {
		if (this.status === 2) {
			this.status = 3;
			this.updateTriggerText();
			// 延时执行时，改变抽奖节奏
			this.run(2000 / this.frequency);

			// 延时执行一段时间
			setTimeout((function() {
				this.stopImmediate();
				this.fired();
				this.updateFiredStyle();
			}).bind(this), this.delay * 1000);
		}
	};
	// 立即停止
	Lottery.prototype.stopImmediate = function() {
		this.status = 1;
		if (this.timer) {
			clearTimeout(this.timer);
		}

		// 取消所有高亮样式
		var currentAll = $$('.' + this.size.currentClass) || [];
		for (var i = 0; i < currentAll.length; i++){
			removeClass(currentAll[i], this.size.currentClass);
		}

		// 更新按钮文字
		this.updateTriggerText();

		// 停止放音乐
		this.doms.music.pause();
		this.doms.music.currentTime = 0;
	};
	// 取消某人中奖,重新放回左侧抽奖区
	Lottery.prototype.cancelSomeone = function(index) {
		if (index in this.winners) {
			var data = this.data[index];
			if (window.confirm("你确定取消" + data.name + "的奖项吗？")) {
				// 如果最后一个被取消了，则影藏高亮大图
				if (index === this.current) {
					this.hideFocus();
				}

				delete this.winners[index];
				this.updateFiredStyle();
				var winners = this.doms.result.getElementsByTagName('dd');
				for (var i = 0; i < winners.length; i++) {
					if (winners[i].index === index) {
						winners[i].innerHTML = "已取消";
					}
				}
			}
		}
	};
	// 停止后将中奖人员放入结果区
	// 计算出目标位置和动画初始位置的差值，先设置成动画初始的位置，延时一段时间后再移动到目标位置
	Lottery.prototype.fired = function() {
		this.winners[this.current] = this.round;
		// 渲染结果
		var roundTarget = this.doms.winners.getElementsByTagName('dl')[0];
		// 抽中高亮的原始节点
		var firedElement = this.getCurrentElement();
		// 中奖结果的新节点
		var element = document.createElement('dd');

		element.innerHTML = firedElement.innerHTML;
		element.index = this.current;
		// 双击取消选中
		addEvent(element, 'dblclick', this.cancelSomeone.bind(this, this.current));

		// 每行个数
		var xCount = this.size.winnersXCount;
		// 单个尺寸
		var itemSize = this.size.rightWidth / xCount;
		// padding尺寸
		var itemPadding = Math.floor(itemSize * this.size.winnersItemPaddingPercent);
		// 当前节点的索引位置，需要减去dt占据的位置
		var index = roundTarget.children.length - 1;
		// dt的高度
		var dtHeight = roundTarget.getElementsByTagName('dt')[0].offsetHeight;
		// 计算在中奖结果的位置
		var position = {
			width: itemSize - itemPadding * 2,
			height: itemSize - itemPadding * 2,
			left: (index % xCount) * itemSize,
			top: Math.floor(index / xCount) * itemSize + dtHeight
		};

		resizeElement(element, position);
		element.style.lineHeight = position.height + 'px';
		element.style.padding = itemPadding + 'px';
		resizeElement(roundTarget, void 0, position.top + position.height);

		// 计算抽奖节点和结果节点的相对位置
		var roundTargetClientPosition = roundTarget.getBoundingClientRect();
		var firedElementClientPosition = firedElement.getBoundingClientRect();
		// 先定位到抽奖节点的位置
		positionElement(element, {
			left: firedElementClientPosition.left - roundTargetClientPosition.left - position.left,
			top: firedElementClientPosition.top - roundTargetClientPosition.top - position.top
		});
		roundTarget.appendChild(element);
		// 再移动到目标位置
		setTimeout(function() {
			positionElement(element, position);
		}, 10);

		this.showFocus();
		return this;
	};
	// 已抽中的头像样式低亮显示
	Lottery.prototype.updateFiredStyle = function() {
		var items = this.doms.list.children;

		for (var i = 0 ; i < items.length; i++) {
			if (items[i].index in this.winners) {
				addClass(items[i], this.size.firedClass);
			} else {
				removeClass(items[i], this.size.firedClass);
			}
		}
		return this;
	};
	// 隐藏命中的聚焦大图头像
	Lottery.prototype.hideFocus = function() {
		this.doms.focus.style.display = 'none';
		resizeElement(this.doms.focus, 0, 0);
	};
	// 显示命中的聚焦大图头像
	Lottery.prototype.showFocus = function() {
		var focus = this.doms.focus;
		focus.innerHTML = this.getCurrentElement().innerHTML;
		newElement('span', focus, 'focus-text').innerText = (this.getCurrentData() || {}).name;

		var size = Math.min(this.size.leftWidth, this.size.viewport.height) * this.size.focusPercent;
		this.doms.focus.style.display = 'block';
		setTimeout(function() {
			resizeElement(focus, size, size);
		}, 1)
	};
	// 下一轮
	Lottery.prototype.nextRound = function() {
		this.round++;
		newElement('dt', newElement('dl', this.doms.winners, 'round round1', void 0, true)).innerText = "第" + this.round + "轮";
	};

	window.Lottery = Lottery;
})();