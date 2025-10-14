
import multer from "multer";
const storage = multer.memoryStorage(); 
const limits = {
  fileSize: 5 * 1024 * 1024, 
};
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};
export const upload = multer({ storage, limits, fileFilter });