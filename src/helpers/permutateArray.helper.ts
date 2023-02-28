export const permutationsOfArray = (arr: string[]): string[] => {
  if (arr.length <= 2)
    return arr.length === 2
      ? [`%${arr.join('%')}%`, `%${[arr[1], arr[0]].join('%')}%`]
      : [`%${arr}%`];
  return arr.reduce(
    (acc, item, i) =>
      acc.concat(
        permutationsOfArray([...arr.slice(0, i), ...arr.slice(i + 1)]).map(
          (val) => {
            return '%' + item + val;
          },
        ),
      ),
    [],
  );
};
