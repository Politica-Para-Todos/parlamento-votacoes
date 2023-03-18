export const isOdd = (value) => value % 2 != 0;

export const convertToDate = (text) => {
  const trimDate = text.trim().replace(/[.\s]/g, '');
  return `${trimDate.slice(0, 2)}-${trimDate.slice(2, 4)}-${trimDate.slice(4)}`;
}

export const areObjectsEqual = (object1, object2) =>
  JSON.stringify(object1) === JSON.stringify(object2);