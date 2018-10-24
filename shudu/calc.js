function SD_CALC(arr) {
    var traceback = [];
    var flag = false;

    var count = 0;

    console.time('耗时');
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9;) {
            if (count ++ > 1e10) {
                console.log('死循环');
                return "循环次数过多";
            }

            if (!arr[y][x] || flag) {
                flag = false;
                
                if (_guessColValue(arr, y, x)) {
                    // 保存回溯点
                    traceback.push([y, x]);
                } else {
                    arr[y][x] = 0;
                    let tb_point = traceback.pop();

                    // 不存在回溯点，则无解
                    if (!tb_point) {
                        console.log('无解');
                        return "无解";
                    }

                    y = tb_point[0];
                    x = tb_point[1];
                    flag = true;
                    continue;
                }
            }
            
            x++;
        }
    }

    console.timeEnd('耗时');
    return arr;
}

function _guessColValue(arr, y, x) {
    for (k = arr[y][x]; k < 9;) {
        arr[y][x] = ++k;
        if (_checkY(arr, x) && _checkX(arr, y) && _check9Grid(arr, y, x)) {
            return true;
        } 
    }

    return false;
}

// 检查某一行的猜测值是否合法
function _checkX(arr, y) {
    var row = arr[y];

    var map = {};
    for (let col of row) {
        if (col && map[col]) {
            return false;
        }
        map[col] = 1;
    }

    return true;
}

// 检查某一列的值是否合法
function _checkY(arr, x) {
    var map = {};
    for (let row of arr) {
        let col = row[x];
        if (col && map[col]) {
            return false;
        }
        map[col] = 1;
    }

    return true;
}

// 检查9宫格
function _check9Grid(arr, y, x) {
    var map = {};

    for (var row = Math.floor(y / 3) * 3; row < Math.floor(y / 3) * 3 + 3; row++) {
        for (var col = Math.floor(x / 3) * 3; col < Math.floor(x / 3) * 3 + 3; col++) {
            if ((row != y) && (col != x) && (arr[row][col] == arr[y][x])) {
                return false
            }
        }
    }

    return true;
}