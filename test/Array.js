import assert from 'assert';
import { Array as ArrayT, Struct, uint8 } from '@jonathanfady/restructure';

describe('Array', function () {
  describe('decode', function () {
    it('should decode fixed length', function () {
      const array = new Struct({ arr: ArrayT(uint8, 4) });
      assert.deepEqual(array.fromBuffer(new Uint8Array([1, 2, 3, 4, 5])), new Map(Object.entries({ arr: [1, 2, 3, 4] })));
    });
  });

  describe('size', function () {
    it('should use defined length if no value given', function () {
      const array = ArrayT(uint8, 10);
      assert.equal(array.size, 10);
    });
  });

  describe('encode', function () {
    it('should encode', function () {
      const array = new Struct({ arr: ArrayT(uint8, 4) });
      assert.deepEqual(array.toBuffer(new Map(Object.entries({ arr: [1, 2, 3, 4] }))), new Uint8Array([1, 2, 3, 4]));
    });

    it('should encode using array length', function () {
      const array = new Struct({ arr: ArrayT(uint8, 10) });
      assert.deepEqual(array.toBuffer(new Map(Object.entries({ arr: [1, 2, 3, 4] }))), new Uint8Array([1, 2, 3, 4, 0, 0, 0, 0, 0, 0]));
    });

    it('should encode using array length', function () {
      const array = new Struct({ arr: ArrayT(uint8, 4) });
      assert.deepEqual(array.toBuffer(new Map(Object.entries({ arr: [1, 2, 3, 4, 0, 1, 2, 3, 4, 5] }))), new Uint8Array([1, 2, 3, 4]));
    });
  });
});
