import { ethers } from 'ethers'
import { PROVIDER_URL } from '../constants'
import abi from './DappletRegistry.abi.json'

export const getStakeStatus = async (moduleName: string) => {
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 0x05)
  const contract: any = new ethers.Contract(
    '0x194a500Cbe0369Ad916E4CDc85572BF0810Ba676',
    abi,
    provider
  )
 
    
    const tx = await contract.getStakeStatus(moduleName)
    return tx
    
 
}