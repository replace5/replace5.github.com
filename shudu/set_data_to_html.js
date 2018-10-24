function set_data_to_html(elm, arr, setBg) {
    var trs = elm.getElementsByTagName('tr');
    for (var i = 0; i < trs.length; i++) {
        var tr = trs[i];
        var tds = tr.getElementsByTagName('td');

        for (var j = 0; j < tds.length; j++) {
            var input = tds[j].getElementsByTagName("input");
            var origin = input.length ? +input[0].value : +tds[j].textContent;

            if (input.length) {
                input[0].value = arr[i][j];
            } else {
                tds[j].textContent = arr[i][j];
            }

            if (!origin && setBg) {
                if (input.length) {
                    input[0].style.backgroundColor = '#f00';
                    input[0].style.color = '#fff';
                }
                tds[j].style.backgroundColor = '#f00';
            }
        }
    }

    console.log('ready');
}