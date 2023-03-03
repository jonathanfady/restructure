class ArrayT {
  constructor(type, length) {
    this.type = type;
    this.length = length;
    this.size = type.size * length;
  }

  decode(stream) {
    const res = [];

    for (let i = 0; i < this.length; i++) {
      res.push(this.type.decode(stream));
    }

    return res;
  }

  encode(stream, array) {
    for (let item of array) {
      this.type.encode(stream, item);
    }
  }
}

export { ArrayT as Array };
