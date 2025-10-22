import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import * as path from "path";
import * as fs from 'fs'
import { NotFoundException } from "@nestjs/common";

export const createUnifiedUploadConfig = (): MulterOptions => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      let subFolder: string | undefined;

      if (file.fieldname === 'profileImage') {
        subFolder = 'testmonial-photos';
      }else if (file.fieldname === 'logo') {
        subFolder = 'partner-photos'; 
      }
      else if(file.fieldname === 'blog_image'){
        subFolder = 'blog-photos'
      }
      else if(file.fieldname === 'category_image'){
        subFolder = 'category-photos'
      }

      console.log('Received file.fieldname:', file.fieldname);

      if (!subFolder) {
        const error = new Error(`Invalid upload field name: ${file.fieldname}`);
        return cb(error as Error, '' as any); // ✅ Fixed TS error
      }

    //  const uploadDir = path.join(__dirname, '..', '..', 'uploads', subFolder);
      const uploadDir = path.join(process.cwd(), 'uploads', subFolder); // Use process.cwd() for absolute path
      console.log('Uploading to:', uploadDir);

      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      } catch (err) {
        cb(err as Error, '' as any); // ✅ Fixed TS error
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 4,
  },
  // Image transformation should be handled after upload, not in MulterOptions
});


// ✅ Delete file helper
export const deleteFile = (filepath: string) => {
  if (!filepath) throw new NotFoundException('file not found');
  const fullPath = path.join(process.cwd(), filepath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Failed to delete file:', err);
    } else {
      console.log('File deleted successfully');
    }
  });
};


export const TestimonialFileFields = [
  { name: 'profileImage', maxCount: 1 },
];

export const PartnerFileFields = [
  { name: 'logo', maxCount: 1 },
]
export const BlogFileFields = [
  { name: 'blog_image', maxCount: 1 },
]
export const CategoryFileFields = [
  { name: 'category_image', maxCount: 1 },
]

export const testimonialUploadConfig = createUnifiedUploadConfig()
export const partnerUploadConfig = createUnifiedUploadConfig()
export const blogUploadConfig = createUnifiedUploadConfig()
export const CategoryUploadConfig = createUnifiedUploadConfig()