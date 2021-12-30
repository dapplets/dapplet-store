import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  z-index: 1001;
`;

export const ActivatorButton = styled.button`
  align-items: center;
  background-color: inherit;
  border: 1px solid transparent;
  border-radius: 3px;
  border-color: #ccc;
  color: inherit;
  display: flex;
  font-size: inherit;
  max-width: 160px;
  padding: 1em;

  &:after {
    content: "";
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
    height: 0.5em;
    margin-left: 0.75em;
    width: 0.5em;
    transform: rotate(45deg);
  }
`;

export const DropdownList = styled.ul<{ active: boolean }>`
  background-color: #ececec;
  color: black;
  display: ${props => (props.active ? "grid" : "none")};
  margin: 0;
  min-width: 180px;
  padding: 0;
  position: absolute;
  right: 0;
  & li {
    list-style: none;
    margin: 0;
    padding: 10px 8px;
    background: white;
    border: rgba(128, 128, 128, 0.3) solid 1px;
    cursor: pointer;
  }
`;

interface IDropdownItem {
  id: number;
  text: string;
  onClick: any,
}

interface IProps {
  active: string
  items: IDropdownItem[]
  setActive: any
}

const dropdownItems = [
  {
    id: 1,
    onClick: "myLink",
    text: "option"
  },
  {
    id: 2,
    onClick: "myLink2",
    text: "option2"
  },
  {
    id: 3,
    onClick: "myLink3",
    text: "option3"
  },
  {
    id: 4,
    onClick: "myLink4",
    text: "option4"
  }
];

const Dropdown = ({
  active,
  setActive,
  items = dropdownItems,
}: IProps) => {
  const activatorRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const currentText = useMemo(() => {
    const item = items.find(({ text }) => text === active) 
    if (item) {
      return item.text
    }
    return 'TITLE'
  }, [active, items])

  const handleClickOutside = (event: any) => {
    if (
      listRef.current!.contains(event.target) ||
      activatorRef.current!.contains(event.target)
    ) {
      return;
    }
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("mouseup", handleClickOutside);
    } else {
      document.removeEventListener("mouseup", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [isOpen]);

  const focusHandler = (index: string) => {
    setActive(index);
  };

  return (
    <Wrapper>
      <ActivatorButton
        aria-haspopup="true"
        aria-controls="dropdown1"
        onClick={handleClick}
        ref={activatorRef}
      >
        {currentText}
      </ActivatorButton>
      <DropdownList id="dropdown1" ref={listRef} active={isOpen} role="list">
        {items.map((item, index) => (
          <li key={item.text} onClick={() =>{ 
              focusHandler(item.text)
              item.onClick()
              setIsOpen(false)
            }}>
              {item.text}
          </li>
        ))}
      </DropdownList>
    </Wrapper>
  );
};

export default Dropdown;