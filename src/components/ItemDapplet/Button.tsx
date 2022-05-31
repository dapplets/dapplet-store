import React, {
  useState,
  useEffect,
  FunctionComponent,
  SVGProps,
  useRef,
  MouseEvent,
} from "react";
import styled, { css } from "styled-components";

import { ReactComponent as AddIcon } from "../../images/plus.svg";
import { ReactComponent as InLocalListIcon } from "../../images/cpu.svg";
import { ReactComponent as InPublicListIcon } from "../../images/alignCenter.svg";
import { ReactComponent as RemoveIcon } from "../../images/remove.svg";

import {
  DAPPLET_BUTTON_TEXT as ButtonText,
  DAPPLET_LISTING_STAGES,
  DAPPLET_LISTINGS_NAMES,
} from "../../Constants";
import simulateOnMouseHover from "../../lib/simulateOnMouseHover";

const Basic = styled.button<{
  listing: string;
}>`
  display: flex;
  justify-content: center;
  gap: 5px;
  align-items: center;
  border-radius: 40px;
  width: 188px;
  height: 32px;
  cursor: pointer;
`;

const addToPublic = css`
  border: 1px solid #588ca3;
  color: #588ca3;
  background-color: transparent;

  &:hover {
    background-color: #588ca3;
    color: white;

    & svg {
      stroke: white;
    }
  }

  & svg {
    stroke: #588ca3;
  }
`;

const addToLocal = css`
  color: white;
  background-color: #d9304f;
  border: 1px solid #d9304f;

  &:hover {
    background-color: #f26680;
    border-color: #f26680;
  }

  & svg {
    stroke: white;
  }
`;

const Add = styled(Basic)`
  ${(props) =>
    props.listing === DAPPLET_LISTINGS_NAMES.LOCAL ? addToLocal : addToPublic}
`;

const Adding = styled(Basic)`
  border: 1px dashed #5ab5e8;
  background-color: transparent;
  color: #5ab5e8;

  &:hover {
    border-color: #919191;
    background-color: transparent;
    color: #919191;
  }
`;

const Presented = styled(Basic)`
  border: 1px solid #e3e3e3;
  background-color: transparent;
  color: #5ab5e8;

  &:hover {
    border: 1px solid #919191;
    background-color: transparent;
    color: #919191;

    & svg {
      stroke: #919191;
    }
  }

  & svg {
    stroke: #5ab5e8;
  }
`;

const Removing = styled(Basic)`
  border: 1px dashed #5ab5e8;
  background-color: transparent;
  color: #5ab5e8;

  &:hover {
    border-color: #919191;
    background-color: transparent;
    color: #919191;
  }
`;

const styledButtons = {
  add: Add,
  adding: Adding,
  presented: Presented,
  removing: Removing,
};

const ICON_MAP = {
  add: {
    local: {
      initial: AddIcon,
      hover: AddIcon,
    },
    public: {
      initial: AddIcon,
      hover: AddIcon,
    },
  },
  adding: {
    local: {
      initial: null,
      hover: null,
    },
    public: {
      initial: null,
      hover: null,
    },
  },
  presented: {
    local: {
      initial: InLocalListIcon,
      hover: RemoveIcon,
    },
    public: {
      initial: InPublicListIcon,
      hover: RemoveIcon,
    },
  },
  removing: {
    local: {
      initial: null,
      hover: null,
    },
    public: {
      initial: null,
      hover: null,
    },
  },
};

type stagesKeys = keyof typeof DAPPLET_LISTING_STAGES;
type Stages = typeof DAPPLET_LISTING_STAGES[stagesKeys];

type listingKeys = keyof typeof DAPPLET_LISTINGS_NAMES;
type Listings = typeof DAPPLET_LISTINGS_NAMES[listingKeys];

type ButtonProps = {
  stage: Stages;
  listing: Listings;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

type Icon = {
  svgEl: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  > | null;
};

const Button = ({ stage, listing, onClick }: ButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const Button = styledButtons[stage];
  const { initial: initialText, hover: hoverText } = ButtonText[listing][stage];

  const [buttonText, setButtonText] = useState("");
  const [icon, setIcon] = useState<Icon>({ svgEl: null });

  useEffect(() => {
    setButtonText(ButtonText[listing][stage].initial);
  }, [listing, stage]);

  useEffect(() => {
    setIcon({ svgEl: ICON_MAP[stage][listing].initial });
  }, [listing, stage]);

  const Icon = icon.svgEl;

  const handleOnMouseOver = () => {
    setButtonText(hoverText);
    setIcon({ svgEl: ICON_MAP[stage][listing].hover });
  };

  const handleOnMouseLeave = () => {
    setButtonText(initialText);
    setIcon({ svgEl: ICON_MAP[stage][listing].initial });
  };

  return (
    <Button
      ref={ref}
      listing={listing}
      onClick={(e) => {
        if (ref.current) {
          setTimeout(() => {
            simulateOnMouseHover(ref.current);
          }, 0);
        }

        onClick(e);
      }}
      onMouseEnter={handleOnMouseOver}
      onMouseLeave={handleOnMouseLeave}
    >
      {Icon && <Icon></Icon>}
      {buttonText}
    </Button>
  );
};

export default Button;
