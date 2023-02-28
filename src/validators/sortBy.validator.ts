import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SortByValidator implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, metadata: ArgumentMetadata) {
    if (value) {
      const data = value.split(':');
      if (
        data.length === 2 &&
        (data[0] === 'id' || data[0] === 'createdAt') &&
        (data[1] === 'ASC' || data[1] === 'DESC')
      ) {
        return { 0: data[0], 1: data[1] };
      }
    }
    return { 0: 'id', 1: 'ASC' };
  }
}
