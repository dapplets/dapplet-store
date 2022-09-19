import getAndCheckHash from "./getAndCheckHash";

type StorageRef = {
  hash: string;
  uris: string[];
};

const BZZ_ENDPOINT = "https://swarmgateway.mooo.com";
const IPFS_ENDPOINT = "https://ipfs.kaleido.art";
const SIA_ENDPOINT = "https://siasky.net";
const S3_ENDPOINT = "https://dapplet-api.s3.nl-ams.scw.cloud";

const getIconUrl = async (storageRef: StorageRef) => {
  const promises: Promise<Blob>[] = [];
  const controller = new AbortController();

  for (const uri of storageRef.uris) {
    const protocol = uri.substring(0, uri.indexOf("://"));
    const reference = uri.substring(uri.indexOf("://") + 3);

    if (protocol === "bzz") {
      promises.push(
        getAndCheckHash(
          BZZ_ENDPOINT + "/bzz/" + reference,
          controller,
          storageRef.hash,
        ),
      );
    } else if (protocol === "ipfs") {
      promises.push(
        getAndCheckHash(
          IPFS_ENDPOINT + "/ipfs/" + reference,
          controller,
          storageRef.hash,
        ),
      );
    } else if (protocol === "sia") {
      promises.push(
        getAndCheckHash(
          SIA_ENDPOINT + "/" + reference,
          controller,
          storageRef.hash,
        ),
      );
    } else {
      console.warn("Unsupported protocol " + uri);
    }
  }

  if (storageRef.hash) {
    const hash = storageRef.hash.replace("0x", "");
    if (hash.match(/^0*$/) === null)
      promises.push(
        getAndCheckHash(S3_ENDPOINT + "/" + hash, controller, storageRef.hash),
      );
  }

  const blob = await Promise.any(promises);
  const blobUrl = URL.createObjectURL(blob);

  // cancel all request
  controller.abort();

  return blobUrl;
};

export default getIconUrl;
