import * as sharp from 'sharp';

export const sharpHelper = async (
  imagePath: string,
  watermarkPath: string,
  thumbnailPath: string,
  thumbanilSize = process.env.BASE_THUMBNAIL_SIZE,
  opacity = 170,
  gravity = 'southeast',
) => {
  const [width, height] = thumbanilSize.split('x');
  const isSmallest = thumbanilSize === process.env.BASE_THUMBNAIL_SIZE;

  const watermark = sharp(watermarkPath).resize(
    +width * (isSmallest ? 0.8 : 0.2),
    +height * (isSmallest ? 0.8 : 0.2),
  );
  if (isSmallest) {
    watermark.composite([
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
    ]);
  }
  const watermarkBuffer = watermark.png().toBuffer();

  try {
    await sharp(imagePath)
      .resize(+width, +height)
      .composite([
        {
          input: await watermarkBuffer,
          gravity: isSmallest ? 'center' : gravity,
        },
      ])
      .toFile(thumbnailPath);
    return true;
  } catch (e) {
    return false;
  }
};
