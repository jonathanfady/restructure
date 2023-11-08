import assert from 'assert';
import { String, Struct } from '../src/index.js';

describe('String', function () {
  describe('decode', function () {
    it('should decode fixed length', function () {
      const string = new Struct({ string: String(7) });
      assert.deepEqual(string.fromBuffer(Buffer.from('testing')), new Map(Object.entries({ string: 'testing' })));
    });

    it('should ignore \\x00 characters', function () {
      const string = new Struct({ string: String(7) });
      assert.deepEqual(string.fromBuffer(Buffer.from('t\x00e\x00s\x00t\x00ing')), new Map(Object.entries({ string: 'test' })));
      assert.deepEqual(string.fromBuffer(Buffer.from('playthrough')), new Map(Object.entries({ string: 'playthr' })));
      assert.deepEqual(string.fromBuffer(Buffer.from('p\x00lay\x00th\x00r\x00ough')), new Map(Object.entries({ string: 'playt' })));
      assert.deepEqual(string.fromBuffer(Buffer.from('ping pong')), new Map(Object.entries({ string: 'ping po' })));
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
      assert.deepEqual(string.toBuffer(new Map(Object.entries({ string: 'testing' }))), Buffer.from('testing\u0000\u0000\u0000'));
    });
    it('should encode using predefined string length', function () {
      const string = new Struct({ string: String(7) });
      assert.deepEqual(string.toBuffer(new Map(Object.entries({ string: 'testingandsomemoretext' }))), Buffer.from('testing'));
    });
  });
});
