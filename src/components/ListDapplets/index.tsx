import React from 'react';
import { List, } from 'semantic-ui-react';

import { ListDappletsProps } from './ListDapplets.props';
import ItemDapplet from '../ItemDapplet';

function ListDapplets({ list }: ListDappletsProps): React.ReactElement {
  return (
    <List>
      {
        list.map((item) => {
          return <ItemDapplet key={item.id} item={item} />;
        })
      }
    </List>
  );
}

export default ListDapplets;
