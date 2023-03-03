class StringT {
  constructor(length, encoding = 'ascii') {
    this.length = length;
    this.encoding = encoding;
  }

  decode(stream) {
    return stream.readString(this.length, this.encoding);
  }

  size() {
    return this.length;
  }

  encode(stream, val) {
    stream.writeString(val, this.encoding);
  }
}

export { StringT as String };
