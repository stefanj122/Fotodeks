import { NotFoundException, ParseFilePipeBuilder } from '@nestjs/common';

export const FileValidator = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /png|jpeg|jpg/gi,
  })
  .build({
    exceptionFactory: (err) => {
      if (err) {
        throw new NotFoundException({
          status: 'image_incorrect_format',
        });
      }
    },
  });
