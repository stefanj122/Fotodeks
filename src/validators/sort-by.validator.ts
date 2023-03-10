import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SortByValidator implements PipeTransform {
  transform(
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    metadata: ArgumentMetadata,
  ): [string, 'ASC' | 'DESC'] {
    if (value) {
      const data = value.split(':');
      if (data.length === 2 && (data[1] === 'ASC' || data[1] === 'DESC')) {
        return [data[0], data[1]];
      }
    }
    return ['id', 'ASC'];
  }
}
