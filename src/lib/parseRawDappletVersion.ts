function parseRawDappletVersion(hex: string) {
  const result = (hex.replace("0x", "").match(/.{1,8}/g) ?? []).map(
    (x) =>
      `${parseInt("0x" + x[0] + x[1])}.${parseInt(
        "0x" + x[2] + x[3],
      )}.${parseInt("0x" + x[4] + x[5])}`,
  );
  return result;
}

export default parseRawDappletVersion;
