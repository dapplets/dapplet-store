import React, { useState } from 'react';
import { Button, List, Image, Header, } from 'semantic-ui-react';
import { TAGS } from '../../config/TAGS';
import { ethers } from 'ethers';

import styles from './ItemDapplet.module.scss';
import { ItemDappletProps } from './ItemDapplet.props';

function ItemDapplet(props: ItemDappletProps): React.ReactElement {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [install, setInstall] = useState<boolean>(false);

  const { item, dappletsVersions } = props;

  const handlerOpen = ({ target }: any) => {
    target.tagName !== 'BUTTON' && setOpen(v => !v);
  };

  const onInstallDapplet = () => setInstall(v => !v);

  const owner = item.owner.replace('0x000000000000000000000000', '0x');

  const icon = {
    hash: item.icon.hash,
    uris: item.icon.uris.map(u => ethers.utils.toUtf8String(u))
  };

  return (
    <List.Item className={styles.item} onClick={handlerOpen}>
      <div className={styles.itemContainer}>
        <Image src={`https://bee.dapplets.org/bzz/${icon.uris[0].slice(6)}`} style={{ width: 46, height: 46, borderRadius: '99em', marginTop: 10 }} />

        <div className={styles.left} style={{ flexGrow: 1, padding: '5px 18px' }}>
          <Header as="h5">{item.title}</Header>

          <div className={styles.author}>
            {item.description}
          </div>

          <div className={styles.author}>
            <i><b>Author: </b></i><a href={owner}>{owner}</a>
          </div>

          {isOpen && (
            <>
              <div className={styles.author}>
                <i><b>Full name: </b></i>{item.name}
              </div>
              <div className={styles.author}>
                <i><b>Version: </b></i>{dappletsVersions[item.name][dappletsVersions[item.name].length - 1]}
              </div>
            </>
          )}
        </div>

        <div className={styles.right} style={{ marginTop: 21 }}>
          <Button
            color={install ? 'blue' : 'red'}
            size="big"
            style={{ padding: '3px 10px' }}
            onClick={onInstallDapplet}
          >
            {install ? 'REMOVE' : 'ADD'}
          </Button>
        </div>
      </div>

      {/*<div className={styles.tags}>
        <List horizontal floated="right">
          {
            item.tags.map((item) => {
              const getTag = TAGS.filter(el => el.id === item)[0];
              return (
                <List.Item key={item} style={{ marginLeft: 0, marginRight: 10 }}>
                  <Button size="mini" color="green" style={{ padding: '3px', margin: 0 }}>
                    {getTag.label}
                  </Button>
                </List.Item>

              );
            })
          }
        </List>

        </div>*/}
    </List.Item>
  );
}

export default ItemDapplet;
