import React, { useState } from 'react';
import { Layout } from '../../layouts/Layout/Layout';

import Input from '../Input';
import { DAPPLETS } from '../../config/DAPPLETS';
import ListDapplets from '../ListDapplets';

function App(): React.ReactElement {
  const [value, setValue] = useState<string>('');

  function handlerChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setValue(value);
  }

  function onClick() { setValue(''); }

  return (
    <Layout>
      <React.Fragment>
        <Input value={value} onChange={handlerChange} onClick={onClick} />

        <ListDapplets list={DAPPLETS} />
      </React.Fragment>
    </Layout>
  );
}

export default App;
