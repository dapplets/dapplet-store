import React from 'react';
import { Button, Icon, Input as SemanticInput } from 'semantic-ui-react';

import { InputProps } from './Input.props';
import cn from 'classnames';
import styles from './Input.module.scss';

function Input({ value, onChange, onClick }: InputProps): React.ReactElement {
  return (
    <SemanticInput
      placeholder='Start typing here'
      iconPosition="left" fluid
      size="large"
      className={styles.input}
      onChange={onChange}
      value={value}
      style={{
        padding: 15,
        borderBottom: '1px solid #E3E3E3'
      }}
    >
      <Icon name="search" />
      <input
        style={{ color: '#2A2A2A', fontSize: 16, borderRadius: 0 }}
        className="app-input"
      />
      <Button onClick={onClick} basic size="tiny"
        className={cn(styles.clearInput, {
          [styles.show]: value.length > 0
        })}>
        <span />
      </Button>
    </SemanticInput>
  );
}

export default Input;
