export const paginate = (
  page: number,
  perPage: number,
): { currentPage: number; offset: number; limit: number } => {
  const limit = !perPage || +perPage < 0 ? 10 : +perPage;
  const currentPage = !page || +page < 0 ? 1 : +page;
  const offset = (currentPage - 1) * limit;

  return {
    currentPage,
    offset,
    limit,
  };
};
