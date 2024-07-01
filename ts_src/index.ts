export function toUtf8(bytes: Uint8Array): string {
  return Buffer.from(bytes || []).toString();
}

export function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes || []).toString("hex");
}

export function fromHex(hexString: string): Uint8Array {
  return Uint8Array.from(Buffer.from(hexString || "", "hex"));
}

export type CompareResult = -1 | 0 | 1;
export function compare(v1: Uint8Array, v2: Uint8Array): CompareResult {
  return Buffer.from(v1).compare(Buffer.from(v2)) as CompareResult;
}

export type endian = "LE" | "BE" | "le" | "be";

export function writeUInt8(
  buffer: Uint8Array,
  offset: number,
  value: bigint
): void {
  if (offset + 1 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  const buf = Buffer.alloc(1);
  buf.writeUInt8(Number(value), 0);
  buffer.set(Uint8Array.from(buf), offset);
}

export function writeUInt16(
  buffer: Uint8Array,
  offset: number,
  value: bigint,
  littleEndian: endian
): void {
  if (offset + 2 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.alloc(2);

  if (littleEndian === "LE") {
    buf.writeUInt16LE(Number(value), 0);
  } else {
    buf.writeUInt16BE(Number(value), 0);
  }
  buffer.set(Uint8Array.from(buf), offset);
}

export function writeUInt32(
  buffer: Uint8Array,
  offset: number,
  value: bigint,
  littleEndian: endian
): void {
  if (offset + 4 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.alloc(4);

  if (littleEndian === "LE") {
    buf.writeUInt32LE(Number(value), 0);
  } else {
    buf.writeUInt32BE(Number(value), 0);
  }
  buffer.set(Uint8Array.from(buf), offset);
}

export function writeUInt64(
  buffer: Uint8Array,
  offset: number,
  value: bigint,
  littleEndian: endian
): void {
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
}

export function readUInt8(buffer: Uint8Array, offset: number): bigint {
  if (offset + 1 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  const buf = Buffer.from(buffer);
  return BigInt(buf.readUInt8(offset));
}

export function readUInt16(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): bigint {
  if (offset + 2 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.from(buffer);

  if (littleEndian === "LE") {
    return BigInt(buf.readUInt16LE(offset));
  } else {
    return BigInt(buf.readUInt16BE(offset));
  }
}

export function readUInt32(
  buffer: Uint8Array,
  offset: number,
  littleEndian: endian
): bigint {
  if (offset + 4 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }

  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.from(buffer);

  if (littleEndian === "LE") {
    return BigInt(buf.readUInt32LE(offset));
  } else {
    return BigInt(buf.readUInt32BE(offset));
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
