import React from 'react';
import cn from 'classnames';
import { OverlayProps } from './Overlay.props';
import { Button, Divider, Header, Input, Message } from 'semantic-ui-react';

import styles from './Overlay.module.scss';
import { Lists, IDappletsList } from '../../config/types';
import { saveListToLocalStorage } from '../../utils';

export function Overlay({
  dappletTitles,
  className,
  selectedDappletsList,
  setSelectedDappletsList,
  selectedList,
  setSelectedList,
  setExpandedItems,
}: OverlayProps): React.ReactElement {

  const removeFromSelectedDappletsList = (name: string) => (e: any) => {
    e.preventDefault();
    const list = selectedDappletsList.dappletsNames
        .filter((dapp) => dapp !== name);
    const newSelectedDappletsList: IDappletsList = { listName: selectedDappletsList.listName, dappletsNames: list };
    saveListToLocalStorage(newSelectedDappletsList);
    setSelectedDappletsList(newSelectedDappletsList);
  }

  const editDecentralizedList = (e: any) => {
    e.preventDefault();
    window.localStorage.removeItem(selectedDappletsList.listName);
    setSelectedDappletsList({ name: selectedDappletsList.listName, dapplets: [] });
  }

	return (
		<aside className={cn(styles.overlay, className)}>
      <div style={{
        height: 'calc(100vh - 70px)',
        overflow: 'auto',
        paddingBottom: '20px'
      }}>

        {selectedDappletsList.dappletsNames.length > 0 && (
          <div className={styles.content}>
            <div className={styles.info}>
              <div style={{ marginTop: 28 }}>
                <Header
                  as="h4"
                  className={cn('infoTitle', 'link')}
                  size="medium"
                  onClick={() => {
                    setExpandedItems([]);
                    setSelectedList(Lists.Selected);
                  }}
                >
                  Selected dapplets ({selectedDappletsList.dappletsNames.length})
                </Header>
                {dappletTitles && selectedDappletsList.dappletsNames.map((name, i) => (
                  <div style={{ display: 'flex', margin: 10 }} key={i}>
                    <button className={styles.infoLink}>{dappletTitles[name]}</button>
                    <button
                      className='clearInput'
                      style={{ background: 'none !important' }}
                      onClick={removeFromSelectedDappletsList(name)}
                    >
                      <span />
                    </button>
                  </div>
                ))}
                <Input
                  type='text'
                  placeholder='Name the list'
                  action
                  style={{
                    margin: '20px',
                    width: 'calc(100% - 40px)'
                  }}
                >
                  <input />
                  <Button
                    onClick={editDecentralizedList}
                  >
                    Add
                  </Button>
                </Input> 
              </div>
            </div>
          </div>
        )}

        <Message size='large'	className={styles.message}>
          <h2>
            Try out brand new web experience
          </h2>
          <Divider style={{ width: '50%', margin: '1.5em 0' }} />
          <div className={styles.messageContent}>
            You need to install the main
            application for using dapplets.
          </div>
          <Button
            size='large'
            className={styles.messageButton}
            onClick={(e) => {
              e.preventDefault();
              window.open('https://github.com/dapplets/dapplet-extension/releases/latest/download/dapplet-extension.zip', '_blank');
            }}>
            Download
          </Button>
          <a href='https://docs.dapplets.org/docs/installation' target='_blank' rel='noreferrer'>
            How to install  <svg height="10" width="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4.53657 8.69699" className="css-b7q1rs">
              <path d="M.18254,8.697a.18149.18149,0,0,1-.12886-.31034L4.09723,4.34126.05369.29954a.18149.18149,0,0,1,.2559-.2559L4.4838,4.21785a.18149.18149,0,0,1,0,.2559L.30958,8.648A.18149.18149,0,0,1,.18254,8.697Z" fill="currentColor">
              </path>
            </svg>
          </a>
        </Message>

      </div>
    </aside>
	);
}
