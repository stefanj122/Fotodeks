import * as sharp from 'sharp';
              
            export async function watermarkFormating(
                watermarkOpacity: number, outputImagePath: string, imagePath: string, watermarkPath: string){
                
                const originalImage = sharp(imagePath);
                const watermark = sharp(watermarkPath);
            
                originalImage.metadata()
                    .then(metadata => {
                        return watermark
                            .resize(metadata.width * 0.2, metadata.height * 0.2)    
                            .flatten()
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


            

export async function AddWatermark(watermarkOpacity: number, imagePath: string, watermarkPath: string, outputImagePath: string,
    watermarkPosition: string) {
    
    const imageMeta = await sharp(imagePath).metadata();
    const watermarkBuffer = await sharp(watermarkPath).resize({
        width: 285,
        height: 190,
        fit: sharp.fit.inside
    }).composite([{
        input: Buffer.from([255, 255, 255, watermarkOpacity]),
        raw: {
            width: 1,
            height: 1,
            channels: 4
        },
        tile: true,
        blend: 'dest-in'
    }])
        .png()
        .toBuffer();

    const newImage = await sharp(imagePath)
        .resize(285, 190)
        .composite([{
            input: watermarkBuffer,
            gravity: watermarkPosition
        }]).toBuffer();
    
    await sharp(newImage).toFile(outputImagePath);
}