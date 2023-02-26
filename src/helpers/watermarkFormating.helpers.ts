import * as sharp from 'sharp';

export async function watermarkFormating(
    imagePath: string, watermarkPath: string,
    watermarkOpacity: number, outputImagePath: string) {
    
    const originalImage = sharp(imagePath);
    const watermark = sharp(watermarkPath);

    originalImage.metadata()
        .then(metadata => {
            return watermark
                .resize(metadata.width * 0.2)
                .ensureAlpha(watermarkOpacity)
                .toBuffer();
        }).then(watermarkBuffer => {
            return originalImage
                .composite([
                    {
                        input: watermarkBuffer,
                        gravity: 'southeast',
                    },
                ])
                .toFile(outputImagePath);
        })
        .catch(error => {
            console.log(error, "Error creating watermark!");
        });
}