const Base64Options = { alphabet: "base64url", omitPadding: true } as const;
export class BitStream {
  private _pos = 0;
  private _bitString = "";

  constructor(data?: string | ArrayBuffer) {
    if (!data) return;
    const bytes =
      typeof data === "string"
        ? Uint8Array.fromBase64(data, Base64Options)
        : new Uint8Array(data);
    this._bitString = [...bytes].map((b) => bits(b, 8)).join("");
  }

  get byteLength() {
    return Math.ceil(this._bitString.length / 8);
  }

  readBitString(bitCount: number) {
    return this._bitString.slice(this._pos, (this._pos += bitCount));
  }
  readBoolean() {
    return this.readBitString(1) === "1";
  }
  readNumber(bitCount: number) {
    return parseInt(this.readBitString(bitCount), 2);
  }

  write(value: boolean): void;
  write(value: number, bitCount: number): void;
  write(value: boolean | number, bitCount: number = 1) {
    this._bitString +=
      typeof value === "boolean" ? (value ? 1 : 0) : bits(value, bitCount);
    this._pos = this._bitString.length;
  }

  get bytes() {
    return new Uint8Array(
      this._bitString
        .match(/.{0,8}/g)!
        .map((s) => parseInt(s.padEnd(8, "0"), 2)),
    );
  }

  toString() {
    return this.bytes.toBase64(Base64Options);
  }
}

function bits(value: number, bitCount: number) {
  return value.toString(2).padStart(bitCount, "0");
}
