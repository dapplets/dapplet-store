import React, { useMemo } from 'react';
import { Image } from 'semantic-ui-react';
import { ethers } from 'ethers';
import styled from 'styled-components';

import styles from './ItemDapplet.module.scss';
import { DappletButton, DappletButtonTypes } from './atoms/DappletButton';

import { IDapplet, IDappletsList } from "../../config/types";

const ImagesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, min-content) 1fr;
  margin-left: 8px;
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

const ImageItem = styled.img`
  margin-left: -8px;
  border: 2px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
`

const UnderUserInfo = styled.div`
  display: grid;
  grid-template-columns: max-content max-content max-content;
  grid-column-gap: 20px;
  color: #919191;
`


const UnderUserInfoSeparator = styled.div`
  width: 2px;
  height: 100%;
  background-color: #E3E3E3;
`

const ButtonsWrapper = styled.div`
  display: grid;
  grid-template-rows: min-content min-content;
  grid-row-gap: 10px;
`

interface ItemDappletProps {
  item: IDapplet
  dappletsVersions: any
  selectedDapplets: IDappletsList
  localDapplets: IDappletsList
  dappletsTransactions: any
  editLocalDappletsList: (item: IDapplet) => (e: any) => void
  editSelectedDappletsList: (item: IDapplet) => (e: any) => void
  expandedItems: string[] 
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>
}

const ItemDapplet = (props: ItemDappletProps): React.ReactElement => {
  const {
    item,
    dappletsVersions,
    selectedDapplets,
    localDapplets,
    dappletsTransactions,
    editLocalDappletsList,
    editSelectedDappletsList,
    expandedItems,
    setExpandedItems,
  } = props;

  const isLocalDapplet = localDapplets.dapplets.some((dapplet) => dapplet.name === item.name);

  const selected = useMemo(() => {
    const selectedDapplet = selectedDapplets.dapplets.find((dapplet) => dapplet.name === item.name)
    console.log({selectedDapplet})
    if (selectedDapplet)

      return {
        type: DappletButtonTypes.RemoveFromList,
        title: 'From My List',
      }
    return {
      type: DappletButtonTypes.AddToList,
      title: 'To My List',
    }
  }, [item.name, selectedDapplets.dapplets])

  const owner = item.owner.replace('0x000000000000000000000000', '0x');

  const icon = {
    hash: item.icon.hash,
    uris: item.icon.uris.map(u => ethers.utils.toUtf8String(u))
  };

  const isOpen = !!expandedItems?.includes(item.name);

  const handleClickOnItem = ({ target }: any) => {
    if (target.tagName === 'BUTTON') return;
    if (isOpen) {
      setExpandedItems(expandedItems.filter((name) => name !== item.name))
    } else {
      setExpandedItems([...expandedItems, item.name])
    }
  };

  return (
    <div
      style={{ display: 'flex', width: '100%' }}
      onClick={handleClickOnItem}
    >
      <Image className={styles.itemImage} src={`https://bee.dapplets.org/bzz/${icon.uris[0].slice(6)}`} style={{ width: 46, height: 46, borderRadius: '99em', marginTop: 10 }} />

      <div className={styles.left} style={{ flexGrow: 1, padding: '5px 18px' }}>
        <h3 className={styles.title}>
          <div>{item.title}</div>
          {!isOpen && (
            <>
              <ImagesWrapper>
                <ImageItem src={`https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37f/`}/>
                <ImageItem src={`https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37f/`}/>
                <ImageItem src={`https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37f/`}/>
                <ImageItem src={`https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37f/`}/>
                <ImageItem src={`https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37f/`}/>
                <a href='/'>+24 more lists</a>
              </ImagesWrapper>
            </>
          )}
        </h3>

        
        {isOpen && (
          <UnderUserInfo>
            <ImagesWrapper>
              <ImageItem src={`https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37f/`}/>
              <ImageItem src={`https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37f/`}/>
              <ImageItem src={`https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37f/`}/>
              <ImageItem src={`https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37f/`}/>
              <ImageItem src={`https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37f/`}/>
              <a href='/'>+24 more lists</a>
            </ImagesWrapper>
            <UnderUserInfoSeparator />
            <div>4 320 214 active users</div>
          </UnderUserInfo>
          )}

        <div className={styles.author}>
          Author: <a href={owner}>{owner}</a>
        </div>

        <div className={styles.author}>
          {item.description}
        </div>

        {isOpen && (
          <>
            <div className={styles.author}>
              Full name: {item.name}
            </div>
            <div className={styles.author}>
              Last version: {dappletsVersions[item.name][dappletsVersions[item.name].length - 1]}
            </div>
            <div className={styles.author}>
              Published since: {new Date(dappletsTransactions[item.name] * 1000).toString()}
            </div>
          </>
        )}
      </div>

      <ButtonsWrapper>
        <DappletButton
          title={isLocalDapplet ? 'From My Dapplets' : 'To My Dapplets'}
          type={isLocalDapplet ? DappletButtonTypes.RemoveFromMy : DappletButtonTypes.AddToMy}
          onClick={editLocalDappletsList(item)}
        />
        <DappletButton
          title={selected.title}
          type={selected.type}
          onClick={editSelectedDappletsList(item)}
        />
      </ButtonsWrapper>
    </div>
  );
};

export default ItemDapplet;
