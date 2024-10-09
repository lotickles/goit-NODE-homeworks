// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';

// // Temporary storage configuration
// const tempPath = path.join('tmp');
// const publicPath = path.join('public/avatars');

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, tempPath); // Store temporarily
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname); // Use original file name
//   }
// });

// const upload = multer({ storage });

// // Route for handling file uploads and moving to public folder
// app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
//   const tempFilePath = path.join(tempPath, req.file.originalname);
//   const publicFilePath = path.join(publicPath, req.file.originalname);

//   // Move file from temporary to public folder
//   fs.rename(tempFilePath, publicFilePath, (err) => {
//     if (err) {
//       console.error('Error moving file:', err);
//       return res.status(500).send('File upload failed.');
//     }
//     res.status(200).send('File uploaded and moved to public folder.');
//   });
// });

// export { upload };

import multer from "multer";
import path from "path";

const tempPath = path.join("tmp");//temp folder-

const multerConfig = multer.diskStorage({
  destination: tempPath,
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage : multerConfig });

export { upload };