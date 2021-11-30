import React, { useState,  SetStateAction } from 'react';
import { Dropdown, Header } from 'semantic-ui-react';

import { ListDappletsProps } from './ListDapplets.props';
import ItemDapplet from '../ItemDapplet';
import Item from '../SortableOverlayItem/Item';
import { IDapplet, IDappletsList, Lists } from '../../config/types';
import { saveListToLocalStorage } from '../../utils';
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
    const isLocalDapplet = localDapplets.dappletsNames.includes(item.name);
    const localDappletsList = isLocalDapplet
      ? localDapplets.dappletsNames
        .filter((dapp) => dapp !== item.name)
      : [...localDapplets.dappletsNames, item.name];
    // console.log('localDappletsList', localDappletsList)
    const newLocalDappletsList: IDappletsList = { listName: localDapplets.listName, dappletsNames: localDappletsList };
    saveListToLocalStorage(newLocalDappletsList);
    setLocalDapplets(newLocalDappletsList);
    // if (selectedList && selectedList === localDapplets.name) {
    //   setSelectedList(localDapplets.name);
    // }
  };

  const editSelectedDappletsList = (item: IDapplet) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const selected = selectedDapplets.dappletsNames.includes(item.name);
    const selectedDappletsList = selected
      ? selectedDapplets.dappletsNames
        .filter((dapp) => dapp !== item.name)
      : [...selectedDapplets.dappletsNames, item.name];
    // console.log('selectedDappletsList', selectedDappletsList)
    const newSelectedDappletsList: IDappletsList = { listName: selectedDapplets.listName, dappletsNames: selectedDappletsList };
    saveListToLocalStorage(newSelectedDappletsList);
    setSelectedDapplets(newSelectedDappletsList);
    // if (selectedList && selectedList === selectedDapplets.name) {
    //   setSelectedList(selectedDapplets.name);
    // }
  };

  const listDappletsHeader = (
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
        {selectedList ? selectedList : 'Dapplets'}
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
        <button className="small-link" onClick={() => setSelectedList(undefined)}>
          Show all
        </button>
      )}
    </div>
  );

  const sortedDapplets = list
    .sort((a, b) => {
      if (selectedList) return 0;
      if (sortType === 'A-Z') return collator.compare(a.title, b.title);
      if (sortType === 'Z-A') return collator.compare(b.title, a.title);
      if (sortType === 'Newest') return collator.compare(dappletsTransactions[b.name], dappletsTransactions[a.name]);
      return collator.compare(dappletsTransactions[a.name], dappletsTransactions[b.name]);
    })
    .map((item, i) =>
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

  const chooseList = {
    [Lists.Selected]: selectedDapplets,
    [Lists.Local]: localDapplets,
  }

  const chooseSetMethod = {
    [Lists.Selected]: setSelectedDapplets,
    [Lists.Local]: setLocalDapplets,
  }

  return (
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
        {listDappletsHeader}
        {selectedList
          ? <SortableModule items={chooseList[selectedList]} setItems={chooseSetMethod[selectedList]}>{sortedDapplets}</SortableModule>
          : sortedDapplets}
      </div>
    </div>
  );
}

export default ListDapplets;
