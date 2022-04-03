import { ethers } from "ethers";
import { PROVIDER_URL } from "../consts";
import abi from "./abi";

export const getEnsNamesApi = async (addresses: string[]) => {
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 0x05);
  const contract: any = new ethers.Contract(
    "0x3f3d7dc7f0ad3878de67079e07df06b150ac7421",
    abi,
    provider,
  );
  try {
    const ensNames: string[] = await contract.getNames(addresses);
    return ensNames;
  } catch (err) {
    console.log("Error getting ens names.", err);
  }
};
