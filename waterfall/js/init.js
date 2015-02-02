factory(function() {
    return function (waterfall, ajax) {

        var container = document.getElementById("test");

        for (var i = 0, lis = container.children; i < lis.length; i++) {
            var li = lis[i];
            var width = li.getAttribute('data-width') || '';
            var height = li.getAttribute('data-height') || '';
            li.style.width = width;
            li.style.height = height;

            li.innerHTML = ReferrerKiller.imageHtml(li.getAttribute("data-src"), {
                width: width,
                height: height
            });
        }

        var wt = waterfall({
            padding: 10,
            cloumn_width: 300,
            container: container
        });
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
                                var width = 280;
                                var height = item.height*280/item.width;
                                var li = document.createElement('li');
                                li.width = width;
                                li.height = height;
                                li.style.position = 'absolute';
                                li.style.left = -1500 + 'px';
                                li.style.top = 0;
                                li.innerHTML = ReferrerKiller.imageHtml(item.src, {
                                    width: width,
                                    height: height
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
