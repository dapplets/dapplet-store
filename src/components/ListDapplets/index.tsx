import React from 'react';
import { List, } from 'semantic-ui-react';

import { ListDappletsProps } from './ListDapplets.props';
import ItemDapplet from '../ItemDapplet';

function ListDapplets({ list, dappletsVersions }: ListDappletsProps): React.ReactElement {
  return (
    <List>
      {
        list.map((item, i) => {
          return <ItemDapplet key={i} item={item} dappletsVersions={dappletsVersions}  />;
        })
      }
    </List>
  );
}

export default ListDapplets;
