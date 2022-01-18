/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useRef } from 'react';
import { Image } from 'semantic-ui-react';
import { ethers } from 'ethers';
import styled from 'styled-components';

import styles from './ItemDapplet.module.scss';
import { DappletButton, DappletButtonTypes } from './atoms/DappletButton';
import jazzicon from '@metamask/jazzicon';

import { IDappletsList } from "../../config/types";
import Highlighter from "react-highlight-words";
import DappletListersPopup from '../../features/DappletListersPopup/DappletListersPopup';
import { IDapplet } from '../../models/dapplets';
import { RootDispatch, RootState } from '../../models';
import { Sort } from '../../models/sort';
import { connect } from 'react-redux';
import { ModalsList } from '../../models/modals';

const mapState = (state: RootState) => ({
  address: state.user.address,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setModalOpen: (payload: ModalsList | null) => dispatch.modals.setModalOpen(payload),
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;


const ImageItem = styled.div`
  margin-left: -8px;
  border: 2px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
`
interface VanillaChildrenProps {
	children: HTMLElement | HTMLDivElement
}

const VanillaChildren = ({ children }: VanillaChildrenProps): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
    while (ref.current?.firstChild) {
      ref.current?.removeChild(ref.current?.firstChild);
    }
		ref.current?.appendChild(children);
	}, [children, ref]);

	return (
		<ImageItem style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} ref={ref}/>
	);
};

const ImagesWrapper = styled.div<{count: number}>`
  display: grid;
  grid-template-columns: ${({ count }) => `repeat(${count}, min-content) 1fr`};
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
  selectedDapplets: IDappletsList
  localDapplets: IDappletsList
  editLocalDappletsList: (item: IDapplet) => void
  editSelectedDappletsList: (item: IDapplet) => void
  expandedItems: string[] 
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>
  searchQuery?: string
  setAddressFilter: any
  setOpenedList: any
  trustedUsersList: string[]
}

const ItemDapplet = (props: ItemDappletProps & Props): React.ReactElement => {
  const {
    item,
    selectedDapplets,
    localDapplets,
    editLocalDappletsList,
    editSelectedDappletsList,
    expandedItems,
    setExpandedItems,
    searchQuery,
    setAddressFilter,
    setSort,
    trustedUsersList,
    address,
    setModalOpen,
  } = props;

  const trustedList = useMemo(() => {
    return item.trustedUsers.filter((user) => trustedUsersList.includes(user) || user === address)
  }, [address, item.trustedUsers, trustedUsersList])

  const otherList = useMemo(() => {
    return item.trustedUsers.filter((user) => !(trustedUsersList.includes(user) || user === address))
  }, [address, item.trustedUsers, trustedUsersList])

  
  const getAvatar = (loggedIn: string): HTMLDivElement => jazzicon(12, parseInt(loggedIn.slice(2, 10), 16));
  const getAddressShort = (address: string) => address ? address.replace('0x000000000000000000000000', '0x') : ''

  const isLocalDapplet = localDapplets.dapplets.some((dapplet) => dapplet.name === item.name);

  const getSelectedType = () => {
    const selectedDapplet = selectedDapplets.dapplets.find((dapplet) => dapplet.name === item.name)
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

  const isOpen = !!expandedItems?.includes(item.name);

  const handleClickOnItem = ({ target }: any) => {
    console.log({target})
    if (target.tagName === 'BUTTON') return;
    if (isOpen) {
      setExpandedItems(expandedItems.filter((name) => name !== item.name))
    } else {
      setExpandedItems([...expandedItems, item.name])
    }
  };

  if (!item) return <></>;
  return (
    <div
      style={{ display: 'flex', width: '100%' }}
      onClick={handleClickOnItem}
    >
      {
        icon.uris.length > 0 &&
        <Image className={styles.itemImage} src={`https://bee.dapplets.org/bzz/${icon.uris[0].slice(6)}`} style={{ width: 85, height: 85, borderRadius: '99em', marginTop: 10 }} />
      }
      

      <div className={styles.left} style={{ flexGrow: 1, padding: '5px 18px' }}>
        <h3 className={styles.title}>
          <Highlighter textToHighlight={item.title} searchWords={[searchQuery || ""]} highlightStyle={{ background: '#ffff00', padding: 0 }} />
          
          {!isOpen && (
            <>
              <ImagesWrapper count={trustedList.slice(0,3).length}>
                {
                  trustedList.slice(0,3).map((address) => (
                    <VanillaChildren>{getAvatar(getAddressShort(address))}</VanillaChildren>
                  ))
                }
                <DappletListersPopup 
                  trustedList={trustedList}
                  otherList={otherList}
                  text={`+${Math.max(trustedList.length-3, 0) + otherList.length} more lists`}
                  onClickSort={setAddressFilter}
                />
              </ImagesWrapper>
            </>
          )}
        </h3>

        
        {isOpen && (
          <UnderUserInfo>
            <ImagesWrapper count={trustedList.slice(0,3).length}>
                {
                  trustedList.slice(0,3).map((address) => (
                    <VanillaChildren>{getAvatar(getAddressShort(address))}</VanillaChildren>
                  ))
                }
              <DappletListersPopup 
                trustedList={trustedList}
                otherList={otherList}
                text={`+${Math.max(trustedList.length-3, 0) + otherList.length} more lists`}
                onClickSort={setAddressFilter}
              />
            </ImagesWrapper>
            <UnderUserInfoSeparator />
            <div>4 320 214 active users</div>
          </UnderUserInfo>
          )}

        <div className={styles.author}>
          {/* Author: <a href={owner}>{owner}</a> */}
          
          Author: <a onClick={(e) => {
            e.stopPropagation()
            setSort({
              addressFilter: item.owner,
              selectedList: undefined,
            })
          }}>
            <Highlighter textToHighlight={owner} searchWords={[searchQuery || ""]} highlightStyle={{ background: '#ffff00', padding: 0 }} />
          </a>
        </div>

        {
          searchQuery ? (
            <Highlighter className={styles.author} textToHighlight={item.description} searchWords={[searchQuery]} highlightStyle={{ background: '#ffff00', padding: 0 }} />
          ) : (
            <div className={styles.author}>{item.description}</div>
          )
        }

        {isOpen && (
          <>
          {
            searchQuery ? <>
              <Highlighter className={styles.author} textToHighlight={`Full name: ${item.name}`} searchWords={[searchQuery]} highlightStyle={{ background: '#ffff00', padding: 0 }} />
              <Highlighter className={styles.author} textToHighlight={`Last version: ${item.versionToShow}`} searchWords={[searchQuery]} highlightStyle={{ background: '#ffff00', padding: 0 }} />
              <Highlighter className={styles.author} textToHighlight={`Published since: ${item.timestampToShow}`} searchWords={[searchQuery]} highlightStyle={{ background: '#ffff00', padding: 0 }} />
            </> :
            <>
              <div className={styles.author}>
                Full name: {item.name}
              </div>
              <div className={styles.author}>
                Last version: {item.versionToShow}
              </div>
              <div className={styles.author}>
                Published since: {item.timestampToShow}
              </div>
            </>
          }
          </>
        )}
      </div>

      <ButtonsWrapper>
        <DappletButton
          type={isLocalDapplet ? DappletButtonTypes.InMyDapplets : DappletButtonTypes.AddToMy}
          onClick={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
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
        />
      </ButtonsWrapper>
    </div>
  );
};

export default connect(mapState, mapDispatch)(ItemDapplet);
