import * as sharp from 'sharp';
              
//             export async function watermarkFormating(
//                 watermarkOpacity: number, outputImagePath: string) {
                
//                 const originalImage = sharp(process.env.IMAGE_PATH);
//                 const watermark = sharp(process.env.WATERMARK_PATH);
            
//                 originalImage.metadata()
//                     .then(metadata => {
//                         return watermark
//                             .resize(metadata.width * 0.2)    
//                             .composite([{
//                                 channels: 4,
//                                 background: { r: 0, g: 0, b: 0, alpha: watermarkOpacity }
//                             }])
//                             // .ensureAlpha(watermarkOpacity)
//                             .toBuffer();
//                     }).then(watermarkBuffer => {
//                         return originalImage
//                             .composite([
//                                 {
//                                     input: watermarkBuffer,
//                                     gravity: 'southeast',
//                                 },
//                             ])
//                             .toFile(outputImagePath);
//                     })
//                     .catch(error => {
//                         console.log(error, "Error creating watermark!");
//                     });
//             }
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const AddWatermark = createParamDecorator(async (data: any, ctx: ExecutionContext) => {
//   const request = ctx.switchToHttp().getRequest();

//   // Get the image buffer from the request
//   const imageBuffer = request.file.buffer;

//   // Create a new image object with the same dimensions
  export async function AddWatermark(watermarkOpacity: number, outputImagePath: string){      
    const image = sharp(process.env.IMAGE_PATH).toBuffer();
    const metadata = await image.metadata();
    const newImage = sharp({
        create: {
          width: metadata.width,
          height: metadata.height,
          channels: 4, 
         background: { r: 0, g: 0, b: 0, alpha: watermarkOpacity }
        }
      });
    
      newImage.composite([{ input: image }]);   
    
      const watermarkBuffer = await sharp(process.env.WATERMARK_PATH).toBuffer();
      
      newImage.composite([{
          input: watermarkBuffer,
          gravity: 'southeast'
      }]);
  
      const outputBuffer = await newImage.toBuffer();
  return outputBuffer.toFile(outputImagePath);
}