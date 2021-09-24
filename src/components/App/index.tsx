import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { Layout } from '../../layouts/Layout/Layout';
import Input from '../Input';
import ListDapplets from '../ListDapplets';
import abi from '../../abi.json';
import types from '../../types.json';
import { IDappletsList } from "../../config/types";

const PROVIDER_URL = 'https://rinkeby.infura.io/v3/eda881d858ae4a25b2dfbbd0b4629992';

export default (): React.ReactElement => {
  const [searchQuery, editSearchQuery] = useState<string>('');
  const [dapplets, updateDapplets] = useState<any[]>();
  const [dappletsVersions, updateDappletsVersions] = useState<any>();
  const [selectedDapplets, setSelectedDapplets] = useState<IDappletsList>({ name: 'Selected dapplets', dapplets: {} });
  const [localDapplets, setLocalDapplets] = useState<IDappletsList>({ name: 'My dapplets', dapplets: {} });
  const [selectedList, setSelectedList] = useState<IDappletsList>();

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

    const selectedDappletsListStringified = window.localStorage.getItem(selectedDapplets.name);
    if (selectedDappletsListStringified) {
      const selectedDappletsListParsed = JSON.parse(selectedDappletsListStringified);
      setSelectedDapplets(selectedDappletsListParsed);
    } else {
      setSelectedDapplets({ name: selectedDapplets.name, dapplets: {} });
    }

    const localDappletsListStringified = window.localStorage.getItem(localDapplets.name);
    if (localDappletsListStringified) {
      const localDappletsListParsed = JSON.parse(localDappletsListStringified);
      setLocalDapplets(localDappletsListParsed);
    } else {
      setLocalDapplets({ name: localDapplets.name, dapplets: {} });
    }

  }, []);

  const handlerChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    editSearchQuery(value);
  };

  const deleteTextInput = () => editSearchQuery('');

  let dappletsToShow: any[] | undefined;
  if (selectedList) {
    if (dapplets !== undefined) {
      const keys = Object.keys(selectedList.dapplets);
      dappletsToShow = dapplets.filter((dapp) => keys.includes(dapp.name));
    }
  } else {
    dappletsToShow = dapplets;
  }

  const filteredDapplets = dappletsToShow && dappletsToShow.filter((dapplet) => {
    const reg = new RegExp(`${searchQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'gi');
    return (
      reg.exec(dapplet.name) ||
      reg.exec(dapplet.title) ||
      reg.exec(dapplet.owner.replace('0x000000000000000000000000', '0x')) ||
      reg.exec(dapplet.description) ||
      reg.exec(dappletsVersions[dapplet.name][dappletsVersions[dapplet.name].length - 1])
    );
  })
  
  /** 
   *  The feature makes the header hidden when scrilling down the page and visible when scrolling up the page.
   * */

  /* let lastKnownScrollPosition = 0;
  let ticking = false;
  
  useEffect(() => {
    document.addEventListener('scroll', function(e) {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          showOrHideHeader(window.scrollY, lastKnownScrollPosition);
          ticking = false;
          lastKnownScrollPosition = window.scrollY;
        });
        ticking = true;
      }
    });
  }, []);
    
  const showOrHideHeader = (currentScrollPos: number, prevScrollPos: number ) => {
    const el: HTMLElement | null = document.querySelector('main header');
    if (el) {
      if (currentScrollPos > 70 && currentScrollPos - prevScrollPos > 0) {
        el.style.transition = 'all .2s ease-in';
        el.style.opacity = '0';
      } else {
        el.style.transition = 'all .2s ease-out';
        el.style.opacity = '1';
      }
    };
  };*/

  return (
    <Layout
      selectedDapplets={selectedDapplets}
      setSelectedDapplets={setSelectedDapplets}
      localDapplets={localDapplets}
      setLocalDapplets={setLocalDapplets}
      selectedList={selectedList}
      setSelectedList={setSelectedList}
    >
      <React.Fragment>
        <Input 
          value={searchQuery}
          onChange={handlerChange}
          onClick={deleteTextInput}
        />
        {filteredDapplets  && <ListDapplets
          list={filteredDapplets}
          dappletsVersions={dappletsVersions}
          selectedDapplets={selectedDapplets}
          setSelectedDapplets={setSelectedDapplets}
          localDapplets={localDapplets}
          setLocalDapplets={setLocalDapplets}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        />}
      </React.Fragment>
    </Layout>
  );
};
