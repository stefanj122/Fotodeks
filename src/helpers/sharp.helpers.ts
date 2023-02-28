import * as sharp from 'sharp';

export const sharpHelper = async (
  imagePath: string,
  watermarkPath: string,
  thumbnailPath: string,
  thumbanilSize = process.env.BASE_THUMBNAIL_SIZE,
  opacity = 170,
) => {
  const [width, height] = thumbanilSize.split('x');

  const watermarkBuffer = await sharp(watermarkPath)
    .resize(285, 190)
    .composite([
      {
        input: Buffer.from([255, 255, 255, opacity]),
        raw: {
          width: 1,
          height: 1,
          channels: 4,
        },
        tile: true,
        gravity: 'center',
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

  return sharp(imagePath)
    .resize(+width, +height)
    .composite([
      {
        input: watermarkBuffer,
      },
    ])
    .toFile(thumbnailPath);
};
