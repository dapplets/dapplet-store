import React from 'react';
import cn from 'classnames';
import { Button, Checkbox, Image } from 'semantic-ui-react';
import { ethers } from 'ethers';

import styles from './ItemDapplet.module.scss';
import { ItemDappletProps } from './ItemDapplet.props';

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

  const selected = selectedDapplets.dappletsNames.includes(item.name);
  const isLocalDapplet = localDapplets.dappletsNames.includes(item.name);

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
      <Checkbox
        style={{
          margin: '25px 18px 0 0'
        }}
        checked={selected}
        onChange={editSelectedDappletsList(item)}
      />
      <Image className={styles.itemImage} src={`https://bee.dapplets.org/bzz/${icon.uris[0].slice(6)}`} style={{ width: 46, height: 46, borderRadius: '99em', marginTop: 10 }} />

      <div className={styles.left} style={{ flexGrow: 1, padding: '5px 18px' }}>
        <h3 className={styles.title}>{item.title}</h3>

        <div className={styles.author}>
          {item.description}
        </div>

        <div className={styles.author}>
          Author: <a href={owner}>{owner}</a>
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

      <div className={styles.right}>
        <Button
          size="large"
          style={{ padding: '3px 10px' }}
          onClick={editLocalDappletsList(item)}
          className={cn(styles.button, isLocalDapplet ? styles.remove : styles.add)}
        >
          {isLocalDapplet ? 'Remove' : 'Add'}
        </Button>
      </div>
    </div>
  );
};

export default ItemDapplet;
