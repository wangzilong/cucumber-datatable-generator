
export const keys = (obj: any, parent?: string): string[] => {
  return Object.entries(obj)
    .map(e => {
      const k = e[0].toString();
      const v = e[1];

      const header = parent ? `${parent}.${k}` : k;

      if (isArray(v) || !v) {
        return header;
      } else if ("object" === typeof v) {
        return keys(v, header);
      } else {
        return header;
      }
    })
    .filter(e => e !== null && e !== undefined)
    .flatMap(e => e);
}

const isArray = (a:any): boolean => {
  return a instanceof Array;
}