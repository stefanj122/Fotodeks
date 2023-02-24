export const makeUrlPath = (arrOfPaths: string[]): string => {
  let url = process.env.BASE_URL;
  arrOfPaths.forEach((path) => {
    url += `/${path}`;
  });
  return url;
};
