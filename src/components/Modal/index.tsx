import cn from 'classnames'
import React, { ReactElement, useEffect } from 'react'
import { ReactComponent as Close } from '../../images/modalClose.svg'
import styles from './Modal.module.scss'

interface ModalProps {
  visible: boolean
  title?: string
  content?: ReactElement | string
  footer?: ReactElement | string
  onClose: () => void
  className?: string
  classNameWrapper?: string
  id?: any
  classNameContent?: string
  onFewFunction?: any
  wrapperModalStyles?: string
}

export const Modal = ({
  visible = false,
  title = '',
  content = '',
  footer = '',
  onClose,
  className,
  classNameWrapper,
  classNameContent,
  onFewFunction,
  wrapperModalStyles,
}: ModalProps) => {
  const onKeydown = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'Escape':
        onClose()
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  })

  if (!visible) return null

  return (
    <div className={cn(styles.modal, wrapperModalStyles)} onClick={onClose}>
      <div
        className={cn(styles.modalDialog, classNameWrapper)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={cn(styles.modalTitle, className)}>{title}</h3>
          {onClose ? (
            <span
              className={styles.modalClose}
              onClick={() => {
                onFewFunction ? onFewFunction() : null
                onClose()
              }}
            >
              <Close />
            </span>
          ) : null}
        </div>
        <div className={cn(styles.modalBod, classNameContent)}>
          {content && <div className={styles.modalContent}>{content}</div>}
        </div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  )
}
