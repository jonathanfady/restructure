import assert from 'assert';
import { String, Struct } from '../src/index.js';

describe('String', function () {
  describe('decode', function () {
    it('should decode fixed length', function () {
      const string = new Struct({ string: String(7) });
      assert.deepEqual(string.fromBuffer(Buffer.from('testing')), new Map(Object.entries({ string: 'testing' })));
    });

    it('should decode longer strings', function () {
      const string = new Struct({ string: String(7) });
      assert.deepEqual(string.fromBuffer(Buffer.from('t\x00e\x00s\x00t\x00ing')), new Map(Object.entries({ string: 'test' })));
      assert.deepEqual(string.fromBuffer(Buffer.from('playthrough')), new Map(Object.entries({ string: 'playthr' })));
      assert.deepEqual(string.fromBuffer(Buffer.from('p\x00lay\x00th\x00r\x00ough')), new Map(Object.entries({ string: 'playt' })));
      assert.deepEqual(string.fromBuffer(Buffer.from('ping pong')), new Map(Object.entries({ string: 'ping po' })));
    });

    it('should decode shorter strings', function () {
      const string = new Struct({ string: String(5) });
      assert.deepEqual(string.fromBuffer(new Uint8Array(new Array(10))), new Map(Object.entries({ string: '' })));
      assert.deepEqual(string.fromBuffer(Buffer.from('play\x00')), new Map(Object.entries({ string: 'play' })));
      assert.deepEqual(string.fromBuffer(Buffer.from('\x00\x01\x02\x04\x05\x06')), new Map(Object.entries({ string: '\x01\x02\x04\x05' })));
    });
  });

  describe('size', function () {
    it('should use defined length if no value given', function () {
      const string = new Struct({ string: String(10) });
      assert.equal(string.size, 10);
    });
  });

  describe('encode', function () {
    it('should encode', function () {
      const string = new Struct({ string: String(7) });
      assert.deepEqual(string.toBuffer(new Map(Object.entries({ string: 'testing' }))), Buffer.from('testing'));
    });

    it('should encode using predefined string length', function () {
      const string = new Struct({ string: String(10) });
      assert.deepEqual(string.toBuffer(new Map(Object.entries({ string: 'testing' }))), Buffer.from('testing\x00\x00\x00'));
    });
    it('should encode using predefined string length', function () {
      const string = new Struct({ string: String(7) });
      assert.deepEqual(string.toBuffer(new Map(Object.entries({ string: 'testingandsomemoretext' }))), Buffer.from('testing'));
    });
  });
});
