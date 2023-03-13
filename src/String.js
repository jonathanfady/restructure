class StringT {
  constructor(length, encoding = 'ascii') {
    this.length = length;
    this.encoding = encoding;
    this.size = length;
  }

  decode() {
    return decode_stream.readString(this.length, this.encoding);
  }

  encode(val) {
    encode_stream.writeString(val, this.encoding);
  }
}

export { StringT as String };
