import { Brackets } from 'typeorm';
import { permutationsOfArray } from './permutateArray.helper';

export const permutateSearch = (searchQuery: string): Brackets => {
  return new Brackets((query) => {
    if (searchQuery) {
      const arr = permutationsOfArray(searchQuery.split(' '));
      arr.forEach((item) => {
        query.orWhere(`images.tags LIKE '${item}'`);
      });
    }
  });
};

export const filerByUserAndIsApprved = (
  userId: number,
  isApproved: number,
): Brackets => {
  return new Brackets((query) => {
    if (isApproved) {
      query.where('images.isApproved = :isApproved', { isApproved });
    }
    if (userId) {
      query.andWhere('images.userId = :userId', { userId });
    }
  });
};
