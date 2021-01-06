function changeType(type) {
  switch (type) {
    case 'array':
    case 'object':
      return [];
    case 'number':
      return 0;
    case 'string':
      return '';
    case 'boolean':
      return true;
    default:
      return null;
  }
}

function getType(object) {
  switch (Object.prototype.toString.call(object)) {
    case '[object Array]':
      return 'array';
    case '[object Object]':
      return 'object';
    case '[object Null]':
    case '[object Undefined]':
      return 'null';
    case '[object Date]':
    case '[object RegExp]':
    case '[object Function]':
      return 'transform';
    default:
      return typeof object;
  }
}

export { changeType, getType };
