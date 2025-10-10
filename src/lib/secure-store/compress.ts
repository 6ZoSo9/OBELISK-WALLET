// Compression is stubbed; replace with zstd-wasm/brotli in production.
export async function compressBytes(bytes: Uint8Array): Promise<Uint8Array> {
  return bytes;
}
export async function decompressBytes(bytes: Uint8Array): Promise<Uint8Array> {
  return bytes;
}
