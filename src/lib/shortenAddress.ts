import replaceBetween from './replaceBetween'

const shortenAddress = (addres: string, length: number) =>
  replaceBetween(addres, length, length, '...')

export default shortenAddress
