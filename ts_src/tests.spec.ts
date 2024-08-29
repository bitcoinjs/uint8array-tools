import * as browser from "./browser";
import * as node from "./index";

const modules = [
  ["browser", browser],
  ["node", node],
] as [string, typeof browser][];

const f = (d: number[]) => Uint8Array.from(d);
const hex = "ff00";
const bytes = f([0xff, 0x00]);
const bytes2 = f([0xff, 0x01]);
const bytes2Larger = f([0xff, 0x01, 0x00]);
const bytes2LargerLeft = f([0x00, 0xff, 0x01]);
const longBytes = new Uint8Array(513).fill(0xfa);
const longHex = "fa".repeat(513);
const bytes3 = f([0x21, 0x7e]);
const utf8 = "!~";
const longBytes2 = new Uint8Array(513).fill(0x61);
const longUtf8 = "a".repeat(513);
const testBytes = f([
  227, 129, 147, 227, 130, 147, 227, 129, 171, 227, 129, 161, 227, 129, 175,
]);
const str = "こんにちは";

const brokenHexes = [
  [" ff00", f([]), "leading space"],
  ["ffa bcdef", f([0xff]), "middle space"],
  ["ffba34aQcdef", f([0xff, 0xba, 0x34]), "invalid char"],
  ["Qfba34abcdef", f([]), "invalid char"],
] as [string, Uint8Array, string][];

describe(`Uint8Array tools`, () => {
  for (const [name, tools] of modules) {
    describe(name, () => {
      it(`should parse hex with fromHex`, () => {
        expect(tools.fromHex(hex)).toEqual(bytes);
        expect((tools.fromHex as any)()).toEqual(f([]));
      });
      for (const [bhex, result, reason] of brokenHexes) {
        it(`should abort parsing hex ${bhex} because of ${reason}`, () => {
          expect(tools.fromHex(bhex)).toEqual(result);
        });
      }
      it(`should output hex with toHex`, () => {
        expect(tools.toHex(bytes)).toEqual(hex);
        expect(tools.toHex(longBytes)).toEqual(longHex);
        expect((tools.toHex as any)()).toEqual("");
      });
      it(`should output utf8 with toUtf8`, () => {
        expect(tools.toUtf8(bytes3)).toEqual(utf8);
        expect(tools.toUtf8(testBytes)).toEqual(str);
        expect(tools.toUtf8(longBytes2)).toEqual(longUtf8);
        expect((tools.toUtf8 as any)()).toEqual("");
      });
      it("should read utf8 with fromUtf8", () => {
        expect(tools.fromUtf8(utf8)).toEqual(bytes3);
        expect(tools.fromUtf8(str)).toEqual(testBytes);
        expect(tools.fromUtf8(longUtf8)).toEqual(longBytes2);
        expect((tools.fromUtf8 as any)()).toEqual(f([]));
      });
      it(`should compare Uint8Arrays`, () => {
        expect(tools.compare(bytes, bytes2)).toBe(-1);
        expect(tools.compare(bytes, bytes)).toBe(0);
        expect(tools.compare(bytes2, bytes)).toBe(1);
        expect(tools.compare(bytes2, bytes2Larger)).toBe(-1);
        expect(tools.compare(bytes2Larger, bytes2)).toBe(1);
        expect(tools.compare(bytes2, bytes2LargerLeft)).toBe(1);
        expect(tools.compare(bytes2LargerLeft, bytes2)).toBe(-1);
      });
      it("should concat Uint8Arrays", () => {
        const fixtures = [
          [new Uint8Array([]), new Uint8Array([])],
          [new Uint8Array([1]), new Uint8Array([1])],
          [new Uint8Array([])],
          [new Uint8Array()],
          [...new Array(1000)].map(() => new Uint8Array([123])),
        ];

        for (const fixture of fixtures) {
          expect(new Uint8Array(Buffer.concat(fixture))).toEqual(
            tools.concat(fixture)
          );
        }
      });
      it("should read from base64", () => {
        const fixtures = [
          Buffer.from("").toString("base64"),
          Buffer.from("a").toString("base64"),
          Buffer.from("ab").toString("base64"),
          Buffer.from("abc").toString("base64"),
          Buffer.from("abcd").toString("base64"),
          Buffer.from("abcde").toString("base64"),
          Buffer.from("abcdef").toString("base64"),
          Buffer.from("abcdefg").toString("base64"),
          Buffer.from("abcdefgh").toString("base64"),
          Buffer.from("abcdefghi").toString("base64"),
          Buffer.from("abcdefghij").toString("base64"),
          Buffer.from("abcdefghijk").toString("base64"),
          Buffer.from("abcdefghijkl").toString("base64"),
          Buffer.from("abcdefghijklm").toString("base64"),
          Buffer.from("abcdefghijklmn").toString("base64"),
        ];

        for (const fixture of fixtures) {
          expect(tools.fromBase64(fixture)).toEqual(
            Uint8Array.from(Buffer.from(fixture, "base64"))
          );
        }
      });

      it("should write to base64", () => {
        const fixtures = [
          Buffer.from("").toString("base64"),
          Buffer.from("a").toString("base64"),
          Buffer.from("ab").toString("base64"),
          Buffer.from("abc").toString("base64"),
          Buffer.from("abcd").toString("base64"),
          Buffer.from("abcde").toString("base64"),
          Buffer.from("abcdef").toString("base64"),
          Buffer.from("abcdefg").toString("base64"),
          Buffer.from("abcdefgh").toString("base64"),
          Buffer.from("abcdefghi").toString("base64"),
          Buffer.from("abcdefghij").toString("base64"),
          Buffer.from("abcdefghijk").toString("base64"),
          Buffer.from("abcdefghijkl").toString("base64"),
          Buffer.from("abcdefghijklm").toString("base64"),
          Buffer.from("abcdefghijklmn").toString("base64"),
        ];

        for (const fixture of fixtures) {
          expect(tools.toBase64(tools.fromBase64(fixture))).toEqual(fixture);
        }
      });

      it("should writeUint8", () => {
        const hexs = ["03", "fd"];

        for (const hex of hexs) {
          const actualArray = new Uint8Array(1);
          const expectedArray = Buffer.alloc(1);

          tools.writeUInt8(actualArray, 0, Number.parseInt(hex, 16));
          expectedArray.writeUInt8(Number.parseInt(hex, 16), 0);

          expect(expectedArray.toString("hex")).toEqual(
            tools.toHex(actualArray)
          );
        }
      });

      it("should writeUint16", () => {
        const hexs = ["0300", "0003", "fdff", "fffd"];

        for (const hex of hexs) {
          const actualArray = new Uint8Array(2);
          const expectedArray = Buffer.alloc(2);

          for (const endian of ["BE", "LE"]) {
            tools.writeUInt16(
              actualArray,
              0,
              Number.parseInt(hex, 16),
              endian as browser.endian
            );
            expectedArray[
              ("writeUInt16" + endian) as "writeUInt16LE" | "writeUInt16BE"
            ](Number.parseInt(hex, 16), 0);

            expect(expectedArray.toString("hex")).toEqual(
              tools.toHex(actualArray)
            );
          }
        }
      });

      it("should writeUint32", () => {
        const hexs = ["03000000", "00000003", "fdffffff", "fffffffd"];

        for (const hex of hexs) {
          const actualArray = new Uint8Array(4);
          const expectedArray = Buffer.alloc(4);

          for (const endian of ["BE", "LE"]) {
            tools.writeUInt32(
              actualArray,
              0,
              Number.parseInt(hex, 16),
              endian as browser.endian
            );
            expectedArray[
              ("writeUInt32" + endian) as "writeUInt32LE" | "writeUInt32BE"
            ](Number.parseInt(hex, 16), 0);

            expect(expectedArray.toString("hex")).toEqual(
              tools.toHex(actualArray)
            );
          }
        }
      });

      it("should writeUint64", () => {
        const hexs = [
          "0300000000000000",
          "0000000000000003",
          "fdffffffffffffff",
          "fffffffffffffffd",
        ];

        for (const hex of hexs) {
          const actualArray = new Uint8Array(8);
          const expectedArray = Buffer.alloc(8);

          for (const endian of ["BE", "LE"]) {
            tools.writeUInt64(
              actualArray,
              0,
              BigInt("0x" + hex),
              endian as browser.endian
            );
            expectedArray[
              ("writeBigUInt64" + endian) as
                | "writeBigUInt64LE"
                | "writeBigUInt64BE"
            ](BigInt("0x" + hex), 0);

            expect(expectedArray.toString("hex")).toEqual(
              tools.toHex(actualArray)
            );
          }
        }
      });

      it("should throw an error when offset is out of bounds", () => {
        const bytes = new Uint8Array(100);

        expect(() =>
          tools.writeUInt8(bytes, bytes.length - 1 + 1, 1)
        ).toThrowError(new Error("Offset is outside the bounds of Uint8Array"));

        expect(() =>
          tools.writeUInt16(bytes, bytes.length - 2 + 1, 1, "LE")
        ).toThrowError(new Error("Offset is outside the bounds of Uint8Array"));

        expect(() =>
          tools.writeUInt32(bytes, bytes.length - 4 + 1, 1, "LE")
        ).toThrowError(new Error("Offset is outside the bounds of Uint8Array"));

        expect(() =>
          tools.writeUInt64(bytes, bytes.length - 8 + 1, 1n, "LE")
        ).toThrowError(new Error("Offset is outside the bounds of Uint8Array"));
      });

      it("should write at the correct offset", () => {
        const actualArray = new Uint8Array(100);
        const expectedArray = Buffer.alloc(100);
        let hex = "03";
        const offset = 50;

        tools.writeUInt8(actualArray, offset, Number.parseInt(hex, 16));
        expectedArray.writeUInt8(Number.parseInt(hex, 16), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));

        hex = "0300";

        tools.writeUInt16(actualArray, offset, Number.parseInt(hex, 16), "LE");
        expectedArray.writeUInt16LE(Number.parseInt(hex, 16), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));

        tools.writeUInt16(actualArray, offset, Number.parseInt(hex, 16), "BE");
        expectedArray.writeUInt16BE(Number.parseInt(hex, 16), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));

        hex = "03000000";

        tools.writeUInt32(actualArray, offset, Number.parseInt(hex, 16), "LE");
        expectedArray.writeUInt32LE(Number.parseInt(hex, 16), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));

        tools.writeUInt32(actualArray, offset, Number.parseInt(hex, 16), "BE");
        expectedArray.writeUInt32BE(Number.parseInt(hex, 16), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));

        hex = "0300000000000000";

        tools.writeUInt64(actualArray, offset, BigInt("0x" + hex), "LE");
        expectedArray.writeBigUInt64LE(BigInt("0x" + hex), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));

        tools.writeUInt64(actualArray, offset, BigInt("0x" + hex), "BE");
        expectedArray.writeBigUInt64BE(BigInt("0x" + hex), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));
      });
      it("should throw an error on overflow", () => {
        let bytes = new Uint8Array(1);

        let overflowVal = 0xffn + 1n;
        expect(() => tools.writeUInt8(bytes, 0, 0xff + 1)).toThrowError(
          `The value of "value" is out of range. It must be >= 0 and <= ${0xffn}. Received ${overflowVal}`
        );

        bytes = new Uint8Array(2);
        overflowVal = 0xffffn + 1n;

        expect(() =>
          tools.writeUInt16(bytes, 0, 0xffff + 1, "LE")
        ).toThrowError(
          `The value of "value" is out of range. It must be >= 0 and <= ${0xffffn}. Received ${overflowVal}`
        );

        bytes = new Uint8Array(4);
        overflowVal = 0xffffffffn + 1n;

        expect(() =>
          tools.writeUInt32(bytes, 0, 0xffffffff + 1, "LE")
        ).toThrowError(
          `The value of "value" is out of range. It must be >= 0 and <= ${0xffffffffn}. Received ${overflowVal}`
        );

        bytes = new Uint8Array(8);
        overflowVal = 0xffffffffffffffffn + 1n;

        expect(() =>
          tools.writeUInt64(bytes, 0, 0xffffffffffffffffn + 1n, "LE")
        ).toThrowError(
          `The value of "value" is out of range. It must be >= 0 and <= ${0xffffffffffffffffn.toString()}. Received ${overflowVal}`
        );
      });

      it("should read bytes at the correct offset", () => {
        const actualArray = new Uint8Array(200);
        const expectedArray = Buffer.alloc(200);

        let hex = "ff";
        tools.writeUInt8(actualArray, 0, Number.parseInt(hex, 16));
        expectedArray.writeUInt8(Number.parseInt(hex, 16), 0);

        expect(expectedArray.readUInt8(0)).toEqual(
          tools.readUInt8(actualArray, 0)
        );

        hex = "abcd";
        tools.writeUInt16(actualArray, 10, Number.parseInt(hex, 16), "LE");
        expectedArray.writeUInt16LE(Number.parseInt(hex, 16), 10);

        expect(expectedArray.readUInt16LE(10)).toEqual(
          tools.readUInt16(actualArray, 10, "LE")
        );

        tools.writeUInt16(actualArray, 20, Number.parseInt(hex, 16), "BE");
        expectedArray.writeUInt16BE(Number.parseInt(hex, 16), 20);

        expect(expectedArray.readUInt16BE(20)).toEqual(
          tools.readUInt16(actualArray, 20, "BE")
        );

        hex = "ffffabff";
        tools.writeUInt32(actualArray, 30, Number.parseInt(hex, 16), "LE");
        expectedArray.writeUInt32LE(Number.parseInt(hex, 16), 30);

        expect(expectedArray.readUInt32LE(30)).toEqual(
          tools.readUInt32(actualArray, 30, "LE")
        );

        tools.writeUInt32(actualArray, 50, Number.parseInt(hex, 16), "BE");
        expectedArray.writeUInt32BE(Number.parseInt(hex, 16), 50);

        expect(expectedArray.readUInt32BE(50)).toEqual(
          tools.readUInt32(actualArray, 50, "BE")
        );

        hex = "ffffffffffffabff";
        tools.writeUInt64(actualArray, 70, BigInt("0x" + hex), "LE");
        expectedArray.writeBigUInt64LE(BigInt("0x" + hex), 70);

        expect(expectedArray.readBigUInt64LE(70)).toEqual(
          tools.readUInt64(actualArray, 70, "LE")
        );

        tools.writeUInt64(actualArray, 110, BigInt("0x" + hex), "BE");
        expectedArray.writeBigUInt64BE(BigInt("0x" + hex), 110);

        expect(expectedArray.readBigUInt64BE(110)).toEqual(
          tools.readUInt64(actualArray, 110, "BE")
        );
      });

      it("should throw an error if the offset is out of bounds", () => {
        const arr = new Uint8Array(10);

        expect(() => tools.readUInt8(arr, 10)).toThrowError(
          new Error("Offset is outside the bounds of Uint8Array")
        );

        const fns = [tools.readUInt16, tools.readUInt32, tools.readUInt64];

        for (const fn of fns) {
          expect(() => fn(arr, 10, "LE")).toThrowError(
            new Error("Offset is outside the bounds of Uint8Array")
          );

          expect(() => fn(arr, 10, "BE")).toThrowError(
            new Error("Offset is outside the bounds of Uint8Array")
          );
        }
      });

      it("should be able to writeInt8", () => {
        const arr = new Uint8Array(1);
        const fixtures = [1, 0x7f, 0x0f, 0x1f, -0x80, -0x01, -0x0f, -0x1f];

        for (const fixture of fixtures) {
          const expected = Buffer.alloc(1);
          expected.writeInt8(fixture, 0);
          expect(tools.writeInt8(arr, 0, fixture)).toEqual(1);
          expect(arr).toEqual(Uint8Array.from(expected));
        }
      });

      it("should be able to readInt8", () => {
        const arr = new Uint8Array(1);
        const fixtures = [1, 0x7f, 0x0f, 0x1f, -0x80, -0x01, -0x0f, -0x1f];

        for (const fixture of fixtures) {
          tools.writeInt8(arr, 0, fixture);
          expect(tools.readInt8(arr, 0)).toEqual(fixture);
        }
      });

      it("should be able to writeInt16", () => {
        const arr = new Uint8Array(2);

        const fixtures = [
          1, 0x7fff, 0x00ff, 0x01ff, -0x8000, -0x01, -0x00ff, -0x01ff,
        ];
        
        const expected = Buffer.alloc(2);

        for (const fixture of fixtures) {
          expected.writeInt16LE(fixture, 0);
          expect(tools.writeInt16(arr, 0, fixture, "LE")).toEqual(2);
          expect(arr).toEqual(Uint8Array.from(expected));
        }

        for (const fixture of fixtures) {
          expected.writeInt16BE(fixture, 0);
          expect(tools.writeInt16(arr, 0, fixture, "BE")).toEqual(2);
          expect(arr).toEqual(Uint8Array.from(expected));
        }
      });

      it("should be able to readInt16", () => {
        const arr = new Uint8Array(2);
        const fixtures = [
          1, 0x7fff, 0x00ff, 0x01ff, -0x8000, -0x01, -0x00ff, -0x01ff,
        ];

        for (const fixture of fixtures) {
          tools.writeInt16(arr, 0, fixture, "LE");
          expect(tools.readInt16(arr, 0, "LE")).toEqual(fixture);
        }

        for (const fixture of fixtures) {
          tools.writeInt16(arr, 0, fixture, "BE");
          expect(tools.readInt16(arr, 0, "BE")).toEqual(fixture);
        }
      });

      it("should be able to writeInt32", () => {
        const arr = new Uint8Array(4);
        const fixtures = [
          1, 0x7fffffff, 0x0000ffff, 0x0001ffff, -0x80000000, -0x01,
          -0x0000ffff, -0x0001ffff,
        ];
        const expected = Buffer.alloc(4);

        for (const fixture of fixtures) {
          expected.writeInt32LE(fixture, 0);
          expect(tools.writeInt32(arr, 0, fixture, "LE")).toEqual(4);
          expect(arr).toEqual(Uint8Array.from(expected));
        }

        for (const fixture of fixtures) {
          expected.writeInt32BE(fixture, 0);
          expect(tools.writeInt32(arr, 0, fixture, "BE")).toEqual(4);
          expect(arr).toEqual(Uint8Array.from(expected));
        }
      });

      it("should be able to readInt32", () => {
        const arr = new Uint8Array(4);
        const fixtures = [
          1, 0x7fffffff, 0x0000ffff, 0x0001ffff, -0x80000000, -0x01,
          -0x0000ffff, -0x0001ffff,
        ];

        for (const fixture of fixtures) {
          tools.writeInt32(arr, 0, fixture, "LE");
          expect(tools.readInt32(arr, 0, "LE")).toEqual(fixture);
        }

        for (const fixture of fixtures) {
          tools.writeInt32(arr, 0, fixture, "BE");
          expect(tools.readInt32(arr, 0, "BE")).toEqual(fixture);
        }
      });

      it("should be able to writeInt64", () => {
        const arr = new Uint8Array(8);

        const fixtures = [
          1n,
          0x7fffffffffffffffn,
          0x00000000ffffffffn,
          0x00000001ffffffffn,
          -0x8000000000000000n,
          -0x01n,
          -0x00000000ffffffffn,
          -0x00000001ffffffffn,
        ];
        const expected = Buffer.alloc(8);

        for (const fixture of fixtures) {
          expected.writeBigInt64LE(fixture, 0);
          expect(tools.writeInt64(arr, 0, fixture, "LE")).toEqual(8);
          expect(arr).toEqual(Uint8Array.from(expected));
        }

        for (const fixture of fixtures) {
          expected.writeBigInt64BE(fixture, 0);
          expect(tools.writeInt64(arr, 0, fixture, "BE")).toEqual(8);
          expect(arr).toEqual(Uint8Array.from(expected));
        }
      });

      it("should be able to readInt64", () => {
        const arr = new Uint8Array(8);

        const fixtures = [
          1n,
          0x7fffffffffffffffn,
          0x00000000ffffffffn,
          0x00000001ffffffffn,
          -0x8000000000000000n,
          -0x01n,
          -0x00000000ffffffffn,
          -0x00000001ffffffffn,
        ];

        for (const fixture of fixtures) {
          tools.writeInt64(arr, 0, fixture, "LE");
          expect(tools.readInt64(arr, 0, "LE")).toEqual(fixture);
        }

        for (const fixture of fixtures) {
          tools.writeInt64(arr, 0, fixture, "BE");
          expect(tools.readInt64(arr, 0, "BE")).toEqual(fixture);
        }
      });

      it("signed integer functions should throw if the value is out of range", () => {
        const nums = [0, 1, 2, 3];

        for (let i = 0; i < nums.length; i++) {
          const bitLength = (1 << nums[i]) * 8;
          const fnName = "writeInt" + bitLength.toString();
          const rawLow = BigInt(-(2n ** BigInt(bitLength - 1)));
          const rawHigh = -rawLow - 1n;
          const rawHighValue = rawHigh + 1n;
          const rawLowValue = rawLow - 1n;

          const low = i === 3 ? rawLow : Number(rawLow);
          const high = i === 3 ? rawHigh : Number(rawHigh);
          const values = [
            i === 3 ? rawLowValue : Number(rawLowValue),
            i === 3 ? rawHighValue : Number(rawHighValue),
          ];

          for (const value of values) {
            for (const endian of ["BE", "LE"]) {
              expect(() =>
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tools[fnName](
                  new Uint8Array(bitLength / 8 + 1),
                  0,
                  value,
                  endian
                )
              ).toThrowError(
                new Error(
                  `The value of "value" is out of range. It must be >= ${low} and <= ${high}. Received ${value}`
                )
              );
            }
          }
        }
      });

      it("signed integer read-write functions should throw an error if the offset is out of bounds", () => {
        const operation = ["read", "write"];
        const nums = [0, 1, 2, 3];

        for (let i = 0; i < operation.length; i++) {
          for (let j = 0; j < nums.length; j++) {
            const fnName =
              operation[i] + "Int" + ((1 << nums[j]) * 8).toString();
            const val = j === 4 ? 1n : 1;
            for (const endian of ["BE", "LE"]) {
              expect(() =>
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tools[fnName](new Uint8Array(j + 1), val, j + 1, endian)
              ).toThrowError(
                new Error("Offset is outside the bounds of Uint8Array")
              );
            }
          }
        }
      });
    });
  }
});
