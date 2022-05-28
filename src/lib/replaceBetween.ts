const replaceBetween = (
  string: string,
  start: number,
  end: number,
  replacer: string,
) => {
  return string
    .slice(0, start)
    .concat(replacer)
    .concat(string.slice(-1 * end));
};

export default replaceBetween;
