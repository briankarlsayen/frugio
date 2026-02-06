export const checkFormVal = (obj: Record<string, any>) => {
  for (let key in obj) {
    if (!obj[key]) return key;
  }
  return false;
};
