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

function checkKey(item) {
  if (item.key.length === 0) {
    item.placeholder = 'cannot be empty';
    return false;
  }
  if (item.key[0].match(/[a-zA-Z_]/) === null) {
    item.key = '';
    item.placeholder = 'not correct key';
    return false;
  }

  item.placeholder = 'key';
  return true;
}

export { changeType, getType, checkKey };
