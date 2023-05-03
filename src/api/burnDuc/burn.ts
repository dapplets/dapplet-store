import { ethers } from 'ethers'
import { PROVIDER_URL } from '../constants'
import abi from './DappletRegistry.abi.json'
import dappletRegistry from '../../api/dappletRegistry'
import { DAPPLET_REGISTRY_ADDRESS, MAX_MODULES_COUNTER, REGISTRY_BRANCHES } from '../../constants'
import { AnyNsRecord } from 'dns'

export const burn = async (moduleName: string,provider:any) => {
  const ethersProvider = new ethers.providers.Web3Provider(provider)
  const signer = await ethersProvider.getSigner()

  const dappletsRegistry = new ethers.Contract(
    DAPPLET_REGISTRY_ADDRESS,
    abi,
    signer
  )

  const offset = 0
  const limit = MAX_MODULES_COUNTER

  const res = await dappletsRegistry.burnDUC(
    moduleName
  )
  try {
    
    // const tx = await dappletRegistry.burnDUC(moduleName)
    await res.wait()
    
  } catch (err) {
    console.log('Error burned', err)
  }
}

