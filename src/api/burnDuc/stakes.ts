import { ethers } from 'ethers'
import { PROVIDER_URL } from '../constants'
import abi from './DappletRegistry.abi.json'

export const stakes = async (moduleName: string,parameters: string) => {
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 0x05)
  const contract: any = new ethers.Contract(
    '0x194a500Cbe0369Ad916E4CDc85572BF0810Ba676',
    abi,
    provider
  )
  if (parameters === 'date') {
    const dateAt = await contract.stakes(moduleName)

    const parseStakes = convertTimestampToISODate((await dateAt[2].toNumber()) * 1000)
    let date = new Date(parseStakes)
    let nowDate = new Date()
    var daysLag = Math.ceil(Math.abs(date.getTime() - nowDate.getTime()) / (1000 * 3600 * 24))

    return daysLag
  } else if ('amount') {
    const amount = await contract.stakes(moduleName)

    const parseStakes = ethers.utils.formatUnits(await amount[0], 16)

    return parseInt(parseStakes)
  }
}
export function convertTimestampToISODate(timestamp: number): string {
    return new Date(timestamp).toISOString()
  }