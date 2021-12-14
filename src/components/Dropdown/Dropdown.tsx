import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
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
  display: ${props => (props.active ? "block" : "none")};
  margin: 0;
  min-width: 180px;
  padding: 0;
  position: absolute;
  li {
    list-style: none;
    margin: 0;
    a,
    a:link {
      display: block;
      padding: 0.5em;
      &:hover {
        background-color: lightblue;
      }
    }
  }
`;

interface IDropdownItem {
  id: number;
  text: string;
}

interface IProps {
  activatorText?: string;
  items?: IDropdownItem[];
}

const dropdownItems = [
  {
    id: 1,
    url: "myLink",
    text: "option"
  },
  {
    id: 2,
    url: "myLink2",
    text: "option2"
  },
  {
    id: 3,
    url: "myLink3",
    text: "option3"
  },
  {
    id: 4,
    url: "myLink4",
    text: "option4"
  }
];

const Dropdown = ({
  activatorText = "Dropdown",
  items = dropdownItems
}: IProps) => {
  const activatorRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const currentText = useMemo(() => {
    const item = items.find(({ id }) => id === activeIndex) 
    if (item) {
      return item.text
    }
    return 'TITLE'
  }, [activeIndex, items])

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

  const focusHandler = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <Wrapper>
      <ActivatorButton
        aria-haspopup="true"
        aria-controls="dropdown1"
        onClick={handleClick}
        ref={activatorRef}
        onFocus={() => setActiveIndex(-1)}
      >
        {currentText}
      </ActivatorButton>
      <DropdownList id="dropdown1" ref={listRef} active={isOpen} role="list">
        {items.map((item, index) => (
          <li key={item.id} onClick={() => focusHandler(item.id)}>
              {item.text}
          </li>
        ))}
      </DropdownList>
    </Wrapper>
  );
};

export default Dropdown;