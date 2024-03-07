export const isEmpty = (x: object | Array<unknown>) => {
    if (Array.isArray(x)) {
        return x.length === 0;
    } else {
        return Object.keys(x).length === 0 && x.constructor === Object;
    }
};
