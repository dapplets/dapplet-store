import { ethers } from 'ethers'
import { DAPPLET_REGISTRY_ADDRESS, DEFAULT_CHAIN_ID } from '../constants'
import { PROVIDER_URL } from './constants'
import dappletsRegistryABI from '../dappletsRegistryABI.json'

const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, DEFAULT_CHAIN_ID)

const dappletRegistry = new ethers.Contract(DAPPLET_REGISTRY_ADDRESS, dappletsRegistryABI, provider)

export default dappletRegistry
