import { ethers } from 'ethers'
import { PROVIDER_URL } from '../constants'
import abi from './DappletRegistry.abi.json'

export const stakes = async (moduleName: string) => {
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 0x05)
  const contract: any = new ethers.Contract(
    '0xa0D2FB6f71F09E60aF1eD7344D4BB8Bb4c83C9af',
    abi,
    provider
  )
  const dateAt = await contract.stakes(moduleName)

  const parseStakes = convertTimestampToISODate((await dateAt[2].toNumber()) * 1000)
  let date = new Date(parseStakes)
  let nowDate = new Date()
  var daysLag = Math.ceil(Math.abs(date.getTime() - nowDate.getTime()) / (1000 * 3600 * 24))

  return daysLag
}
export function convertTimestampToISODate(timestamp: number): string {
    return new Date(timestamp).toISOString()
  }