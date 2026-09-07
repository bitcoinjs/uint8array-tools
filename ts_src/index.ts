export function toUtf8(bytes: Uint8Array): string {
  return Buffer.from(bytes || []).toString();
}

export function fromUtf8(s: string): Uint8Array {
  return Uint8Array.from(Buffer.from(s || "", "utf8"));
}

export function concat(arrays: Uint8Array[]): Uint8Array {
  return Uint8Array.from(Buffer.concat(arrays));
}

export function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes || []).toString("hex");
}

export function fromHex(hexString: string): Uint8Array {
  return Uint8Array.from(Buffer.from(hexString || "", "hex"));
}

export function toBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

export function fromBase64(base64: string): Uint8Array {
  return Uint8Array.from(Buffer.from(base64 || "", "base64"));
}

export type CompareResult = -1 | 0 | 1;
export function compare(v1: Uint8Array, v2: Uint8Array): CompareResult {
  return Buffer.from(v1).compare(Buffer.from(v2)) as CompareResult;
}

export type endian = "LE" | "BE" | "le" | "be";

function checkReadOffset(
  buffer: Uint8Array,
  offset: number,
  byteLength: number
): void {
  // Direct Uint8Array indexing does not validate these values, while Node.js
  // Buffer throws.
  if (
    !Number.isInteger(offset) ||
    !Number.isInteger(byteLength) ||
    offset < 0 ||
    byteLength < 0 ||
    offset + byteLength > buffer.length
  ) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
}

export function writeUInt8(
  buffer: Uint8Array,
  offset: number,
  value: number
): number {
  if (offset + 1 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  const buf = Buffer.alloc(1);
  buf.writeUInt8(value, 0);
  buffer.set(Uint8Array.from(buf), offset);

  return offset + 1;
}

export function writeUInt16(
  buffer: Uint8Array,
  offset: number,
  value: number,
  littleEndian: endian
): number {
  if (offset + 2 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.alloc(2);

  if (littleEndian === "LE") {
    buf.writeUInt16LE(value, 0);
  } else {
    buf.writeUInt16BE(value, 0);
  }
  buffer.set(Uint8Array.from(buf), offset);

  return offset + 2;
}

export function writeUInt32(
  buffer: Uint8Array,
  offset: number,
  value: number,
  littleEndian: endian
): number {
  if (offset + 4 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.alloc(4);

  if (littleEndian === "LE") {
    buf.writeUInt32LE(value, 0);
  } else {
    buf.writeUInt32BE(value, 0);
  }
  buffer.set(Uint8Array.from(buf), offset);

  return offset + 4;
}

export function writeUInt64(
  buffer: Uint8Array,
  offset: number,
  value: bigint,
  littleEndian: endian
): number {
  if (offset + 8 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.alloc(8);

  if (value > 0xffffffffffffffffn) {
    throw new Error(
      `The value of "value" is out of range. It must be >= 0 and <= ${0xffffffffffffffffn}. Received ${value}`
    );
  }

  if (littleEndian === "LE") {
    buf.writeBigUInt64LE(value, 0);
  } else {
    buf.writeBigUInt64BE(value, 0);
  }
  buffer.set(Uint8Array.from(buf), offset);

  return offset + 8;
}

export function readUInt8(buffer: Uint8Array, offset: number): number {
  checkReadOffset(buffer, offset, 1);

  return buffer[offset];
}

export function readUInt16(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): number {
  checkReadOffset(buffer, offset, 2);

  littleEndian = littleEndian.toUpperCase() as endian;

  // Match Node.js Buffer's implementation by expressing each byte's
  // positional value.
  return littleEndian === "LE"
    ? buffer[offset] + buffer[offset + 1] * 2 ** 8
    : buffer[offset] * 2 ** 8 + buffer[offset + 1];
}

export function readUInt32(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): number {
  checkReadOffset(buffer, offset, 4);

  littleEndian = littleEndian.toUpperCase() as endian;

  // Multiplication preserves the unsigned range; bitwise operators coerce
  // values to signed int32.
  return littleEndian === "LE"
    ? buffer[offset] +
        buffer[offset + 1] * 2 ** 8 +
        buffer[offset + 2] * 2 ** 16 +
        buffer[offset + 3] * 2 ** 24
    : buffer[offset] * 2 ** 24 +
        buffer[offset + 1] * 2 ** 16 +
        buffer[offset + 2] * 2 ** 8 +
        buffer[offset + 3];
}

export function readUInt64(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): bigint {
  checkReadOffset(buffer, offset, 8);

  littleEndian = littleEndian.toUpperCase() as endian;

  let lo: number;
  let hi: number;

  // As in Node.js Buffer's implementation, compose exact 32-bit halves before
  // converting to BigInt. This needs only two BigInt conversions instead of one
  // conversion and shift per byte.
  if (littleEndian === "LE") {
    lo =
      buffer[offset] +
      buffer[offset + 1] * 2 ** 8 +
      buffer[offset + 2] * 2 ** 16 +
      buffer[offset + 3] * 2 ** 24;
    hi =
      buffer[offset + 4] +
      buffer[offset + 5] * 2 ** 8 +
      buffer[offset + 6] * 2 ** 16 +
      buffer[offset + 7] * 2 ** 24;
  } else {
    hi =
      buffer[offset] * 2 ** 24 +
      buffer[offset + 1] * 2 ** 16 +
      buffer[offset + 2] * 2 ** 8 +
      buffer[offset + 3];
    lo =
      buffer[offset + 4] * 2 ** 24 +
      buffer[offset + 5] * 2 ** 16 +
      buffer[offset + 6] * 2 ** 8 +
      buffer[offset + 7];
  }

  return (BigInt(hi) << 32n) + BigInt(lo);
}

export function writeInt8(
  buffer: Uint8Array,
  offset: number,
  value: number
): number {
  if (offset + 1 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  const buf = Buffer.alloc(1);
  buf.writeInt8(value, 0);
  buffer.set(Uint8Array.from(buf), offset);

  return offset + 1;
}

export function writeInt16(
  buffer: Uint8Array,
  offset: number,
  value: number,
  littleEndian: endian
): number {
  if (offset + 2 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.alloc(2);
  if (littleEndian === "LE") {
    buf.writeInt16LE(value, 0);
  } else {
    buf.writeInt16BE(value, 0);
  }
  buffer.set(Uint8Array.from(buf), offset);
  return offset + 2;
}

export function writeInt32(
  buffer: Uint8Array,
  offset: number,
  value: number,
  littleEndian: endian
): number {
  if (offset + 4 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.alloc(4);
  if (littleEndian === "LE") {
    buf.writeInt32LE(value, 0);
  } else {
    buf.writeInt32BE(value, 0);
  }
  buffer.set(Uint8Array.from(buf), offset);
  return offset + 4;
}

export function writeInt64(
  buffer: Uint8Array,
  offset: number,
  value: bigint,
  littleEndian: endian
): number {
  if (offset + 8 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  if (value > 0x7fffffffffffffffn || value < -0x8000000000000000n) {
    throw new Error(
      `The value of "value" is out of range. It must be >= ${-0x8000000000000000n} and <= ${0x7fffffffffffffffn}. Received ${value}`
    );
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.alloc(8);
  if (littleEndian === "LE") {
    buf.writeBigInt64LE(value, 0);
  } else {
    buf.writeBigInt64BE(value, 0);
  }
  buffer.set(Uint8Array.from(buf), offset);
  return offset + 8;
}

export function readInt8(buffer: Uint8Array, offset: number): number {
  checkReadOffset(buffer, offset, 1);

  const val = buffer[offset];

  // Convert from two's complement explicitly instead of using Node.js
  // Buffer's branchless sign-extension expression.
  return val < 0x80 ? val : val - 0x100;
}

export function readInt16(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): number {
  checkReadOffset(buffer, offset, 2);

  littleEndian = littleEndian.toUpperCase() as endian;

  const val =
    littleEndian === "LE"
      ? buffer[offset] + buffer[offset + 1] * 2 ** 8
      : buffer[offset] * 2 ** 8 + buffer[offset + 1];

  // Convert from two's complement explicitly instead of using Node.js
  // Buffer's branchless sign-extension expression.
  return val < 0x8000 ? val : val - 0x10000;
}

export function readInt32(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): number {
  checkReadOffset(buffer, offset, 4);

  littleEndian = littleEndian.toUpperCase() as endian;

  // Node.js Buffer's implementation shifts only the most-significant byte so
  // JavaScript sign-extends it.
  return littleEndian === "LE"
    ? buffer[offset] +
        buffer[offset + 1] * 2 ** 8 +
        buffer[offset + 2] * 2 ** 16 +
        (buffer[offset + 3] << 24)
    : (buffer[offset] << 24) +
        buffer[offset + 1] * 2 ** 16 +
        buffer[offset + 2] * 2 ** 8 +
        buffer[offset + 3];
}

export function readInt64(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): bigint {
  checkReadOffset(buffer, offset, 8);

  littleEndian = littleEndian.toUpperCase() as endian;

  let lo: number;
  let hi: number;

  // Node.js Buffer's implementation makes hi a signed int32. Combining signed
  // hi with unsigned lo produces the 64-bit two's-complement value without an
  // extra BigInt correction.
  if (littleEndian === "LE") {
    lo =
      buffer[offset] +
      buffer[offset + 1] * 2 ** 8 +
      buffer[offset + 2] * 2 ** 16 +
      buffer[offset + 3] * 2 ** 24;
    hi =
      buffer[offset + 4] +
      buffer[offset + 5] * 2 ** 8 +
      buffer[offset + 6] * 2 ** 16 +
      (buffer[offset + 7] << 24);
  } else {
    hi =
      (buffer[offset] << 24) +
      buffer[offset + 1] * 2 ** 16 +
      buffer[offset + 2] * 2 ** 8 +
      buffer[offset + 3];
    lo =
      buffer[offset + 4] * 2 ** 24 +
      buffer[offset + 5] * 2 ** 16 +
      buffer[offset + 6] * 2 ** 8 +
      buffer[offset + 7];
  }

  return (BigInt(hi) << 32n) + BigInt(lo);
}
