import React, { useState } from 'react';
import { Button, List, Image, Header, } from 'semantic-ui-react';
import { TAGS } from '../../config/TAGS';

import styles from './ItemDapplet.module.scss';
import { ItemDappletProps } from './ItemDapplet.props';

function ItemDapplet({ item }: ItemDappletProps): React.ReactElement {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [install, setInstall] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlerOpen = ({ target }: any) => {
    target.tagName !== 'BUTTON' && setOpen(v => !v);
  };

  const onInstallDapplet = () => setInstall(v => !v);

  return (
    <List.Item className={styles.item} onClick={handlerOpen}>
      <div className={styles.itemContainer}>
        <Image src={item.icon} circular style={{ width: 52 }} />

        <div className={styles.block}>
          <div className={styles.top}>

            <div className={styles.left}>
              <Header as="h5">{item.title}</Header>
              <div className={styles.author}>
                <span>Author: </span>
                <a href={item.author}>{item.author}</a>
              </div>
              {isOpen && <span className={styles.id}>ID: {item.id}</span>}
            </div>

            <div className={styles.right}>
              {item.version && <span className={styles.version}>{item.version}</span>}
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

          <p className={styles.description}>
            {isOpen ? (
              <React.Fragment>
                <span className={styles.detailedTitle}>Detailed Description:</span>
                {item.detailedDescription}
              </React.Fragment>
            ) : item.shortDescription}
          </p>

        </div>
      </div>

      <div className={styles.tags}>
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

      </div>
    </List.Item>
  );
}

export default ItemDapplet;
