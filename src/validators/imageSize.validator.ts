import { BadRequestException } from '@nestjs/common';

export function imageSizeValidator(size: string) {
  const sizeOfImage = ['640x480', '800x600', '1920x1080'];
  if (!sizeOfImage.includes(size)) {
    throw new BadRequestException('Image size is not supported!');
  } else {
    return size;
  }
}
