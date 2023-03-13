class ArrayT {
  constructor(type, length) {
    this.type = type;
    this.length = length;
    this.size = type.size * length;
  }

  decode() {
    const res = [];

    for (let i = 0; i < this.length; i++) {
      res.push(this.type.decode());
    }

    return res;
  }

  encode(array) {
    for (let item of array) {
      this.type.encode(item);
    }
  }
}

export { ArrayT as Array };
