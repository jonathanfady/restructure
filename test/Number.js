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
  // fixed16, fixed16be, fixed16le,
  // fixed32, fixed32be, fixed32le,
  DecodeStream, EncodeStream
} from '@jonathanfady/restructure';
import assert from 'assert';

describe('Number', function () {
  describe('uint8', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0xab, 0xff]));
      assert.equal(uint8.decode(), 0xab);
      assert.equal(uint8.decode(), 0xff);
    });

    it('should have a size', () => assert.equal(uint8.size, 1));

    it('should encode', function () {
      const buffer = new Uint8Array(uint8.size);
      global.encode_stream = new EncodeStream(buffer);
      uint8.encode(0xab);
      assert.deepEqual(buffer, new Uint8Array([0xab]));
    });

    it('should encode', function () {
      const buffer = new Uint8Array(uint8.size);
      global.encode_stream = new EncodeStream(buffer);
      uint8.encode(0xff);
      assert.deepEqual(buffer, new Uint8Array([0xff]));
    });
  });

  describe('uint16', () =>
    it('is an alias for uint16be', () => assert.deepEqual(uint16, uint16be))
  );

  describe('uint16be', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0xab, 0xff]));
      assert.equal(uint16be.decode(), 0xabff);
    });

    it('should have a size', () => assert.equal(uint16be.size, 2));

    it('should encode', function () {
      const buffer = new Uint8Array(uint16be.size);
      global.encode_stream = new EncodeStream(buffer);
      uint16be.encode(0xabff);
      assert.deepEqual(buffer, new Uint8Array([0xab, 0xff]));
    });
  });

  describe('uint16le', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0xff, 0xab]));
      assert.equal(uint16le.decode(), 0xabff);
    });

    it('should have a size', () => assert.equal(uint16le.size, 2));

    it('should encode', function () {
      const buffer = new Uint8Array(uint16le.size);
      global.encode_stream = new EncodeStream(buffer);
      uint16le.encode(0xabff);
      assert.deepEqual(buffer, new Uint8Array([0xff, 0xab]));
    });
  });

  describe('uint24', () =>
    it('is an alias for uint24be', () => assert.deepEqual(uint24, uint24be))
  );

  describe('uint24be', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0xff, 0xab, 0x24]));
      assert.equal(uint24be.decode(), 0xffab24);
    });

    it('should have a size', () => assert.equal(uint24be.size, 3));

    it('should encode', function () {
      const buffer = new Uint8Array(uint24be.size);
      global.encode_stream = new EncodeStream(buffer);
      uint24be.encode(0xffab24);
      assert.deepEqual(buffer, new Uint8Array([0xff, 0xab, 0x24]));
    });
  });

  describe('uint24le', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0x24, 0xab, 0xff]));
      assert.equal(uint24le.decode(), 0xffab24);
    });

    it('should have a size', () => assert.equal(uint24le.size, 3));

    it('should encode', function () {
      const buffer = new Uint8Array(uint24le.size);
      global.encode_stream = new EncodeStream(buffer);
      uint24le.encode(0xffab24);
      assert.deepEqual(buffer, new Uint8Array([0x24, 0xab, 0xff]));
    });
  });

  describe('uint32', () =>
    it('is an alias for uint32be', () => assert.deepEqual(uint32, uint32be))
  );

  describe('uint32be', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0xff, 0xab, 0x24, 0xbf]));
      assert.equal(uint32be.decode(), 0xffab24bf);
    });

    it('should have a size', () => assert.equal(uint32be.size, 4));

    it('should encode', function () {
      const buffer = new Uint8Array(uint32be.size);
      global.encode_stream = new EncodeStream(buffer);
      uint32be.encode(0xffab24bf);
      assert.deepEqual(buffer, new Uint8Array([0xff, 0xab, 0x24, 0xbf]));
    });
  });

  describe('uint32le', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0xbf, 0x24, 0xab, 0xff]));
      assert.equal(uint32le.decode(), 0xffab24bf);
    });

    it('should have a size', () => assert.equal(uint32le.size, 4));

    it('should encode', function () {
      const buffer = new Uint8Array(uint32le.size);
      global.encode_stream = new EncodeStream(buffer);
      uint32le.encode(0xffab24bf);
      assert.deepEqual(buffer, new Uint8Array([0xbf, 0x24, 0xab, 0xff]));
    });
  });

  describe('int8', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0x7f, 0xff]));
      assert.equal(int8.decode(), 127);
      assert.equal(int8.decode(), -1);
    });

    it('should have a size', () => assert.equal(int8.size, 1));

    it('should encode', function () {
      const buffer = new Uint8Array(int8.size);
      global.encode_stream = new EncodeStream(buffer);
      int8.encode(127);
      assert.deepEqual(buffer, new Uint8Array([0x7f]));
    });
    it('should encode', function () {
      const buffer = new Uint8Array(int8.size);
      global.encode_stream = new EncodeStream(buffer);
      int8.encode(-1);
      assert.deepEqual(buffer, new Uint8Array([0xff]));
    });
  });

  describe('int16', () =>
    it('is an alias for int16be', () => assert.deepEqual(int16, int16be))
  );

  describe('int16be', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0xff, 0xab]));
      assert.equal(int16be.decode(), -85);
    });

    it('should have a size', () => assert.equal(int16be.size, 2));

    it('should encode', function () {
      const buffer = new Uint8Array(int16be.size);
      global.encode_stream = new EncodeStream(buffer);
      int16be.encode(-85);
      assert.deepEqual(buffer, new Uint8Array([0xff, 0xab]));
    });
  });

  describe('int16le', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0xab, 0xff]));
      assert.equal(int16le.decode(), -85);
    });

    it('should have a size', () => assert.equal(int16le.size, 2));

    it('should encode', function () {
      const buffer = new Uint8Array(int16le.size);
      global.encode_stream = new EncodeStream(buffer);
      int16le.encode(-85);
      assert.deepEqual(buffer, new Uint8Array([0xab, 0xff]));
    });
  });

  describe('int24', () =>
    it('is an alias for int24be', () => assert.deepEqual(int24, int24be))
  );

  describe('int24be', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0xff, 0xab, 0x24]));
      assert.equal(int24be.decode(), -21724);
    });

    it('should have a size', () => assert.equal(int24be.size, 3));

    it('should encode', function () {
      const buffer = new Uint8Array(int24be.size);
      global.encode_stream = new EncodeStream(buffer);
      int24be.encode(-21724);
      assert.deepEqual(buffer, new Uint8Array([0xff, 0xab, 0x24]));
    });
  });

  describe('int24le', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0x24, 0xab, 0xff]));
      assert.equal(int24le.decode(), -21724);
    });

    it('should have a size', () => assert.equal(int24le.size, 3));

    it('should encode', function () {
      const buffer = new Uint8Array(int24le.size);
      global.encode_stream = new EncodeStream(buffer);
      int24le.encode(-21724);
      assert.deepEqual(buffer, new Uint8Array([0x24, 0xab, 0xff]));
    });
  });

  describe('int32', () =>
    it('is an alias for int32be', () => assert.deepEqual(int32, int32be))
  );

  describe('int32be', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0xff, 0xab, 0x24, 0xbf]));
      assert.equal(int32be.decode(), -5561153);
    });

    it('should have a size', () => assert.equal(int32be.size, 4));

    it('should encode', function () {
      const buffer = new Uint8Array(int32be.size);
      global.encode_stream = new EncodeStream(buffer);
      int32be.encode(-5561153);
      assert.deepEqual(buffer, new Uint8Array([0xff, 0xab, 0x24, 0xbf]));
    });
  });

  describe('int32le', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0xbf, 0x24, 0xab, 0xff]));
      assert.equal(int32le.decode(), -5561153);
    });

    it('should have a size', () => assert.equal(int32le.size, 4));

    it('should encode', function () {
      const buffer = new Uint8Array(int32le.size);
      global.encode_stream = new EncodeStream(buffer);
      int32le.encode(-5561153);
      assert.deepEqual(buffer, new Uint8Array([0xbf, 0x24, 0xab, 0xff]));
    });
  });

  describe('float', () =>
    it('is an alias for floatbe', () => assert.deepEqual(float, floatbe))
  );

  describe('floatbe', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0x43, 0x7a, 0x8c, 0xcd]));
      const value = floatbe.decode();
      assert(value >= 250.55 - 0.005);
      assert(value <= 250.55 + 0.005);
    });

    it('should have a size', () => assert.equal(floatbe.size, 4));

    it('should encode', function () {
      const buffer = new Uint8Array(floatbe.size);
      global.encode_stream = new EncodeStream(buffer);
      floatbe.encode(250.55);
      assert.deepEqual(buffer, new Uint8Array([0x43, 0x7a, 0x8c, 0xcd]));
    });
  });

  describe('floatle', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0xcd, 0x8c, 0x7a, 0x43]));
      const value = floatle.decode();
      assert(value >= 250.55 - 0.005);
      assert(value <= 250.55 + 0.005);
    });

    it('should have a size', () => assert.equal(floatle.size, 4));

    it('should encode', function () {
      const buffer = new Uint8Array(floatle.size);
      global.encode_stream = new EncodeStream(buffer);
      floatle.encode(250.55);
      assert.deepEqual(buffer, new Uint8Array([0xcd, 0x8c, 0x7a, 0x43]));
    });
  });

  describe('double', () =>
    it('is an alias for doublebe', () => assert.deepEqual(double, doublebe))
  );

  describe('doublebe', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0x40, 0x93, 0x4a, 0x3d, 0x70, 0xa3, 0xd7, 0x0a]));
      const value = doublebe.decode();
      assert(value >= 1234.56 - 0.005);
      assert(value <= 1234.56 + 0.005);
    });

    it('should have a size', () => assert.equal(doublebe.size, 8));

    it('should encode', function () {
      const buffer = new Uint8Array(doublebe.size);
      global.encode_stream = new EncodeStream(buffer);
      doublebe.encode(1234.56);
      assert.deepEqual(buffer, new Uint8Array([0x40, 0x93, 0x4a, 0x3d, 0x70, 0xa3, 0xd7, 0x0a]));
    });
  });

  describe('doublele', function () {
    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([0x0a, 0xd7, 0xa3, 0x70, 0x3d, 0x4a, 0x93, 0x40]));
      const value = doublele.decode();
      assert(value >= 1234.56 - 0.005);
      assert(value <= 1234.56 + 0.005);
    });

    it('should have a size', () => assert.equal(doublele.size, 8));

    it('should encode', function () {
      const buffer = new Uint8Array(doublele.size);
      global.encode_stream = new EncodeStream(buffer);
      doublele.encode(1234.56);
      assert.deepEqual(buffer, new Uint8Array([0x0a, 0xd7, 0xa3, 0x70, 0x3d, 0x4a, 0x93, 0x40]));
    });
  });

  // describe('fixed16', () =>
  //   it('is an alias for fixed16be', () => assert.deepEqual(fixed16, fixed16be))
  // );

  // describe('fixed16be', function () {
  //   it('should decode', function () {
  //     const value = fixed16be.fromBuffer(new Uint8Array([0x19, 0x57]));
  //     assert(value >= 25.34 - 0.005);
  //     assert(value <= 25.34 + 0.005);
  //   });

  //   it('should have a size', () => assert.equal(fixed16be.size(), 2));

  //   it('should encode', function () {
  //     assert.deepEqual(fixed16be.toBuffer(25.34), new Uint8Array([0x19, 0x57]));
  //   });
  // });

  // describe('fixed16le', function () {
  //   it('should decode', function () {
  //     const value = fixed16le.fromBuffer(new Uint8Array([0x57, 0x19]));
  //     assert(value >= 25.34 - 0.005);
  //     assert(value <= 25.34 + 0.005);
  //   });

  //   it('should have a size', () => assert.equal(fixed16le.size(), 2));

  //   it('should encode', function () {
  //     assert.deepEqual(fixed16le.toBuffer(25.34), new Uint8Array([0x57, 0x19]));
  //   });
  // });

  // describe('fixed32', () =>
  //   it('is an alias for fixed32be', () => assert.deepEqual(fixed32, fixed32be))
  // );

  // describe('fixed32be', function () {
  //   it('should decode', function () {
  //     const value = fixed32be.fromBuffer(new Uint8Array([0x00, 0xfa, 0x8c, 0xcc]));
  //     assert(value >= 250.55 - 0.005);
  //     assert(value <= 250.55 + 0.005);
  //   });

  //   it('should have a size', () => assert.equal(fixed32be.size(), 4));

  //   it('should encode', function () {
  //     assert.deepEqual(fixed32be.toBuffer(250.55), new Uint8Array([0x00, 0xfa, 0x8c, 0xcc]));
  //   });
  // });

  // describe('fixed32le', function () {
  //   it('should decode', function () {
  //     const value = fixed32le.fromBuffer(new Uint8Array([0xcc, 0x8c, 0xfa, 0x00]));
  //     assert(value >= 250.55 - 0.005);
  //     assert(value <= 250.55 + 0.005);
  //   });

  //   it('should have a size', () => assert.equal(fixed32le.size(), 4));

  //   it('should encode', function () {
  //     assert.deepEqual(fixed32le.toBuffer(250.55), new Uint8Array([0xcc, 0x8c, 0xfa, 0x00]));
  //   });
  // });
});
