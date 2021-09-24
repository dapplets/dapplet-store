import React, { useState } from 'react';
import cn from 'classnames';
import { Button, Checkbox, Image, List } from 'semantic-ui-react';
import { ethers } from 'ethers';

import styles from './ItemDapplet.module.scss';
import { ItemDappletProps } from './ItemDapplet.props';

export default (props: ItemDappletProps): React.ReactElement => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { item, dappletsVersions, selectedDapplets, setSelectedDapplets, localDapplets, setLocalDapplets } = props;

  const selected = Object.prototype.hasOwnProperty.call(selectedDapplets.dapplets, item.name);
  const isLocalDapplet = Object.prototype.hasOwnProperty.call(localDapplets.dapplets, item.name);

  const handlerOpen = ({ target }: any) => {
    target.tagName !== 'BUTTON' && setOpen(v => !v);
  };

  const editLocalDappletsList = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const localDappletsList = isLocalDapplet
      ? Object.keys(localDapplets.dapplets)
        .filter((dapp) => dapp !== item.name)
        .reduce((acc, key) => ({ ...acc, [key]: localDapplets.dapplets[key] }), {})
      : { ...localDapplets.dapplets, [item.name]: item.title };
    const localDappletsListStringified = JSON.stringify({ name: localDapplets.name, dapplets: localDappletsList });
    window.localStorage.setItem(localDapplets.name, localDappletsListStringified);
    setLocalDapplets({ name: localDapplets.name, dapplets: localDappletsList });
  };

  const editSelectedDappletsList = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedDappletsList = selected
      ? Object.keys(selectedDapplets.dapplets)
        .filter((dapp) => dapp !== item.name)
        .reduce((acc, key) => ({ ...acc, [key]: selectedDapplets.dapplets[key] }), {})
      : { ...selectedDapplets.dapplets, [item.name]: item.title };
    const selectedDappletsListStringified = JSON.stringify({ name: selectedDapplets.name, dapplets: selectedDappletsList });
    window.localStorage.setItem(selectedDapplets.name, selectedDappletsListStringified);
    setSelectedDapplets({ name: selectedDapplets.name, dapplets: selectedDappletsList });
  };

  const owner = item.owner.replace('0x000000000000000000000000', '0x');

  const icon = {
    hash: item.icon.hash,
    uris: item.icon.uris.map(u => ethers.utils.toUtf8String(u))
  };

  return (
    <List.Item className={styles.item} onClick={handlerOpen}>
      <div className={styles.itemContainer}>
        <Checkbox
          style={{
            margin: '25px 18px 0 0'
          }}
          checked={selected}
          onChange={editSelectedDappletsList}
        />
        <Image className={styles.itemImgage} src={`https://bee.dapplets.org/bzz/${icon.uris[0].slice(6)}`} style={{ width: 46, height: 46, borderRadius: '99em', marginTop: 10 }} />

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
                Version: {dappletsVersions[item.name][dappletsVersions[item.name].length - 1]}
              </div>
            </>
          )}
        </div>

        <div className={styles.right}>
          <Button
            size="large"
            style={{ padding: '3px 10px' }}
            onClick={editLocalDappletsList}
            className={cn(styles.button, isLocalDapplet ? styles.remove : styles.add)}
          >
            {isLocalDapplet ? 'Remove' : 'Add'}
          </Button>
        </div>
      </div>
    </List.Item>
  );
};
