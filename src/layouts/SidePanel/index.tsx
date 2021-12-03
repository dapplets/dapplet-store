import React from 'react';
import { SidePanelProps } from './SidePanel.props';
import cn from 'classnames';

import styles from './SidePanel.module.scss';
import { Button, Header, List } from 'semantic-ui-react';
import { TAGS } from '../../config/keywords';
import { Lists, IDappletsList } from '../../config/types';
import { saveListToLocalStorage } from '../../utils';

export function SidePanel({
  dappletTitles,
  className,
  localDappletsList,
  setLocalDappletsList,
  setSelectedList,
  activeTags,
  setActiveTags,
  setExpandedItems,
}: SidePanelProps): React.ReactElement {

  const removeFromLocalList = (name: string) => (e: any) => {
    e.preventDefault();
    const list = localDappletsList.dappletsNames
      .filter((dapp) => dapp !== name);
    // console.log('localDappletsList', localDappletsList)
    const newLocalDappletsList: IDappletsList = { listName: localDappletsList.listName, dappletsNames: list };
    // console.log('newLocalDappletsList', newLocalDappletsList)
    saveListToLocalStorage(newLocalDappletsList);
    setLocalDappletsList(newLocalDappletsList);
  }

  const handleSwitchTag = (label: string) => (e: any) => {
    e.preventDefault();
    if (activeTags.includes(label)) {
      setActiveTags(activeTags.filter((tag) => tag !== label));
    } else {
      setActiveTags([...activeTags, label]);
    }
  }

	return (
		<aside className={cn(styles.sidePanel, className)}>
      <div style={{
        height: 'calc(100vh - 70px)',
        overflow: 'auto',
        paddingBottom: '20px'
      }}>
        <div className={styles.content}>
          <div>
            <Header
              as="h4"
              className={cn('infoTitle', 'link')}
              size="medium"
              onClick={() => {
                setExpandedItems([]);
                setSelectedList(Lists.Local);
              }}
            >
              My dapplets ({localDappletsList.dappletsNames.length})
            </Header>
            {dappletTitles && localDappletsList.dappletsNames.map((name, i) => (
              <div style={{ display: 'flex', margin: 10 }} key={i + 1000}>
                <button className={styles.infoLink}>{dappletTitles[name]}</button>
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

          <div>
            <Header as="h4" className='infoTitle' size="medium">My lists</Header>
          </div>

          <div>
            <Header as="h4" className='infoTitle' size="medium">Subscriptions</Header>
            <button className={styles.infoLink}>Essential Dapplets <span>(Dapplets Team)</span></button>
          </div>

          <div>
            <Header as="h4" className='infoTitle' size="medium">Keywords:</Header>
            <List horizontal>
              {
                TAGS.map(({ id, label }) => {
                  return (
                    <List.Item key={id} style={{ marginLeft: 0, marginRight: 10 }}>
                      <Button
                        size="tiny"
                        color={activeTags.includes(label) ? 'orange' : 'green'}
                        style={{ padding: '3px', margin: 0 }}
                        onClick={handleSwitchTag(label)}
                      >
                        {label}
                      </Button>
                    </List.Item>
                  );
                })
              }
            </List>
          </div>

          <div className={styles.footer}>
            <a href='https://dapplets.org/terms-conditions.html'>
              Terms & Conditions
            </a>
            <a href='https://dapplets.org/privacy-policy.html'>
              Privacy Policy
            </a>
            <a href='https://dapplets.org/index.html'>
              About
            </a>
            <a href='https://forum.dapplets.org'>
              Forum
            </a>
            <a href='https://docs.dapplets.org'>
              Docs
            </a>
            <p>© 2019—2021 Dapplets Project</p>
          </div>

        </div>
      </div>
		</aside>
	);
}
