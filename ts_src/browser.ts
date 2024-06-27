const HEX_STRINGS = "0123456789abcdefABCDEF";
const HEX_CODES: number[] = HEX_STRINGS.split("").map((c) => c.codePointAt(0)!);
const HEX_CODEPOINTS: (number | undefined)[] = Array(256)
  .fill(true)
  .map((_, i) => {
    const s = String.fromCodePoint(i);
    const index = HEX_STRINGS.indexOf(s);
    // ABCDEF will use 10 - 15
    return index < 0 ? undefined : index < 16 ? index : index - 6;
  });
const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

export function toUtf8(bytes: Uint8Array): string {
  return DECODER.decode(bytes);
}

// There are two implementations.
// One optimizes for length of the bytes, and uses TextDecoder.
// One optimizes for iteration count, and appends strings.
// This removes the overhead of TextDecoder.
export function toHex(bytes: Uint8Array): string {
  const b = bytes || new Uint8Array();
  return b.length > 512 ? _toHexLengthPerf(b) : _toHexIterPerf(b);
}
function _toHexIterPerf(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; ++i) {
    s += HEX_STRINGS[HEX_CODEPOINTS[HEX_CODES[bytes[i] >> 4]]!];
    s += HEX_STRINGS[HEX_CODEPOINTS[HEX_CODES[bytes[i] & 15]]!];
  }
  return s;
}
function _toHexLengthPerf(bytes: Uint8Array): string {
  const hexBytes = new Uint8Array(bytes.length * 2);
  for (let i = 0; i < bytes.length; ++i) {
    hexBytes[i * 2] = HEX_CODES[bytes[i] >> 4];
    hexBytes[i * 2 + 1] = HEX_CODES[bytes[i] & 15];
  }
  return DECODER.decode(hexBytes);
}

// Mimics Buffer.from(x, 'hex') logic
// Stops on first non-hex string and returns
// https://github.com/nodejs/node/blob/v14.18.1/src/string_bytes.cc#L246-L261
export function fromHex(hexString: string): Uint8Array {
  const hexBytes = ENCODER.encode(hexString || "");
  const resultBytes = new Uint8Array(Math.floor(hexBytes.length / 2));
  let i: number;
  for (i = 0; i < resultBytes.length; i++) {
    const a = HEX_CODEPOINTS[hexBytes[i * 2]];
    const b = HEX_CODEPOINTS[hexBytes[i * 2 + 1]];
    if (a === undefined || b === undefined) {
      break;
    }
    resultBytes[i] = (a << 4) | b;
  }
  return i === resultBytes.length ? resultBytes : resultBytes.slice(0, i);
}

export type CompareResult = -1 | 0 | 1;
// Same behavior as Buffer.compare()
export function compare(v1: Uint8Array, v2: Uint8Array): CompareResult {
  const minLength = Math.min(v1.length, v2.length);
  for (let i = 0; i < minLength; ++i) {
    if (v1[i] !== v2[i]) {
      return v1[i] < v2[i] ? -1 : 1;
    }
  }
  return v1.length === v2.length ? 0 : v1.length > v2.length ? 1 : -1;
}

export type endian = "LE" | "BE" | "le" | "be";

export function writeUInt8(
  buffer: Uint8Array,
  offset: number,
  value: bigint
): void {
  if (offset + 1 > buffer.length) {
    throw new Error(" Offset is outside the bounds of Uint8Array");
  }

  value = value & 0xffn;
  buffer[offset] = Number(value);
}

export function writeUInt16(
  buffer: Uint8Array,
  offset: number,
  value: bigint,
  littleEndian: endian
): void {
  if (offset + 2 > buffer.length) {
    throw new Error(" Offset is outside the bounds of Uint8Array");
  }
  littleEndian = littleEndian.toUpperCase() as endian;
  value = value & 0xffffn;

  if (littleEndian === "LE") {
    buffer[offset] = Number(value & 0xffn);
    buffer[offset + 1] = Number((value >> 8n) & 0xffn);
  } else {
    buffer[offset] = Number((value >> 8n) & 0xffn);
    buffer[offset + 1] = Number(value & 0xffn);
  }
}

export function writeUInt32(
  buffer: Uint8Array,
  offset: number,
  value: bigint,
  littleEndian: endian
): void {
  if (offset + 4 > buffer.length) {
    throw new Error(" Offset is outside the bounds of Uint8Array");
  }
  littleEndian = littleEndian.toUpperCase() as endian;
  value = value & 0xffffffffn;

  if (littleEndian === "LE") {
    buffer[offset] = Number(value & 0xffn);
    buffer[offset + 1] = Number((value >> 8n) & 0xffn);
    buffer[offset + 2] = Number((value >> 16n) & 0xffn);
    buffer[offset + 3] = Number((value >> 24n) & 0xffn);
  } else {
    buffer[offset] = Number((value >> 24n) & 0xffn);
    buffer[offset + 1] = Number((value >> 16n) & 0xffn);
    buffer[offset + 2] = Number((value >> 8n) & 0xffn);
    buffer[offset + 3] = Number(value & 0xffn);
  }
}

export function writeUInt64(
  buffer: Uint8Array,
  offset: number,
  value: bigint,
  littleEndian: endian
): void {
  if (offset + 8 > buffer.length) {
    throw new Error(" Offset is outside the bounds of Uint8Array");
  }
  littleEndian = littleEndian.toUpperCase() as endian;
  value = value & 0xffffffffffffffffn;

  if (littleEndian === "LE") {
    buffer[offset] = Number(value & 0xffn);
    buffer[offset + 1] = Number((value >> 8n) & 0xffn);
    buffer[offset + 2] = Number((value >> 16n) & 0xffn);
    buffer[offset + 3] = Number((value >> 24n) & 0xffn);
    buffer[offset + 4] = Number((value >> 32n) & 0xffn);
    buffer[offset + 5] = Number((value >> 40n) & 0xffn);
    buffer[offset + 6] = Number((value >> 48n) & 0xffn);
    buffer[offset + 7] = Number((value >> 56n) & 0xffn);
  } else {
    buffer[offset] = Number((value >> 56n) & 0xffn);
    buffer[offset + 1] = Number((value >> 48n) & 0xffn);
    buffer[offset + 2] = Number((value >> 40n) & 0xffn);
    buffer[offset + 3] = Number((value >> 32n) & 0xffn);
    buffer[offset + 4] = Number((value >> 24n) & 0xffn);
    buffer[offset + 5] = Number((value >> 16n) & 0xffn);
    buffer[offset + 6] = Number((value >> 8n) & 0xffn);
    buffer[offset + 7] = Number(value & 0xffn);
  }
}
