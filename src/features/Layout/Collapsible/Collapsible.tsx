import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { ReactComponent as CollapseIcon } from '../../../images/arrow-down.svg'
import styled from 'styled-components/macro'

type CollapsibleProps = {
  isOpen?: boolean
  onToggle: () => void
  title: string | ReactNode
  children: ReactNode
  maxHeight?: number
}

const Prefix = styled.span`
  width: 14px;
  display: inline-block;
`

const Container = styled.div`
  overflow-y: auto;
  transition: height 0.2s ease-in-out;
`

const Content = styled.div`
  padding-left: 30px;
  overflow: auto;
  padding-right: 15px;
`

const Label = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  & svg {
    transition: transform 0.1s;
  }
`

const CollapseIndicator = styled.div`
  position: absolute;
  left: -14px;
  display: flex;
  align-items: center;
  height: 100%;
`

const Collapsible: React.FC<CollapsibleProps> = ({
  isOpen,
  onToggle,
  children,
  title,
  maxHeight = undefined,
}) => {
  const [isSelfOpen, setIsSelfOpen] = useState(false)
  const openState = isOpen || isSelfOpen

  const [height, setHeight] = useState<number | undefined>(openState ? undefined : 0)

  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggle = () => {
    if (onToggle) onToggle()
    else setIsSelfOpen((prev) => !prev)
  }

  useEffect(() => {
    if (!height || !openState || !ref.current) return undefined

    const resizeObserver = new ResizeObserver((el) => {
      setHeight(el[0].contentRect.height)
    })

    resizeObserver.observe(ref.current)

    /* hide scroll until the container become overflown */
    if (containerRef.current) {
      containerRef.current.style.overflow = `${
        height && maxHeight && height <= maxHeight ? 'hidden' : 'auto'
      }`
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [height, maxHeight, openState])

  useEffect(() => {
    if (openState) setHeight(ref.current?.getBoundingClientRect().height)
    else setHeight(0)
  }, [openState])

  return (
    <div>
      <Label onClick={toggle}>
        <CollapseIndicator>
          {openState ? <CollapseIcon style={{ transform: 'rotate(-180deg)' }} /> : <CollapseIcon />}
        </CollapseIndicator>
        {title}
      </Label>
      <Container
        ref={containerRef}
        style={{
          height,
          maxHeight: `${maxHeight}px`,
        }}
      >
        <div ref={ref}>
          <Content>{children}</Content>
        </div>
      </Container>
    </div>
  )
}

export default Collapsible
