import React from 'react';
import { SidePanelProps } from './SidePanel.props';
import cn from 'classnames';

import styles from './SidePanel.module.scss';
// import { TAGS } from '../../config/keywords';
import { Lists, IDappletsList } from '../../config/types';
import { saveListToLocalStorage } from '../../utils';
import DappletsListSidebar from '../../components/molecules/DappletsListSidebar'
import { DappletsListItemTypes } from '../../components/atoms/DappletsListItem'

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

  // const handleSwitchTag = (label: string) => (e: any) => {
  //   e.preventDefault();
  //   if (activeTags.includes(label)) {
  //     setActiveTags(activeTags.filter((tag) => tag !== label));
  //   } else {
  //     setActiveTags([...activeTags, label]);
  //   }
  // }

	return (
		<aside className={cn(styles.sidePanel, className)}>
      <div style={{
        height: 'calc(100vh - 70px)',
        overflow: 'auto',
        paddingBottom: '20px'
      }}>
        <div className={styles.content}>
          <DappletsListSidebar
            dappletsList={localDappletsList.dappletsNames.map((name) => ({
              title: name,
              type: DappletsListItemTypes.Default,
              onClickRemove: () => removeFromLocalList(name),
              isRemoved: true,
            })).slice(0, 5)}
            title={`My dapplets`}
            onOpenList={() => {
              setExpandedItems([]);
              setSelectedList(Lists.Local);
            }}
            isMoreShow={localDappletsList.dappletsNames.length > 5}
          />

          {/* <DappletsListSidebar
            dappletsList={localDappletsList.dappletsNames.map((name) => ({
              title: name,
              type: DappletsListItemTypes.Adding,
              onClickRemove: () => removeFromLocalList(name),
              isRemoved: true,
            })).slice(0, 5)}
            title={`My Listing`}
            onOpenList={() => {
              setExpandedItems([]);
              setSelectedList(Lists.Local);
            }}
            isMoreShow={localDappletsList.dappletsNames.length > 5}
            titleButton={{
              title: 'Push changes',
              onClick: () => console.log('push')
            }}
          /> */}

          <DappletsListSidebar
            dappletsList={[]}
            title={`My Listing`}
            onOpenList={() => {}}
            isMoreShow={false}
          />

          <DappletsListSidebar
            dappletsList={[]}
            title={`My trusted users`}
            onOpenList={() => {}}
            isMoreShow={false}
          />

          <DappletsListSidebar
            dappletsList={[]}
            title={`Popular tags`}
            onOpenList={() => {}}
            isMoreShow={false}
          />

          {/* <div>
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
          </div> */}

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
