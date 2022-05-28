import React from "react";
import Collapsible from "../Collapsible/Collapsible";

type TrustedListProps = {
  users: JSX.Element[];
  isOpen: boolean;
  onToggle: () => void;
};

const TrustedList = ({ users, isOpen, onToggle }: TrustedListProps) => {
  return (
    <Collapsible
      isOpen={isOpen}
      onToggle={onToggle}
      title="Trusted Users"
      maxHeight={250}
    >
      {users}
    </Collapsible>
  );
};

export default TrustedList;
