export interface StorageAdapter {
  put(bytes: Uint8Array): Promise<string>;
}
export class HttpIpfsAdapter implements StorageAdapter {
  constructor(private endpoint: string) {}
  async put(bytes: Uint8Array): Promise<string> {
    const res = await fetch(`${this.endpoint}/api/v0/add?pin=true`, {
      method: "POST",
      body: new Blob([bytes])
    });
    const j = await res.json();
    return j.Hash; // CID
  }
}
export async function uploadWithAdapter(adapter: StorageAdapter, ciphertext: Uint8Array, manifest: any) {
  const cidCipher = await adapter.put(ciphertext);
  const cidManifest = await adapter.put(new TextEncoder().encode(JSON.stringify(manifest)));
  return { cidCipher, cidManifest };
}
