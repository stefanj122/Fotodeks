export const makeUrlPath = (arrOfPaths: string[]): string => {
  return process.env.BASE_URL + '/' + arrOfPaths.join('/');
};
