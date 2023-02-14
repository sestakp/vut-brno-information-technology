export const getAll = (state, collection) => state[collection]?.records;
export const getById = (state, id, collection) => state[collection]?.records.filter(x=> x.id !== id);