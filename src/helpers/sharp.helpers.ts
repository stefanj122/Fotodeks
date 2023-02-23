import * as sharp from 'sharp';

export const sharpHelper = (
  imagePath: string,
  watermarkPath: string,
  thumbanilSize = process.env.BASE_THUMBNAIL_SIZE,
  gravity = 'center',
) => {
  const [width, height] = thumbanilSize.split('x');

  return sharp(imagePath)
    .resize(+width, +height)
    .composite([
      {
        input: watermarkPath,
        gravity,
      },
    ]);
};
