export function toUtf8(bytes: Uint8Array): string {
  return Buffer.from(bytes || []).toString();
}

export function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes || []).toString("hex");
}

export function fromHex(hexString: string): Uint8Array {
  return Uint8Array.from(Buffer.from(hexString || "", "hex"));
}

export function fromUtf8(utf8String: string): Uint8Array {
  return Uint8Array.from(Buffer.from(utf8String || ""));
}

export type CompareResult = -1 | 0 | 1;
export function compare(v1: Uint8Array, v2: Uint8Array): CompareResult {
  return Buffer.from(v1).compare(Buffer.from(v2)) as CompareResult;
}
