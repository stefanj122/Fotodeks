import { Brackets } from 'typeorm';
import { permutationsOfArray } from './permutate-array.helper';

export const permutateSearch = (searchQuery: string): Brackets => {
  return new Brackets((query) => {
    if (searchQuery) {
      const arr = permutationsOfArray(
        searchQuery
          .split(/[, ]/g)
          .filter((el) => el)
          .slice(0, 3),
      );
      arr.forEach((item) => {
        query.orWhere(`images.tags LIKE '${item}'`);
      });
    }
  });
};

export const filterByUserAndIsApproved = (
  userId: number,
  isApproved: boolean,
): Brackets => {
  return new Brackets((query) => {
    if (isApproved !== undefined) {
      query.where('images.isApproved = :isApproved', { isApproved });
    }
    if (userId) {
      query.andWhere('images.userId = :userId', { userId });
    }
  });
};
