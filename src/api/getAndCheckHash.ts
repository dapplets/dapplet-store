import { ethers } from "ethers";

const getAndCheckHash = async (
  url: string,
  controller: AbortController,
  expectedHash?: string,
) => {
  const response = await fetch(url, { signal: controller.signal });
  if (!response.ok) throw new Error("Cannot fetch " + url);

  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const recievedHash = ethers.utils.keccak256(new Uint8Array(buffer));

  if (expectedHash && expectedHash !== recievedHash) {
    throw new Error("Hash mismatch " + url);
  }

  return blob;
};

export default getAndCheckHash;
