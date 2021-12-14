import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { Layout } from '../../layouts/Layout/Layout';
import Input from '../Input';
import ListDapplets from '../ListDapplets';
import abi from '../../abi.json';
import types from '../../types.json';
import { IDapplet, IDappletsList, IDappletVersions, IDappletsListElement } from "../../config/types";
import { Lists } from '../../config/types';
import styled from "styled-components";

import "@fontsource/roboto"
import Dropdown from '../Dropdown/Dropdown';

const PROVIDER_URL = 'https://rinkeby.infura.io/v3/eda881d858ae4a25b2dfbbd0b4629992';

const getDappletsListFromLocal = (listName: string) => {
  const dappletsListStringified = window.localStorage.getItem(listName);
  if (dappletsListStringified) {
    const dappletsListParsed: IDappletsListElement[] = JSON.parse(dappletsListStringified);
    return({ listName: Lists.Selected, dapplets: dappletsListParsed });
  } else {
    return({ listName: Lists.Selected, dapplets: [] });
  }

}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content max-content;
  grid-column-gap: 16px;
  align-items: center;
`

const dropdownItems = [
  {
    id: 1,
    text: "option"
  },
  {
    id: 2,
    text: "option2"
  },
  {
    id: 3,
    text: "option3"
  },
  {
    id: 4,
    text: "option4"
  }
];

const App = (): React.ReactElement => {
  const [searchQuery, editSearchQuery] = useState<string>('');
  const [dapplets, updateDapplets] = useState<IDapplet[]>();
  const [dappletsVersions, updateDappletsVersions] = useState<IDappletVersions>();
  const [dappletsTransactions, updateDappletsTransactions] = useState<any>();
  const [selectedDappletsList, setSelectedDappletsList] = useState<IDappletsList>({ listName: Lists.Selected, dapplets: [] });
  const [localDappletsList, setLocalDappletsList] = useState<IDappletsList>({ listName: Lists.Local, dapplets: [] });
  const [selectedList, setSelectedList] = useState<Lists>();
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // console.log('dapplets', dapplets)
  // console.log('dappletsVersions', dappletsVersions)
  // console.log('dappletsTransactions', dappletsTransactions)
  // console.log('selectedDapplets', selectedDappletsList)
  // console.log('localDapplets', localDappletsList)
  // console.log('selectedList', selectedList)

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 4);
    const contract: any = new ethers.Contract('0xb76b02b35ad7cb71e2061056915e521e8f05c130', abi, provider);
    contract.queryFilter('ModuleInfoAdded').then(async (events: any) => {
      // console.log('events', events)
      const versions: any = {};
      const timestamps: any = {};
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

        const block = await ev.getBlock();
        timestamps[module.name] = block.timestamp;

        return module;
      }));

      const allDapplets = allModules.filter((module: any) => module.moduleType === 1);
      updateDapplets(allDapplets);
      updateDappletsVersions(versions);
      updateDappletsTransactions(timestamps);
    });

    setSelectedDappletsList(getDappletsListFromLocal(Lists.Selected))
    setLocalDappletsList(getDappletsListFromLocal(Lists.Local))

  }, []);

  const formDappletsList = (selectedList?: Lists) => {
    if (dapplets === undefined || selectedList === undefined) return dapplets;
    const chooseDappletsList = {
      [Lists.Local]: localDappletsList,
      [Lists.Selected]: selectedDappletsList,
    };
    // console.log('selectedList', selectedList)
    const dapps = chooseDappletsList[selectedList];
    // console.log('dapps', dapps)
    return dapps.dapplets
      .map((dapplet) => dapplets.find((dapp) => dapp.name === dapplet.name))
      .filter((dapp): dapp is IDapplet => !!dapp);
  }

  const dappletsByList = formDappletsList(selectedList);

  const reg1 = new RegExp(`${searchQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'gi');
  const regs = activeTags.map((activeTag) => new RegExp(activeTag, 'gi'));
  regs.push(reg1);
  const filteredDapplets = dappletsByList && dappletsByList.filter((dapplet) => {
    const res = regs.map((reg) => (
      reg.exec(dapplet.name) ||
      reg.exec(dapplet.title) ||
      reg.exec(dapplet.owner.replace('0x000000000000000000000000', '0x')) ||
      reg.exec(dapplet.description) ||
      reg.exec(dappletsVersions![dapplet.name][dappletsVersions![dapplet.name].length - 1])
    ));
    return  !res.includes(null);
  })

  /** 
   *  The feature makes the header hidden when scrilling down the page and visible when scrolling up the page.
   * */
  
  useEffect(() => {
    let lastKnownScrollPosition = 0;
    let ticking = false;
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
  };

  return (
    <Layout
      dappletTitles={dapplets?.reduce((acc, dapp) => ({ ...acc, [dapp.name]: dapp.title }), {})}
      selectedDappletsList={selectedDappletsList}
      setSelectedDappletsList={setSelectedDappletsList}
      localDappletsList={localDappletsList}
      setLocalDappletsList={setLocalDappletsList}
      selectedList={selectedList}
      setSelectedList={setSelectedList}
      activeTags={activeTags}
      setActiveTags={setActiveTags}
      setExpandedItems={setExpandedItems}
    >
      <>
        <Wrapper>
          <Input 
            searchQuery={searchQuery}
            editSearchQuery={editSearchQuery}
          />
          <Dropdown items={dropdownItems} activatorText='2'/>
          <Dropdown items={dropdownItems} activatorText='2'/>
        </Wrapper>
        {filteredDapplets && <ListDapplets
          dapplets={filteredDapplets}
          dappletsVersions={dappletsVersions}
          selectedDapplets={selectedDappletsList}
          setSelectedDapplets={setSelectedDappletsList}
          localDapplets={localDappletsList}
          setLocalDapplets={setLocalDappletsList}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
          dappletsTransactions={dappletsTransactions}
          updateDappletsTransactions={updateDappletsTransactions}
          expandedItems={expandedItems}
          setExpandedItems={setExpandedItems}
        />}
      </>
    </Layout>
  );
};

export default App;
