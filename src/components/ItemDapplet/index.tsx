/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo } from 'react';
import { Image } from 'semantic-ui-react';
import { ethers } from 'ethers';
import styled from 'styled-components';

import styles from './ItemDapplet.module.scss';
import { DappletButton, DappletButtonTypes } from './DappletButton/DappletButton';
// import jazzicon from '@metamask/jazzicon';

import Highlighter from "react-highlight-words";
import DappletListersPopup from '../../features/DappletListersPopup/DappletListersPopup';
import { IDapplet } from '../../models/dapplets';
import { RootDispatch, RootState } from '../../models';
import { Sort } from '../../models/sort';
import { connect } from 'react-redux';
import { ModalsList } from '../../models/modals';
import { MyListElement } from '../../models/myLists';
import { useEffect } from 'react';
import { useState } from 'react';

const mapState = (state: RootState) => ({
  address: state.user.address,
  isLocked: state.user.isLocked,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setModalOpen: (payload: ModalsList | null) => dispatch.modals.setModalOpen(payload),
  setExpanded: (payload: {id: number, isExpanded: boolean}) => dispatch.dapplets.setExpanded(payload)
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;


// const ImageItem = styled.div`
//   margin-left: -8px;
//   border: 2px solid white;
//   border-radius: 50%;
//   width: 16px;
//   height: 16px;
// `
// interface VanillaChildrenProps {
// 	children: HTMLElement | HTMLDivElement
// }

// const VanillaChildren = ({ children }: VanillaChildrenProps): JSX.Element => {
// 	const ref = useRef<HTMLDivElement>(null);

// 	useEffect(() => {
//     while (ref.current?.firstChild) {
//       ref.current?.removeChild(ref.current?.firstChild);
//     }
// 		ref.current?.appendChild(children);
// 	}, [children, ref]);

// 	return (
// 		<ImageItem style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} ref={ref}/>
// 	);
// };

const ImagesWrapper = styled.div<{count: number}>`
  display: grid;
  grid-template-columns: 1fr;
  /* margin-left: 8px; */
  align-items: center;

	a {
		color: #588CA3;
		text-decoration-line: underline;
    font-family: Montserrat;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 21px;
    letter-spacing: 0em;
    text-align: left;
	}
`

const UnderUserInfo = styled.div`
  display: grid;
  grid-template-columns: max-content max-content max-content;
  grid-column-gap: 20px;
  color: #919191;
`

const Line = styled.div`
  display: grid;
  height: 1px;
  background: #E3E3E3;
  margin-top: 10px;
`


// const UnderUserInfoSeparator = styled.div`
//   width: 2px;
//   height: 100%;
//   background-color: #E3E3E3;
// `

const ButtonsWrapper = styled.div`
  display: grid;
  grid-template-rows: min-content min-content;
  grid-row-gap: 10px;
`

const ENDPOINTS: {
  [key: string]: string
} = {
  'bzz': 'https://swarmgateway.mooo.com',
  'ipfs': 'https://ipfs.kaleido.art',
  'sia': 'https://siasky.net',
  's3': 'https://dapplet-api.s3.nl-ams.scw.cloud',
}

const BZZ_ENDPOINT = 'https://swarmgateway.mooo.com';
const IPFS_ENDPOINT = 'https://ipfs.kaleido.art';
const SIA_ENDPOINT = 'https://siasky.net';
const S3_ENDPOINT = 'https://dapplet-api.s3.nl-ams.scw.cloud';

interface ItemDappletProps {
  item: IDapplet
  selectedDapplets: MyListElement[]
  localDapplets: MyListElement[]
  editLocalDappletsList: (item: IDapplet) => void
  editSelectedDappletsList: (item: IDapplet) => void
  searchQuery?: string
  setAddressFilter: any
  setOpenedList: any
  trustedUsersList: string[]
  isDapplet: boolean
}

const ItemDapplet = (props: ItemDappletProps & Props): React.ReactElement => {
  const {
    item,
    selectedDapplets,
    localDapplets,
    editLocalDappletsList,
    editSelectedDappletsList,
    searchQuery,
    setSort,
    trustedUsersList,
    address,
    setModalOpen,
    setExpanded,
    
    isDapplet,
    isLocked,
  } = props;

  const trustedList = useMemo(() => {
    return item.trustedUsers.filter((user) => trustedUsersList.includes(user) || user === address)
  }, [address, item.trustedUsers, trustedUsersList])

  const otherList = useMemo(() => {
    return item.trustedUsers.filter((user) => !(trustedUsersList.includes(user) || user === address))
  }, [address, item.trustedUsers, trustedUsersList])

  
  // const getAvatar = (loggedIn: string): HTMLDivElement => jazzicon(12, parseInt(loggedIn.slice(2, 10), 16));
  // const getAddressShort = (address: string) => address ? address.replace('0x000000000000000000000000', '0x') : ''

  const isLocalDapplet = localDapplets.some((dapplet) => dapplet.name === item.name);

  const getSelectedType = () => {
    const selectedDapplet = selectedDapplets.find((dapplet) => dapplet.name === item.name)
    if (selectedDapplet)
      switch (selectedDapplet.type) {
        case 'Adding':
          return DappletButtonTypes.AddingToList
        case 'Removing':
          return DappletButtonTypes.RemovingFromList
        default:
        case 'Default':
          return DappletButtonTypes.InMyList
      }
    return DappletButtonTypes.AddToList
  }

  const owner = item.owner.replace('0x000000000000000000000000', '0x');

  const icon = {
    hash: item.icon.hash,
    uris: item.icon.uris.map(u => ethers.utils.toUtf8String(u))
  };

  const isOpen = useMemo(() => item.isExpanded, [item.isExpanded])

  const handleClickOnItem = ({ target }: any) => {
    if (target.tagName === 'BUTTON') return;
    setExpanded({
      id: item.id,
      isExpanded: !isOpen,
    })
  };

  
    
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

  type StorageRef = {
    hash: string;
    uris: string[];
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
    
    return blobUrl;
  }

  const [imgURL, setImgUrl] = useState('')

  // useEffect(() => {
  //   console.debug('start', item.name)
  //   console.debug(icon)
  //   // const urls = icon.uris.map((url) => {
  //   //   const myUrl: string[] = url.split('://')
  //   //   return `${ENDPOINTS[myUrl[0]]}/${myUrl[0]}/${myUrl[1]}`
  //   // });
  //   // const requests = urls.map(url => fetch(url));
  //   // Promise.any(requests)
  //   //   .then(response => { 
  //   //     setImgUrl(response.url)
  //   //   })
  //   //   .catch(error => console.warn({error}))
  //   _getResource(icon).then((blob) => setImgUrl(blob))
  // }, [icon])

  if (!item) return <></>;
  return (
    <div
      style={{ display: 'flex', width: '100%', wordBreak: 'break-all' }}
      onClick={handleClickOnItem}
    >
      {
        icon.uris.length > 0 ?
        <Image className={styles.itemImage} src={imgURL} style={{ width: 85, height: 85, borderRadius: '50%', marginTop: 10 }} />
        : <div style={{  minWidth: 85, height: 85, borderRadius:'50%', marginTop: 10, background: "#919191" }}></div>
      }
      

      <div className={styles.left} style={{ flexGrow: 1, padding: '5px 18px' }}>
        <h3 className={styles.title}>
          <Highlighter textToHighlight={item.title} searchWords={[searchQuery || ""]} highlightStyle={{ background: '#ffff00', padding: 0 }} />
        </h3>


        {isOpen && (
          <>
            <div className={styles.author}>
              <Highlighter className={styles.author} textToHighlight={`${item.name}`} searchWords={[searchQuery || ""]} highlightStyle={{ background: '#ffff00', padding: 0 }} />
            </div>
          </>
        )}
        
        
        {[...trustedList, ...otherList].length > 0 && <UnderUserInfo>
          <ImagesWrapper count={trustedList.slice(0,3).length} className={styles.author}>
            <DappletListersPopup
              trustedList={trustedList}
              otherList={otherList}
              text={`in ${[...trustedList, ...otherList].length} list${[...trustedList, ...otherList].length !== 1 ? 's' : ''}`}
              onClickSort={(address: string) => {
                // console.log('hello')
                setSort({
                  addressFilter: address,
                  selectedList: undefined,
                  searchQuery: "",
                })
              }}
            />
          </ImagesWrapper>
        </UnderUserInfo>}

        <div className={styles.author}>
          Author: <a onClick={(e) => {
            e.stopPropagation()
            setSort({
              addressFilter: item.owner,
              selectedList: undefined,
              searchQuery: "",
            })
          }}>
            <Highlighter textToHighlight={owner} searchWords={[searchQuery || ""]} highlightStyle={{ background: '#ffff00', padding: 0 }} />
          </a>
        </div>

        {isOpen && (
          <>
            {/* <div>
              <Highlighter className={styles.author} textToHighlight={`Full name: ${item.name}`} searchWords={[searchQuery || ""]} highlightStyle={{ background: '#ffff00', padding: 0 }} />
            </div> */}
            <div className={styles.author}>
              <Highlighter className={styles.author} textToHighlight={`Update: ${item.timestampToShow} (ver. ${item.versionToShow})`} searchWords={[searchQuery || ""]} highlightStyle={{ background: '#ffff00', padding: 0 }} />
            </div>
            <Line />
            {/* <div> */}
              {/* <Highlighter className={styles.author} textToHighlight={`Published since: `} searchWords={[searchQuery || ""]} highlightStyle={{ background: '#ffff00', padding: 0 }} /> */}
            {/* </div> */}
          </>
        )}

      <div className={styles.author}>
        <Highlighter className={styles.author} textToHighlight={item.description} searchWords={[searchQuery || ""]} highlightStyle={{ background: '#ffff00', padding: 0 }} />
      </div>

      </div>

      <ButtonsWrapper>
        <DappletButton
          type={isLocalDapplet ? DappletButtonTypes.InMyDapplets : DappletButtonTypes.AddToMy}
          onClick={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            if (isDapplet)
              setModalOpen(ModalsList.Install)
            else 
              editLocalDappletsList(item)
          }}
        />
        <DappletButton
          type={getSelectedType()}
          onClick={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            if (!address)
              setModalOpen(ModalsList.Login)
            else 
              editSelectedDappletsList(item)
          }}
          disabled={isLocked}
        />
      </ButtonsWrapper>
    </div>
  );
};

export default connect(mapState, mapDispatch)(React.memo(ItemDapplet));
