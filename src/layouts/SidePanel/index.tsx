import React from 'react';
import { SidePanelProps } from './SidePanel.props';
import cn from 'classnames';

import styles from './SidePanel.module.scss';
import { Button, Header, List } from 'semantic-ui-react';
import { TAGS } from '../../config/keywords';

export function SidePanel({
  className,
  localDapplets,
  setLocalDapplets,
  selectedList,
  setSelectedList
}: SidePanelProps): React.ReactElement {

  const removeFromLocalList = (name: string) => (e: any) => {
    e.preventDefault();
    const localDappletsList = Object.keys(localDapplets.dapplets)
        .filter((dapp) => dapp !== name)
        .reduce((acc, key) => ({ ...acc, [key]: localDapplets.dapplets[key] }), {});
    const localDappletsListStringified = JSON.stringify({ name: localDapplets.name, dapplets: localDappletsList});
    window.localStorage.setItem(localDapplets.name, localDappletsListStringified);
    setLocalDapplets({ name: localDapplets.name, dapplets: localDappletsList});
  }

	return (
		<div className={cn(styles.sidePanel, className)}>
      <div style={{
        height: 'calc(100vh - 70px)',
        overflow: 'auto',
        paddingBottom: '20px'
      }}>

        <div className={styles.content}>
          <div className={styles.info}>
            <div style={{ marginTop: 28 }}>
              <Header
                as="h4"
                className={cn('infoTitle', 'link')}
                size="medium"
                onClick={() => setSelectedList(localDapplets)}
              >
                My dapplets ({Object.keys(localDapplets.dapplets).length})
              </Header>
              {Object.entries(localDapplets.dapplets).map(([name, title], i) => (
                <div style={{ display: 'flex', margin: 10 }} key={i + 1000}>
                  <a href="#" className={styles.infoLink}>{title}</a>
                  <button
                    className='clearInput'
                    style={{ background: 'none !important' }}
                    onClick={removeFromLocalList(name)}
                  >
                    <span />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28 }}>
              <Header as="h4" className='infoTitle' size="medium">My lists</Header>
            </div>

            <div style={{ marginTop: 28 }}>
              <Header as="h4" className='infoTitle' size="medium">Subscriptions</Header>
              <a href="#" className={styles.infoLink}>Essential Dapplets <span>(Dapplets Team)</span></a>
            </div>
          </div>
        </div>

        <div className={cn(styles.tags, styles.content)}>
          <Header as="h4" className='infoTitle' size="medium">Keywords:</Header>

          <List horizontal>
            {
              TAGS.map(({ id, label }) => {
                return (
                  <List.Item key={id} style={{ marginLeft: 0, marginRight: 10 }}>
                    <Button size="mini" color="green"
                      style={{ padding: '3px', margin: 0 }}
                    >
                      {label}
                    </Button>
                  </List.Item>
                );
              })
            }
          </List>
        </div>

      </div>
		</div>
	);
}
