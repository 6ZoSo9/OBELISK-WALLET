export async function encryptAesGcm(bytes: Uint8Array): Promise<{ciphertext: Uint8Array, iv: Uint8Array, dek: Uint8Array}> {
  const dek = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey("raw", dek, "AES-GCM", false, ["encrypt"]);
  const ct = new Uint8Array(await crypto.subtle.encrypt({name: "AES-GCM", iv}, key, bytes));
  return {ciphertext: ct, iv, dek};
}

export async function decryptAesGcm(ciphertext: Uint8Array, iv: Uint8Array, dek: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", dek, "AES-GCM", false, ["decrypt"]);
  const pt = new Uint8Array(await crypto.subtle.decrypt({name: "AES-GCM", iv}, key, ciphertext));
  return pt;
}
