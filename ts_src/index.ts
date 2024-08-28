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
  if (offset + 1 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  const buf = Buffer.from(buffer);
  return buf.readUInt8(offset);
}

export function readUInt16(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): number {
  if (offset + 2 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.from(buffer);

  if (littleEndian === "LE") {
    return buf.readUInt16LE(offset);
  } else {
    return buf.readUInt16BE(offset);
  }
}

export function readUInt32(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): number {
  if (offset + 4 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.from(buffer);

  if (littleEndian === "LE") {
    return buf.readUInt32LE(offset);
  } else {
    return buf.readUInt32BE(offset);
  }
}

export function readUInt64(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): bigint {
  if (offset + 8 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.from(buffer);

  if (littleEndian === "LE") {
    return buf.readBigUInt64LE(offset);
  } else {
    return buf.readBigUInt64BE(offset);
  }
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

  if(value > 0x7fffffffffffffffn || value < -0x8000000000000000n) {
    throw new Error(`The value of "value" is out of range. It must be >= ${-0x8000000000000000n} and <= ${0x7fffffffffffffffn}. Received ${value}`);
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
  if (offset + 1 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  const buf = Buffer.from(buffer);
  return buf.readInt8(offset);
}

export function readInt16(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): number {
  if (offset + 2 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  if (littleEndian === "LE") {
    return Buffer.from(buffer).readInt16LE(offset);
  } else {
    return Buffer.from(buffer).readInt16BE(offset);
  }
}

export function readInt32(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): number {
  if (offset + 4 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  if (littleEndian === "LE") {
    return Buffer.from(buffer).readInt32LE(offset);
  } else {
    return Buffer.from(buffer).readInt32BE(offset);
  }
}

export function readInt64(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): bigint {
  if (offset + 8 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  if (littleEndian === "LE") {
    return Buffer.from(buffer).readBigInt64LE(offset);
  } else {
    return Buffer.from(buffer).readBigInt64BE(offset);
  }
}
