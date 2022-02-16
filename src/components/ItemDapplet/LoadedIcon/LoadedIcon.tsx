import React, { useState } from 'react';
import styled from 'styled-components';
import { useMemo } from 'react';
import { ethers } from 'ethers';
import { Image } from 'semantic-ui-react';
import styles from '../ItemDapplet.module.scss';
import { useEffect } from 'react';

const BZZ_ENDPOINT = 'https://swarmgateway.mooo.com';
const IPFS_ENDPOINT = 'https://ipfs.kaleido.art';
const SIA_ENDPOINT = 'https://siasky.net';
const S3_ENDPOINT = 'https://dapplet-api.s3.nl-ams.scw.cloud';

interface ButtonWrapperProps {
  buttonType: string
}

const ButtonWrapper = styled.button<ButtonWrapperProps>`
  
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`


type StorageRef = {
  hash: string;
  uris: string[];
}

interface LoadedIconProps {
  storageRef: StorageRef
}

export const LoadedIcon = ({storageRef}: LoadedIconProps) => {
  const [imgURL, setImgUrl] = useState('')
  
  const _fetchAndCheckHash = async(url: string, controller: AbortController, expectedHash?: string) => {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error('Cannot fetch ' + url);
    
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const recievedHash = ethers.utils.keccak256(new Uint8Array(buffer));
    
    if (expectedHash && expectedHash !== recievedHash) {
        throw new Error('Hash mismatch ' + url);
    }
    
    return blob;
  }
  const _getResource = async(storageRef: StorageRef) => {
    const promises: Promise<Blob>[] = [];
    const controller = new AbortController();
    
    for (const uri of storageRef.uris) {
        const protocol = uri.substring(0, uri.indexOf('://'));
        const reference = uri.substring(uri.indexOf('://') + 3);
        
        if (protocol === 'bzz') {
            promises.push(_fetchAndCheckHash(BZZ_ENDPOINT + '/bzz/' + reference, controller, storageRef.hash));
        } else if (protocol === 'ipfs') {
            promises.push(_fetchAndCheckHash(IPFS_ENDPOINT + '/ipfs/' + reference, controller, storageRef.hash));
        } else if (protocol === 'sia') {
            promises.push(_fetchAndCheckHash(SIA_ENDPOINT + '/' + reference, controller, storageRef.hash));
        } else {
            console.warn('Unsupported protocol ' + uri);
        }
    }
    
    if (storageRef.hash) {
        const hash = storageRef.hash.replace('0x', '');
        promises.push(_fetchAndCheckHash(S3_ENDPOINT + '/' + hash, controller, storageRef.hash));
    }
    
    const blob = await Promise.any(promises);
    const blobUrl = URL.createObjectURL(blob);
    
    // cancel all request
    controller.abort();
    
    setImgUrl(blobUrl);
  }

  useEffect(() => {
    _getResource(storageRef);
  })
  return(
    imgURL ?
    <Image className={styles.itemImage} src={imgURL} style={{ width: 85, height: 85, borderRadius: '50%', marginTop: 10 }} />
    : <div style={{  minWidth: 85, height: 85, borderRadius:'50%', marginTop: 10, background: "#919191" }}></div>
)}