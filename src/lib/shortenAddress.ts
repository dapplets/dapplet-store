import replaceBetween from "./replaceBetween";

const shortenAddress = (addres: string) => replaceBetween(addres, 8, 8, "...");

export default shortenAddress;
