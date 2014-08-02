function type(variable, t) {
    return Object.prototype.toString.call(variable).indexOf(t+']') > -1;
}

function isObject(variable) {
    return type(variable, 'Object');
}

function isFunction(variable) {
    return type(variable, 'Function');
}
function isArray(variable) {
    return type(variable, 'Array');
}

function isString(variable) {
    return type(variable, 'String');
}

function isNumber(variable) {
    return !isNaN(parseFloat(variable)) && isFinite(variable);
}

function isRegExp(variable) {
    return type(variable, 'RegExp');
}

function isWindow(variable) {
    return variable != null && variable = variable.window;
}
