class StringT {
  constructor(length, encoding = 'ascii') {
    this.length = length;
    this.encoding = encoding;
    this.size = length;
  }

  decode(stream) {
    return stream.readString(this.length, this.encoding);
  }

  encode(stream, val) {
    stream.writeString(val, this.encoding);
  }
}

export { StringT as String };
