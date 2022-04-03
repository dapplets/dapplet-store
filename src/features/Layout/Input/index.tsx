import React from "react";
import { Button, Icon, Input as SemanticInput } from "semantic-ui-react";

import { InputProps } from "./Input.props";
import cn from "classnames";
import styles from "./Input.module.scss";

function Input({
  searchQuery,
  editSearchQuery,
}: InputProps): React.ReactElement {
  const handlerChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    editSearchQuery(value);
  };

  const deleteTextInput = () => editSearchQuery("");

  return (
    <SemanticInput
      placeholder="Start typing here"
      iconPosition="left"
      fluid
      size="large"
      className={styles.input}
      onChange={handlerChange}
      value={searchQuery}
      style={{
        padding: 15,
        paddingRight: 0,
      }}
    >
      <Icon name="search" style={{ marginLeft: "15px" }} />
      <input
        style={{
          color: "#2A2A2A",
          fontSize: 16,
          borderRadius: 4,
          border: "1px solid #E3E3E3",
        }}
        className="app-input"
      />
      <Button
        onClick={deleteTextInput}
        basic
        size="tiny"
        className={cn(styles.clearInput, {
          [styles.show]: searchQuery.length > 0,
        })}
      >
        <span />
      </Button>
    </SemanticInput>
  );
}

export default Input;
