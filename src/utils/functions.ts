export const numberWithCommas = (x?: number | string, isDecimal = false) => {
  if (!x) return 0;

  const isHaveDot = x?.toString()?.includes('.');
  if (isHaveDot) {
    const d = x?.toString().split('.');
    return `${d?.[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${d?.[1].slice(
      0,
      2,
    )}`;
  }

  if (isDecimal && typeof x === 'number') {
    x = Number(x);

    return x?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export const numberReturnString = (x?: number | string, isDecimal = false) => {
  if (!x) return '';

  const isHaveDot = x?.toString()?.includes('.');
  if (isHaveDot) {
    const d = x?.toString().split('.');
    return `${d?.[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${d?.[1]}`;
  }
  if (isDecimal && typeof x === 'number') {
    return x
      ?.toFixed(2)
      .replace(/^0+/, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .toString();
  }
  return x
    ?.toString()
    .replace(/^0+/, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// image
export const getNewPath = (path: string) => {
  if (!path) return '';
  const paths = path.trim().split('/');
  const sliceStart = paths.slice(0, paths.length - 1).join('/');
  const sliceEnd = paths[paths.length - 1];
  return sliceStart + '/' + encodeURIComponent(sliceEnd);
};
