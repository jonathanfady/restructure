class ArrayT {
  constructor(type, length) {
    this.type = type;
    this.length = length;
  }

  decode(stream) {
    const res = [];

    for (let i = 0; i < this.length; i++) {
      res.push(this.type.decode(stream));
    }

    return res;
  }

  size() {
    return this.type.size() * this.length
  }

  encode(stream, array) {
    for (let item of array) {
      this.type.encode(stream, item);
    }
  }
}

export { ArrayT as Array };
