function loadImage(node, after_single, after_all) {
    function noop() {}
    function is_func(variable) {
        return typeof variable == 'function';
    }
    function load_check(loading) {
        if (loading.complete) {
            complete++;
            after_single(loading.ele, loading.width, loading.height, loading.i);
            if (complete == max) {
                after_all(complete);
            }
            loading.ele = null;
            loading = null;
        } else {
            setTimeout(function(){
                load_check(loading);
            }, 100);
        }
    }
    node = node || document;
    !is_func(after_single) && (after_single =  noop);
    !is_func(after_all) && (after_all =  noop);
    var images = node.getElementsByTagName("img");
    var max = images.length;
    var complete = 0;
    for (var i = 0; i < max; i++) {
        var image = images[i];
        var loading = new Image();
        loading.src = image.src;
        loading.ele = image;
        loading.i = i;
        load_check(loading);
    }
}