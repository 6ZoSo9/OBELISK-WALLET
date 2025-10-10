import { BrowserProvider, Contract } from "ethers";
import DataRegistryAbi from "./DataRegistry.abi.json";
import WalletOracleAbi from "./WalletOracle.abi.json";

// NOTE: you need to place ABI JSON files here after compiling in VOID-CHAIN or copy them manually.
export async function getSigner() {
  const provider = new BrowserProvider((window as any).ethereum);
  await provider.send("eth_requestAccounts", []);
  return await provider.getSigner();
}

export async function getDataRegistry() {
  const signer = await getSigner();
  return new Contract(import.meta.env.VITE_DATAREGISTRY_ADDR, DataRegistryAbi as any, signer);
}

export async function getWalletOracle() {
  const signer = await getSigner();
  return new Contract(import.meta.env.VITE_WALLETORACLE_ADDR, WalletOracleAbi as any, signer);
}
