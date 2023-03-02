import * as sharp from 'sharp';

export const sharpHelper = async (
  imagePath: string,
  watermarkPath: string,
  thumbnailPath: string,
  thumbanilSize = process.env.BASE_THUMBNAIL_SIZE,
  opacity = 170, gravity = "southeast"
) => {
  const [width, height] = thumbanilSize.split('x');
  if (thumbanilSize === process.env.BASE_THUMBNAIL_SIZE) {
  
    const watermarkBuffer = await sharp(watermarkPath)
      .resize(Math.floor(+width * 0.8), Math.floor(+height * 0.8))
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
  } else {
    const originalImage = sharp(imagePath);
    const watermark = sharp(watermarkPath);
            
    originalImage.metadata()
      .then(metadata => {
        return watermark
          .resize(metadata.width * 0.2, metadata.height * 0.2)
          .toBuffer();
      }).then(watermarkBuffer => {
        return originalImage
          .composite([
            {
              input: watermarkBuffer,
              gravity: gravity,

            },
          ])
          .toFile(thumbnailPath);
      })
      .catch(error => {
        console.log(error, "Error creating watermark!");
      });
  }
};
