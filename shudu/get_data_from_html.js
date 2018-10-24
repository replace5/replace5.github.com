function get_data_from_html(elm) {
    var trs = elm.getElementsByTagName('tr');
    var ret = [];
    for (var i = 0; i < trs.length; i++) {
        var tr = trs[i];
        var tds = tr.getElementsByTagName('td');

        var line = [];
        for (var j = 0; j < tds.length; j++) {
            var input = tds[j].getElementsByTagName("input");
            var value = input.length ? +input[0].value : +tds[j].textContent
            line.push(value || 0);
        }

        ret.push(line);
    }

    try {
        copy(ret);
    } catch(e) {

    }

    return ret;
}