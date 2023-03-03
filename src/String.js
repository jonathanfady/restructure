// import { Base } from './Base.js';

class StringT /*extends Base*/ {
  constructor(length, encoding = 'ascii') {
    // super();
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
