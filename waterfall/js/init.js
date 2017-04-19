factory(function() {
    return function (waterfall, ajax) {
        var container = document.getElementById("test");
        var options = {
            padding: 10,
            cloumn_width: 250,
            container: container
        };
        var cloumn_padding = 10;

        for (var i = 0, lis = container.children; i < lis.length; i++) {
            var li = lis[i];
            var width = li.getAttribute('data-width') || options.cloumn_width;
            var height = li.getAttribute('data-height') || 150;
            var real_width = options.cloumn_width - cloumn_padding * 2;
            var real_height = real_width * height / width;

            li.style.width = real_width + 'px';
            li.style.height = real_height + 'px';

            li.innerHTML = ReferrerKiller.imageHtml(li.getAttribute("data-src"), {
                style: 'width: ' + real_width + 'px;height: '+  real_height + 'px;'
            });
        }

        var wt = waterfall(options);
        window.onscroll = function() {
            var clientHeight = document[document.compatMode === 'CSS1Compat' ? "documentElement" : "body"].clientHeight,
                scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
                scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            if (scrollHeight - clientHeight - scrollTop < 100) {
                loadData();
            }
        }
        function loadData() {
            ajax({
                url: 'data/data.json',
                type: 'GET',
                complete: function(err, data) {
                    if (!err) {
                        wt.append(function() {
                            var eles = [];
                            for (var i = 0, len = data.items.length; i< len; i ++) {
                                if (Math.random() > 0.4) {continue;}
                                var item = data.items[i];
                                var width = (options.cloumn_width - cloumn_padding) + 'px';
                                var height = item.height*(options.cloumn_width - cloumn_padding)/item.width + 'px';
                                var li = document.createElement('li');
                                li.style.width = width + 'px';
                                li.style.height = height + 'px';
                                li.style.position = 'absolute';
                                li.style.left = -1500 + 'px';
                                li.style.top = 0;
                                li.innerHTML = ReferrerKiller.imageHtml(item.src, {
                                    style: 'width: ' + width + ';height: '+ height
                                });
                                eles.push(li);
                            }
                            return eles;
                        });
                    }
                }
            })
        }
    }
});
