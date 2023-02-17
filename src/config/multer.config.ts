import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const imagesStorage = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const destination = join(__dirname, '../../uploads/images/');
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const filename = uuidv4();
      const extension = extname(file.originalname);
      cb(null, filename + extension);
    },
  }),
};

export const watermarkStorage = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const destination = join(__dirname, '../../uploads/watermarks/');
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
};
