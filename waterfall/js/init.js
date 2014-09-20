factory(function() {
    return function (waterfall, ajax) {

        var container = document.getElementById("test");
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
                                var li = document.createElement('li');
                                var img = document.createElement("img");
                                img.src = item.src;
                                img.width = 280;
                                img.height = item.height*280/item.width;
                                li.style.position = 'absolute';
                                li.style.left = -1500 + 'px';
                                li.style.top = 0;
                                li.appendChild(img);
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
