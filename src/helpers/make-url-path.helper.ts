export const makeUrlPath = (arrOfPaths: string[]): string => {
  return (
    process.env.BASE_URL +
    ':' +
    process.env.APP_PORT +
    '/' +
    arrOfPaths.join('/')
  );
};
