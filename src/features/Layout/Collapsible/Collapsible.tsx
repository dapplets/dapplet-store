import React, { ReactNode, useEffect, useRef, useState } from "react";
import styled from "styled-components";

type CollapsibleProps = {
  isOpen?: boolean;
  onToggle: () => void;
  title: string | ReactNode;
  children: ReactNode;
  maxHeight?: number;
};

const Prefix = styled.span`
  width: 14px;
  display: inline-block;
`;

const Container = styled.div`
  overflow-y: auto;
  transition: height 0.2s ease-in-out;
`;

const Content = styled.div`
  padding-left: 30px;
  padding-top: 10px;
  overflow: auto;
  padding-right: 15px;
`;

const Collapsible: React.FC<CollapsibleProps> = ({
  isOpen,
  onToggle,
  children,
  title,
  maxHeight = undefined,
}) => {
  const [isSelfOpen, setIsSelfOpen] = useState(false);
  const openState = isOpen || isSelfOpen;

  const [height, setHeight] = useState<number | undefined>(
    openState ? undefined : 0,
  );

  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (onToggle) onToggle();
    else setIsSelfOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!height || !openState || !ref.current) return undefined;

    const resizeObserver = new ResizeObserver((el) => {
      setHeight(el[0].contentRect.height);
    });

    resizeObserver.observe(ref.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [height, openState]);

  useEffect(() => {
    if (openState) setHeight(ref.current?.getBoundingClientRect().height);
    else setHeight(0);
  }, [openState]);

  return (
    <div>
      <div style={{ cursor: "pointer" }} onClick={toggle}>
        <Prefix>{`${openState ? "-" : "+"}`}</Prefix> {title}
      </div>

      <Container style={{ height, maxHeight: `${maxHeight}px` }}>
        <div ref={ref}>
          <Content>{children}</Content>
        </div>
      </Container>
    </div>
  );
};

export default Collapsible;
