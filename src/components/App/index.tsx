import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Layout } from '../../layouts/Layout/Layout';

import Input from '../Input';
import ListDapplets from '../ListDapplets';
import abi from '../../abi.json';
import types from '../../types.json';

const PROVIDER_URL = 'https://rinkeby.infura.io/v3/eda881d858ae4a25b2dfbbd0b4629992';

function App(): React.ReactElement {
  const [value, setValue] = useState<string>('');
  const [dapplets, updateDapplets] = useState<any[]>();
  const [dappletsVersions, updateDappletsVersions] = useState<any>();

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 4);
    const contract: any = new ethers.Contract('0xb76b02b35ad7cb71e2061056915e521e8f05c130', abi, provider);
    contract.queryFilter('ModuleInfoAdded').then(async (events: any) => {
      const versions: any = {};
      const allModules: any[] = await Promise.all(events.map(async (ev: any) => {
        const tx: any = await provider.getTransaction(ev.transactionHash);
        const t: any = types;
        const decoded = ethers.utils.defaultAbiCoder.decode(t, ethers.utils.hexDataSlice(tx.data, 4));
        const module = await contract.getModuleInfoByName(decoded.mInfo.name);

        const hex: string = await contract.getVersionNumbers(module.name, 'default');
        const result = (hex.replace('0x', '')
          .match(/.{1,8}/g) ?? [])
          .map(x => `${parseInt('0x' + x[0] + x[1])}.${parseInt('0x' + x[2] + x[3])}.${parseInt('0x' + x[4] + x[5])}`);
        versions[module.name] = result;

        return module;
      }));

      const allDapplets = allModules.filter((module: any) => module.moduleType === 1);
      updateDapplets(allDapplets);
      updateDappletsVersions(versions);
    });
  }, []);

  function handlerChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setValue(value);
  }

  function onClick() { setValue(''); }

  return (
    <Layout>
      <React.Fragment>
        <Input value={value} onChange={handlerChange} onClick={onClick} />

        {dapplets && <ListDapplets list={dapplets} dappletsVersions={dappletsVersions} />}
      </React.Fragment>
    </Layout>
  );
}

export default App;
