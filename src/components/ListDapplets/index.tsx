import React, { useState,  SetStateAction } from 'react';
import { Dropdown, Header } from 'semantic-ui-react';

import { ListDappletsProps } from './ListDapplets.props';
import ItemDapplet from '../ItemDapplet';
import Item from '../SortableOverlayItem/Item';
import { IDapplet, Lists } from '../../config/types';
import SortableModule from '../SortableModule';

function ListDapplets({
  list,
  dappletsVersions,
  setSelectedDapplets,
  selectedDapplets,
  localDapplets,
  setLocalDapplets,
  selectedList,
  setSelectedList,
  dappletsTransactions,
}: ListDappletsProps): React.ReactElement {

  const [sortType, setSortType] = useState('A-Z');
  const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

  const editLocalDappletsList = (item: IDapplet) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const isLocalDapplet = Object.prototype.hasOwnProperty.call(localDapplets.dapplets, item.name);
    const localDappletsList = isLocalDapplet
      ? localDapplets.dapplets
        .filter((dapp) => dapp !== item.name)
      : [...localDapplets.dapplets, item.name];
    console.log('localDappletsList', localDappletsList)
    const localDappletsListStringified = JSON.stringify({ name: localDapplets.name, dapplets: localDappletsList });
    window.localStorage.setItem(localDapplets.name, localDappletsListStringified);
    setLocalDapplets({ name: localDapplets.name, dapplets: localDappletsList });
    if (selectedList && selectedList.name === localDapplets.name) {
      setSelectedList({ name: localDapplets.name, dapplets: localDappletsList });
    }
  };

  const editSelectedDappletsList = (item: IDapplet) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const selected = Object.prototype.hasOwnProperty.call(selectedDapplets.dapplets, item.name);
    const selectedDappletsList = selected
      ? selectedDapplets.dapplets
        .filter((dapp) => dapp !== item.name)
      : [...selectedDapplets.dapplets, item.name];
    console.log('selectedDappletsList', selectedDappletsList)
    const selectedDappletsListStringified = JSON.stringify({ name: selectedDapplets.name, dapplets: selectedDappletsList });
    window.localStorage.setItem(selectedDapplets.name, selectedDappletsListStringified);
    setSelectedDapplets({ name: selectedDapplets.name, dapplets: selectedDappletsList });
    if (selectedList && selectedList.name === selectedDapplets.name) {
      setSelectedList({ name: selectedDapplets.name, dapplets: selectedDappletsList });
    }
  };

  const a = (
    <div
      style={{
        position: 'static',
        padding: '0 !important',
        margin: '0 !important',
      }}
    >
      <div
        style={{
          height: 'calc(100vh - 135px)',
          overflow: 'auto',
          padding: '0 !important',
          margin: '0 !important',
        }}
      >
        <div
          style={{
            display: 'flex',
            margin: '30px 35px 15px',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            height: 30,
          }}
        >
          <Header
            as="h2"
            className="infoTitle"
            size="medium"
            style={{
              flexGrow: 1,
            }}
          >
            {selectedList ? selectedList.name : 'Dapplets'}
          </Header>
          {!selectedList && (
            <Dropdown text={`Sort by: ${sortType}`} className="small-link">
              <Dropdown.Menu>
                <Dropdown.Item
                  text="A-Z"
                  onClick={() => setSortType('A-Z')}
                />
                <Dropdown.Item
                  text="Z-A"
                  onClick={() => setSortType('Z-A')}
                />
                <Dropdown.Item
                  text="Newest"
                  onClick={() => setSortType('Newest')}
                />
                <Dropdown.Item
                  text="Oldest"
                  onClick={() => setSortType('Oldest')}
                />
              </Dropdown.Menu>
            </Dropdown>
          )}
          {selectedList && (
            <button className="small-link" onClick={() => setSelectedList()}>
              Show all
            </button>
          )}
        </div>
        {list.sort((a, b) => {
          if (selectedList) return 0;
          if (sortType === 'A-Z') return collator.compare(a.title, b.title);
          if (sortType === 'Z-A') return collator.compare(b.title, a.title);
          if (sortType === 'Newest') return collator.compare(dappletsTransactions[b.name], dappletsTransactions[a.name]);
          return collator.compare(dappletsTransactions[a.name], dappletsTransactions[b.name]);
        }).map((item, i) => {
          return (
            <ItemDapplet
              key={i}
              item={item}
              dappletsVersions={dappletsVersions}
              selectedDapplets={selectedDapplets}
              setSelectedDapplets={setSelectedDapplets}
              localDapplets={localDapplets}
              setLocalDapplets={setLocalDapplets}
              selectedList={selectedList}
              setSelectedList={setSelectedList}
              dappletsTransactions={dappletsTransactions}
              editLocalDappletsList={editLocalDappletsList}
              editSelectedDappletsList={editSelectedDappletsList}
            />
          );
        })}
      </div>
    </div>
  )

  const showSortableList = {
    [Lists.Selected]: <SortableModule items={selectedList} setItems={editSelectedDappletsList}>{a}</SortableModule>,
    [Lists.Local]: <SortableModule items={localDapplets} setItems={editLocalDappletsList}>{a}</SortableModule>,
  }

  return selectedList ? showSortableList[selectedList.name] : a;
}

export default ListDapplets;
