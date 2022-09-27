const trimLeadingZeros = (addr: string, number: number) => {
  const toReplace = new Array(number).fill(0).join("");
  return addr.replace(`0x${toReplace}`, "0x");
};

export default trimLeadingZeros;
