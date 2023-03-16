export const sortByHelper = (
  sortByQuery: string,
  sortableColumns: string[],
): [string, 'ASC' | 'DESC'] => {
  if (sortByQuery) {
    const data = sortByQuery.split(':');
    if (
      data.length === 2 &&
      sortableColumns.includes(data[0]) &&
      (data[1] === 'ASC' || data[1] === 'DESC')
    ) {
      return [data[0], data[1]];
    }
  }
  return ['id', 'ASC'];
};
