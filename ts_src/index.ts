export function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes || []).toString("hex");
}

export function fromHex(hexString: string): Uint8Array {
  return Uint8Array.from(Buffer.from(hexString || "", "hex"));
}

// API that is copy-paste from browser

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

const DECODER = new TextDecoder();
export function toUtf8(bytes: Uint8Array): string {
  return DECODER.decode(bytes);
}
