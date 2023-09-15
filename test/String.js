import assert from 'assert';
import { String as StringT, Struct } from '@jonathanfady/restructure';

describe('String', function () {
  describe('decode', function () {
    it('should decode fixed length', function () {
      const string = new Struct({ string: StringT(7) });
      assert.deepEqual(string.fromBuffer(Buffer.from('testing')), new Map(Object.entries({ string: 'testing' })));
    });
  });

  describe('size', function () {
    it('should use defined length if no value given', function () {
      const string = new Struct({ string: StringT(10) });
      assert.equal(string.size, 10);
    });
  });

  describe('encode', function () {
    it('should encode', function () {
      const string = new Struct({ string: StringT(7) });
      assert.deepEqual(string.toBuffer(new Map(Object.entries({ string: 'testing' }))), Buffer.from('testing'));
    });

    it('should encode using predefined string length', function () {
      const string = new Struct({ string: StringT(10) });
      assert.deepEqual(string.toBuffer(new Map(Object.entries({ string: 'testing' }))), Buffer.from('testing\u0000\u0000\u0000'));
    });
    it('should encode using predefined string length', function () {
      const string = new Struct({ string: StringT(7) });
      assert.deepEqual(string.toBuffer(new Map(Object.entries({ string: 'testingandsomemoretext' }))), Buffer.from('testing'));
    });
  });
});
