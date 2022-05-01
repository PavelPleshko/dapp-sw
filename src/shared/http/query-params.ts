export type PrimitiveParams = string | number | boolean;

export const serializeQuery = (query: Record<string, PrimitiveParams>): string => {
    const result = [];
    for (const key in query) {
        // eslint-disable-next-line no-prototype-builtins
        if (query.hasOwnProperty(key) && query[key] !== undefined) {
            result.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
        }
    }
    return result.join('&');
};
