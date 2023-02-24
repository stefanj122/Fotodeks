export const paginate = (
  page: number,
  perPage: number,
): { offset: number; limit: number } => {
  const limit = !perPage || +perPage < 0 ? 10 : +perPage;
  const offset = ((!page || +page < 0 ? 1 : +page) - 1) * limit;

  return {
    offset,
    limit,
  };
};
