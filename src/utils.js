export const isOdd = (value) => value % 2 != 0;

export const convertToDate = (text) => {
  const trimDate = text.trim().replace(/[.\s]/g, '');
  const yyyyMmDdFormat = `${trimDate.slice(4)}-${trimDate.slice(2, 4)}-${trimDate.slice(0, 2)}`
  return new Date(yyyyMmDdFormat);
}
