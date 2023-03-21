import * as sharp from 'sharp';

export const sharpHelper = async (
  imagePath: string,
  watermarkPath: string,
  thumbnailPath: string,
  thumbnailSize = process.env.BASE_THUMBNAIL_SIZE,
  opacity = process.env.BASE_OPACITY,
  gravity = 'southeast',
) => {
  const [width, height] = thumbnailSize.split('x');
  const isSmallest = thumbnailSize === process.env.BASE_THUMBNAIL_SIZE;

  const watermark = sharp(watermarkPath).resize(
    +width * (isSmallest ? 0.8 : 0.2),
    +height * (isSmallest ? 0.8 : 0.2),
    {
      fit: sharp.fit.inside,
    },
  );
  if (isSmallest) {
    watermark.composite([
      {
        input: Buffer.from([255, 255, 255, +opacity]),
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
    console.error(e);
    return false;
  }
};
