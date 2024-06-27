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
  const buf = Buffer.from(buffer);
  buf.writeUInt8(Number(value), offset);
  buffer.set(Uint8Array.from(buf), offset);
}

export function writeUInt16(
  buffer: Uint8Array,
  offset: number,
  value: bigint,
  littleEndian: endian
): void {
  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.alloc(2);

  if (littleEndian === "LE") {
    buf.writeUInt16LE(Number(value), offset);
  } else {
    buf.writeUInt16BE(Number(value), offset);
  }
  buffer.set(Uint8Array.from(buf), offset);
}

export function writeUInt32(
  buffer: Uint8Array,
  offset: number,
  value: bigint,
  littleEndian: endian
): void {
  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.alloc(4);

  if (littleEndian === "LE") {
    buf.writeUInt32LE(Number(value), offset);
  } else {
    buf.writeUInt32BE(Number(value), offset);
  }
  buffer.set(Uint8Array.from(buf), offset);
}

export function writeUInt64(
  buffer: Uint8Array,
  offset: number,
  value: bigint,
  littleEndian: endian
): void {
  littleEndian = littleEndian.toUpperCase() as endian;

  const buf = Buffer.alloc(8);

  if (littleEndian === "LE") {
    buf.writeBigUInt64LE(value, offset);
  } else {
    buf.writeBigUInt64BE(value, offset);
  }
  buffer.set(Uint8Array.from(buf), offset);
}
