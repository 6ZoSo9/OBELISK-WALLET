export * from "./crypto";
export * from "./compress";
export * from "./ipfs";

export interface SealResult {
  ciphertext: Uint8Array;
  iv: Uint8Array;
  dek: Uint8Array;
  manifest: any;
}

export async function sealAndPrepareUpload(bytes: Uint8Array, compress = true): Promise<SealResult> {
  const toSeal = compress ? await compressBytes(bytes) : bytes;
  const { ciphertext, iv, dek } = await encryptAesGcm(toSeal);
  const manifest = {
    v: 1,
    compAlg: compress ? "zstd" : "none",
    encAlg: "AES-GCM",
    iv: Buffer.from(iv).toString("base64"),
    sizes: { plain: bytes.length, enc: ciphertext.length },
  };
  return { ciphertext, iv, dek, manifest };
}
