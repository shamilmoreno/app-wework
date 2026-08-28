export const toNumber = (value: any): number => {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
};
