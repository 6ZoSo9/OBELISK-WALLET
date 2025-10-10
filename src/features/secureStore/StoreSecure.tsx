import React, { useState } from "react";
import { sealAndPrepareUpload } from "@/lib/secure-store";
import { HttpIpfsAdapter, uploadWithAdapter } from "@/lib/secure-store/ipfs";
import { getDataRegistry } from "./contracts";

export default function StoreSecure() {
  const [status, setStatus] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [cid, setCid] = useState<string>("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const bytes = new Uint8Array(await file.arrayBuffer());

    setStatus("Sealing...");
    const { ciphertext, manifest } = await sealAndPrepareUpload(bytes, true);

    setStatus("Uploading to IPFS...");
    const adapter = new HttpIpfsAdapter(import.meta.env.VITE_IPFS_ENDPOINT);
    const { cidCipher, cidManifest } = await uploadWithAdapter(adapter, ciphertext, manifest);
    setCid(cidCipher);

    setStatus("Hashing...");
    const ctHashHex = await crypto.subtle.digest("SHA-256", ciphertext).then(b => "0x" + Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join(""));
    const mfBytes = new TextEncoder().encode(JSON.stringify(manifest));
    const mfHashHex = await crypto.subtle.digest("SHA-256", mfBytes).then(b => "0x" + Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join(""));

    setStatus("Submitting on-chain...");
    const registry = await getDataRegistry();
    const tx = await registry.register(ctHashHex, mfHashHex, "0x7a737364", "0x41455347", BigInt(ciphertext.length), `ipfs://${cidCipher}`);
    const rec = await tx.wait();
    setTxHash(rec.hash);
    setStatus("Done.");
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Secure Store</h2>
      <input type="file" onChange={onFile} className="block" />
      <p>{status}</p>
      {cid && <p>CID: {cid}</p>}
      {txHash && <p>Tx: {txHash}</p>}
    </div>
  );
}
