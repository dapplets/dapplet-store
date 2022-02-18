import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import cn from 'classnames';
import { Button, Divider, Message } from 'semantic-ui-react';

import styles from './Overlay.module.scss';

interface OverlayProps {
  isNotDapplet: boolean
}

const Overlay = ({
  className,
  isNotDapplet,
}: OverlayProps & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  if (!isNotDapplet) {
    return (
      <aside className={cn(styles.overlay, className)}></aside>
    )
  }

	return (
		<aside className={cn(styles.overlay, className)}>
      <div style={{
        height: 'calc(100vh - 70px)',
        overflow: 'auto',
        paddingBottom: '20px'
      }}>

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

export default Overlay
