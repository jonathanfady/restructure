class StringT {
  constructor(length, encoding = 'ascii') {
    this.length = length;
    this.encoding = encoding;
    this.size = length;
  }
}

export { StringT as String };
