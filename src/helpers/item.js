class Item {
  constructor(item, base) {
    this.key = base === 'object' ? item.key : null;
    this.value = Item.processValue(item.value, Item.getType(item.value));
    this.type = item.type ?? this.#processType(Item.getType(item.value));
    this.collapsed = false;
    this.placeholder = 'key';
  }

  static parseItem(data, base) {
    return Object.entries(data).map(([key, value]) => new Item({ key, value }, base));
  }

  static processValue(value, type) {
    switch (type) {
      case 'object':
      case 'array':
        return Item.parseItem(value, type);
      case 'transform':
        return value.toString();
      default:
        return value;
    }
  }

  static getType(object) {
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

  #processType(type) {
    switch (type) {
      case 'transform':
        return 'string';
      default:
        return type;
    }
  }
}

export default Item;
