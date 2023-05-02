import { ethers } from 'ethers'
import { PROVIDER_URL } from '../constants'
import abi from './DappletRegistry.abi.json'

export const getStakeStatus = async (moduleName: string) => {
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 0x05)
  const contract: any = new ethers.Contract(
    '0xa0D2FB6f71F09E60aF1eD7344D4BB8Bb4c83C9af',
    abi,
    provider
  )
 
    
    const tx = await contract.getStakeStatus(moduleName)
    return tx
    
 
}