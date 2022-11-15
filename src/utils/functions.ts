export const numberWithCommas = (x?: number, isDecimal = false) => {
  if (x === undefined) return 0;
  if (isDecimal) return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
