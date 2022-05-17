import React from "react";
import styled from "styled-components";
import DappletsListItem, {
  DappletsListItemProps,
} from "../DappletsListItem/DappletsListItem";

const ListWrapper = styled.div``;

interface TitleProps {
  color: string;
}

const Title = styled.div<TitleProps>`
  font-family: Montserrat;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px;
  letter-spacing: 0em;
  text-align: left;
  color: ${({ color }) => color};
  user-select: none;
  cursor: pointer;
  & span {
    display: inline-block;
    width: 14px;
  }
`;

const TitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;
`;

const DappletsListItemWrapper = styled.div`
  display: grid;
  padding-left: 30px;
  grid-row-gap: 10px;
  margin-top: 10px;
  max-height: 390px;
  overflow: auto;
  padding-right: 15px;
`;

const MoreWrapper = styled.div`
  color: #588ca3;
  text-decoration-line: underline;
  user-select: none;
  cursor: pointer;
`;

const TitleButtonWrapper = styled.button`
  cursor: pointer;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #5ab5e8;
  color: #5ab5e8;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: center;
  padding: 9px 10px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

interface DappletsListSidebarProps {
  dappletsList: DappletsListItemProps[];
  title: string;
  isPushing?: boolean;
  onOpenList: any;
  isMoreShow: boolean;
  titleButton?: {
    title: string;
    onClick: any;
  };
  onElementClick?: any;
  isOpen: boolean;
  setIsOpen: any;
}

const DappletsListSidebar = (props: DappletsListSidebarProps) => {
  const {
    dappletsList,
    isMoreShow,
    isOpen,
    onOpenList,
    setIsOpen,
    title,
    isPushing,
    onElementClick,
    titleButton,
  } = props;

  return (
    <ListWrapper>
      <TitleWrapper>
        <Title
          onClick={() => {
            if (dappletsList.length) setIsOpen(isOpen ? null : title);
          }}
          color={isOpen ? "#2A2A2A" : "#747376"}
        >
          {!!dappletsList.length && (isOpen ? <span>-</span> : <span>+</span>)}{" "}
          {title}
        </Title>
        {titleButton && (
          <TitleButtonWrapper
            disabled={!!isPushing}
            onClick={titleButton?.onClick}
          >
            {titleButton?.title}
          </TitleButtonWrapper>
        )}
      </TitleWrapper>
      {isOpen && !!dappletsList.length && (
        <DappletsListItemWrapper>
          {dappletsList
            .filter(({ title }) => !!title)
            .map(
              ({
                id,
                subTitle,
                isRemoved,
                onClickRemove,
                title,
                type,
                isPushing,
              }) => {
                return (
                  <DappletsListItem
                    key={id}
                    onClick={onElementClick}
                    subTitle={subTitle}
                    isPushing={!!isPushing}
                    isRemoved={isRemoved}
                    onClickRemove={onClickRemove}
                    title={title}
                    type={type}
                    id={id}
                  />
                );
              },
            )}
          {isMoreShow && (
            <MoreWrapper onClick={onOpenList}>show more</MoreWrapper>
          )}
        </DappletsListItemWrapper>
      )}
    </ListWrapper>
  );
};

export default DappletsListSidebar;
