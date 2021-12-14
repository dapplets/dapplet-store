import React, { useState } from 'react';
import { Dropdown, Header } from 'semantic-ui-react';

import { IDapplet, IDappletsList, IDappletsListElement, Lists } from '../../config/types';
import { saveListToLocalStorage } from '../../utils';

import { ListDappletsProps } from './ListDapplets.props';
import styles from './ListDapplets.module.scss';
import SortableList from '../SortableList';
import ItemDapplet from '../ItemDapplet';
import { DappletsListItemTypes } from '../atoms/DappletsListItem'

function ListDapplets({
  dapplets,
  dappletsVersions,
  setSelectedDapplets,
  selectedDapplets,
  localDapplets,
  setLocalDapplets,
  selectedList,
  setSelectedList,
  dappletsTransactions,
  expandedItems,
  setExpandedItems,
}: ListDappletsProps): React.ReactElement {

  const [sortType, setSortType] = useState('A-Z');
  const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

  const editList = (item: IDapplet, dappletsList: IDappletsList, type: DappletsListItemTypes) => {
    const isLocalDapplet = dappletsList.dapplets.some((dapplet) => dapplet.name === item.name);
    const nowDappletsList = isLocalDapplet
      ? dappletsList.dapplets
        .filter((dapplet) => dapplet.name !== item.name)
      : [...dappletsList.dapplets, {name: item.name, type}];
    const newDappletsList: IDappletsList = { listName: dappletsList.listName, dapplets: nowDappletsList };
    return newDappletsList
  } 

  const editLocalDappletsList = (item: IDapplet) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const newLocalDappletsList = editList(item, localDapplets, DappletsListItemTypes.Default)
    saveListToLocalStorage(newLocalDappletsList);
    setLocalDapplets(newLocalDappletsList);
  };

  const editSelectedDappletsList = (item: IDapplet) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    let nowDappletsList: IDappletsListElement[] = selectedDapplets.dapplets
    const dappletListIndex = nowDappletsList.findIndex((dapplet) => dapplet.name === item.name);
    if (dappletListIndex >= 0) {
      if (nowDappletsList[dappletListIndex].type === DappletsListItemTypes.Default)
        nowDappletsList[dappletListIndex].type = DappletsListItemTypes.Removing
    } else {
      nowDappletsList = [...nowDappletsList, {name: item.name, type: DappletsListItemTypes.Adding}]
    }
    const newDappletsList: IDappletsList = { listName: selectedDapplets.listName, dapplets: nowDappletsList };
    saveListToLocalStorage(newDappletsList);
    setSelectedDapplets(newDappletsList);
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
        <button className="small-link" onClick={() => {
          setExpandedItems([]);
          setSelectedList(undefined);
        }}>
          Show all
        </button>
      )}
    </div>
  );

  const sortedDapplets = dapplets
    .sort((a, b) => {
      if (selectedList) return 0;
      if (sortType === 'A-Z') return collator.compare(a.title, b.title);
      if (sortType === 'Z-A') return collator.compare(b.title, a.title);
      if (sortType === 'Newest') return collator.compare(dappletsTransactions[b.name], dappletsTransactions[a.name]);
      return collator.compare(dappletsTransactions[a.name], dappletsTransactions[b.name]);
    });

  const chooseList = {
    [Lists.Selected]: selectedDapplets,
    [Lists.Local]: localDapplets,
  }

  const chooseSetMethod = {
    [Lists.Selected]: setSelectedDapplets,
    [Lists.Local]: setLocalDapplets,
  }

  return (
    <article
      style={{
        position: 'static',
        padding: '0 !important',
        margin: '0 !important',
      }}
    >
      <div
        style={{
          height: 'calc(100vh - 206px)',
          overflow: 'auto',
          padding: '0 !important',
          margin: '0 !important',
        }}
      >
        {listDappletsHeader}
        {selectedList
          ? <SortableList
            dapplets={dapplets}
            items={chooseList[selectedList]}
            setItems={chooseSetMethod[selectedList]}
            dappletsVersions={dappletsVersions}
            selectedDapplets={selectedDapplets}
            localDapplets={localDapplets}
            dappletsTransactions={dappletsTransactions}
            editLocalDappletsList={editLocalDappletsList}
            editSelectedDappletsList={editSelectedDappletsList}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
          />
          : sortedDapplets
            .map((item, i) => (
              <section className={styles.item} key={i}>
                <div className={styles.itemContainer}>
                  <ItemDapplet
                    key={item.name}
                    item={item}
                    dappletsVersions={dappletsVersions}
                    selectedDapplets={selectedDapplets}
                    localDapplets={localDapplets}
                    dappletsTransactions={dappletsTransactions}
                    editLocalDappletsList={editLocalDappletsList}
                    editSelectedDappletsList={editSelectedDappletsList}
                    expandedItems={expandedItems}
                    setExpandedItems={setExpandedItems}
                  />
                </div>
              </section>
            )
          )}
      </div>
    </article>
  );
}

export default ListDapplets;
