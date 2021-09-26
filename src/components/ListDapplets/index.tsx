import React from 'react';
import { Button, Header, List, } from 'semantic-ui-react';

import { ListDappletsProps } from './ListDapplets.props';
import ItemDapplet from '../ItemDapplet';

function ListDapplets({
  list,
  dappletsVersions,
  setSelectedDapplets,
  selectedDapplets,
  localDapplets,
  setLocalDapplets,
  selectedList,
  setSelectedList,
}: ListDappletsProps): React.ReactElement {
  return (
    <div style={{
      position: 'static',
      padding: '0 !important',
      margin: '0 !important'
    }}>
      <div style={{
        height: 'calc(100vh - 135px)',
        overflow: 'auto',
        padding: '0 !important',
        margin: '0 !important'
      }}>
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
            className='infoTitle'
            size="medium"
          >
            {selectedList ? selectedList.name : 'Dapplets'}
          </Header>
          {selectedList && (
            <button
              className='small-link'
              onClick={() => setSelectedList()}
            >
              Show all
            </button>
          )}
        </div>
        {
          list.map((item, i) => {
            return <ItemDapplet
              key={i}
              item={item}
              dappletsVersions={dappletsVersions}
              selectedDapplets={selectedDapplets}
              setSelectedDapplets={setSelectedDapplets}
              localDapplets={localDapplets}
              setLocalDapplets={setLocalDapplets}
              selectedList={selectedList}
              setSelectedList={setSelectedList}
            />;
          })
        }
      </div>
    </div>
  );
}

export default ListDapplets;
