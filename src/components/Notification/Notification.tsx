import React, { FC } from 'react'
import { ReactComponent as CheckError } from './check-erorr.svg'
import { ReactComponent as Loader } from './loader.svg'
import { ReactComponent as Installed } from './installed.svg'
import cn from 'classnames'
import { net } from '../../api/constants'
import './Notification.scss'

const HEADER_MESSAGES = {
  success: (
    <React.Fragment>
      <Installed />
      <h6 className="notification-custom-title finished">Transaction finished</h6>
    </React.Fragment>
  ),
  error: (
    <React.Fragment>
      <CheckError />
      <h6 className="notification-custom-title error">Transaction error</h6>
    </React.Fragment>
  ),
  loading: (
    <React.Fragment>
      <Loader className="notification-custom-animate" />
      <h6 className="notification-custom-title started">Transaction started</h6>
    </React.Fragment>
  ),
}

interface SuccessToastProps {
  hash: string | null
  type: 'success' | 'error' | 'loading'
  messageError?: string
}

export const Notification: FC<SuccessToastProps> = ({
  hash,
  type,
  messageError: messageErrror,
}) => {
  const isLoading = type === 'loading'
  const isSuccess = type === 'success'
  const isError = type === 'error'

  return (
    <div
      className={cn('notification-custom-wrapper', {
        'notification-custom-error': isError,
        'notification-custom-loading': isLoading,
        'notification-custom-success': isSuccess,
      })}
    >
      <header className={cn('notification-custom-header')}>{HEADER_MESSAGES[type]}</header>
      <p className={cn('notification-custom-text')}>
        {hash && hash.length > 0 && (
          <React.Fragment>
            You can track your transaction
            <a
              href={`https://${net.toLowerCase()}.etherscan.io/tx/${hash}`}
              className="notification-custom-link"
              target="_blank"
              rel="noreferrer"
            >
              Show More
            </a>
          </React.Fragment>
        )}

        {isError && messageErrror && messageErrror.length > 0 && (
          <span className="notification-custom-text-error">{messageErrror}</span>
        )}
      </p>
    </div>
  )
}
