import assert from 'assert';
import {
  uint8,
  uint16, uint16be, uint16le,
  uint24, uint24be, uint24le,
  uint32, uint32be, uint32le,
  int8,
  int16, int16be, int16le,
  int24, int24be, int24le,
  int32, int32be, int32le,
  float, floatbe, floatle,
  double, doublebe, doublele,
  Struct
} from '../src/index.js';

describe('Number', function () {
  describe('uint8', function () {
    const number = new Struct({ number: uint8 });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xab, 0xff])), new Map(Object.entries({ number: 0xab })));
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xff, 0xab])), new Map(Object.entries({ number: 0xff })));
    });

    it('should have a size', function () {
      assert.equal(number.size, 1);
    });

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 0xab }))), new Uint8Array([0xab]));
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 0xff }))), new Uint8Array([0xff]));
    });
  });

  describe('uint16', () =>
    it('is an alias for uint16be', () => assert.deepEqual(uint16, uint16be))
  );

  describe('uint16be', function () {
    const number = new Struct({ number: uint16be });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xab, 0xff])), new Map(Object.entries({ number: 0xabff })));
    });

    it('should have a size', function () {
      assert.equal(number.size, 2);
    });

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 0xabff }))), new Uint8Array([0xab, 0xff]));
    });
  });

  describe('uint16le', function () {
    const number = new Struct({ number: uint16le });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xff, 0xab])), new Map(Object.entries({ number: 0xabff })));
    });

    it('should have a size', () => assert.equal(number.size, 2));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 0xabff }))), new Uint8Array([0xff, 0xab]));
    });
  });

  describe('uint24', () =>
    it('is an alias for uint24be', () => assert.deepEqual(uint24, uint24be))
  );

  describe('uint24be', function () {
    const number = new Struct({ number: uint24be });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xff, 0xab, 0x24])), new Map(Object.entries({ number: 0xffab24 })));
    });

    it('should have a size', () => assert.equal(number.size, 3));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 0xffab24 }))), new Uint8Array([0xff, 0xab, 0x24]));
    });
  });

  describe('uint24le', function () {
    const number = new Struct({ number: uint24le });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0x24, 0xab, 0xff])), new Map(Object.entries({ number: 0xffab24 })));
    });

    it('should have a size', () => assert.equal(number.size, 3));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 0xffab24 }))), new Uint8Array([0x24, 0xab, 0xff]));
    });
  });

  describe('uint32', () =>
    it('is an alias for uint32be', () => assert.deepEqual(uint32, uint32be))
  );

  describe('uint32be', function () {
    const number = new Struct({ number: uint32be });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xff, 0xab, 0x24, 0xbf])), new Map(Object.entries({ number: 0xffab24bf })));
    });

    it('should have a size', () => assert.equal(number.size, 4));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 0xffab24bf }))), new Uint8Array([0xff, 0xab, 0x24, 0xbf]));
    });
  });

  describe('uint32le', function () {
    const number = new Struct({ number: uint32le });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xbf, 0x24, 0xab, 0xff])), new Map(Object.entries({ number: 0xffab24bf })));
    });

    it('should have a size', () => assert.equal(number.size, 4));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 0xffab24bf }))), new Uint8Array([0xbf, 0x24, 0xab, 0xff]));
    });
  });

  describe('int8', function () {
    const number = new Struct({ number: int8 });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0x7f, 0xff])), new Map(Object.entries({ number: 127 })));
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xff, 0x7f])), new Map(Object.entries({ number: -1 })));
    });

    it('should have a size', () => assert.equal(number.size, 1));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 127 }))), new Uint8Array([0x7f]));
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: -1 }))), new Uint8Array([0xff]));
    });
  });

  describe('int16', () =>
    it('is an alias for int16be', () => assert.deepEqual(int16, int16be))
  );

  describe('int16be', function () {
    const number = new Struct({ number: int16be });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xff, 0xab])), new Map(Object.entries({ number: -85 })));
    });

    it('should have a size', () => assert.equal(number.size, 2));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: -85 }))), new Uint8Array([0xff, 0xab]));
    });
  });

  describe('int16le', function () {
    const number = new Struct({ number: int16le });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xab, 0xff])), new Map(Object.entries({ number: -85 })));
    });

    it('should have a size', () => assert.equal(number.size, 2));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: -85 }))), new Uint8Array([0xab, 0xff]));
    });
  });

  describe('int24', () =>
    it('is an alias for int24be', () => assert.deepEqual(int24, int24be))
  );

  describe('int24be', function () {
    const number = new Struct({ number: int24be });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xff, 0xab, 0x24])), new Map(Object.entries({ number: -21724 })));
    });

    it('should have a size', () => assert.equal(number.size, 3));

    it('should encode positive', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 21724 }))), new Uint8Array([0x00, 0x54, 0xDC]));
    });

    it('should encode negative', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: -21724 }))), new Uint8Array([0xff, 0xab, 0x24]));
    });
  });

  describe('int24le', function () {
    const number = new Struct({ number: int24le });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0x24, 0xab, 0xff])), new Map(Object.entries({ number: -21724 })));
    });

    it('should have a size', () => assert.equal(number.size, 3));

    it('should encode positive', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 21724 }))), new Uint8Array([0xDC, 0x54, 0x00]));
    });

    it('should encode negative', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: -21724 }))), new Uint8Array([0x24, 0xab, 0xff]));
    });
  });

  describe('int32', () =>
    it('is an alias for int32be', () => assert.deepEqual(int32, int32be))
  );

  describe('int32be', function () {
    const number = new Struct({ number: int32be });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xff, 0xab, 0x24, 0xbf])), new Map(Object.entries({ number: -5561153 })));
    });

    it('should have a size', () => assert.equal(number.size, 4));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: -5561153 }))), new Uint8Array([0xff, 0xab, 0x24, 0xbf]));
    });
  });

  describe('int32le', function () {
    const number = new Struct({ number: int32le });

    it('should decode', function () {
      assert.deepEqual(number.fromBuffer(new Uint8Array([0xbf, 0x24, 0xab, 0xff])), new Map(Object.entries({ number: -5561153 })));
    });

    it('should have a size', () => assert.equal(number.size, 4));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: -5561153 }))), new Uint8Array([0xbf, 0x24, 0xab, 0xff]));
    });
  });

  describe('float', () =>
    it('is an alias for floatbe', () => assert.deepEqual(float, floatbe))
  );

  describe('floatbe', function () {
    const number = new Struct({ number: floatbe });

    it('should decode', function () {
      const value = number.fromBuffer(new Uint8Array([0x43, 0x7a, 0x8c, 0xcd]));
      assert(value.get('number') >= 250.55 - 0.005);
      assert(value.get('number') <= 250.55 + 0.005);
    });

    it('should have a size', () => assert.equal(number.size, 4));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 250.55 }))), new Uint8Array([0x43, 0x7a, 0x8c, 0xcd]));
    });
  });

  describe('floatle', function () {
    const number = new Struct({ number: floatle });

    it('should decode', function () {
      const value = number.fromBuffer(new Uint8Array([0xcd, 0x8c, 0x7a, 0x43]));
      assert(value.get('number') >= 250.55 - 0.005);
      assert(value.get('number') <= 250.55 + 0.005);
    });

    it('should have a size', () => assert.equal(number.size, 4));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 250.55 }))), new Uint8Array([0xcd, 0x8c, 0x7a, 0x43]));
    });
  });

  describe('double', () =>
    it('is an alias for doublebe', () => assert.deepEqual(double, doublebe))
  );

  describe('doublebe', function () {
    const number = new Struct({ number: doublebe });

    it('should decode', function () {
      const value = number.fromBuffer(new Uint8Array(new Uint8Array([0x40, 0x93, 0x4a, 0x3d, 0x70, 0xa3, 0xd7, 0x0a])));
      assert(value.get('number') >= 1234.56 - 0.005);
      assert(value.get('number') <= 1234.56 + 0.005);
    });

    it('should have a size', () => assert.equal(number.size, 8));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 1234.56 }))), new Uint8Array([0x40, 0x93, 0x4a, 0x3d, 0x70, 0xa3, 0xd7, 0x0a]));
    });
  });

  describe('doublele', function () {
    const number = new Struct({ number: doublele });

    it('should decode', function () {
      const value = number.fromBuffer(new Uint8Array(new Uint8Array([0x0a, 0xd7, 0xa3, 0x70, 0x3d, 0x4a, 0x93, 0x40])));
      assert(value.get('number') >= 1234.56 - 0.005);
      assert(value.get('number') <= 1234.56 + 0.005);
    });

    it('should have a size', () => assert.equal(number.size, 8));

    it('should encode', function () {
      assert.deepEqual(number.toBuffer(new Map(Object.entries({ number: 1234.56 }))), new Uint8Array([0x0a, 0xd7, 0xa3, 0x70, 0x3d, 0x4a, 0x93, 0x40]));
    });
  });

  describe('unknown', function () {
    const number = new Struct({ number: 'unknown' });

    it('should have a size', () => assert.equal(number.size, 0));
  });
});
