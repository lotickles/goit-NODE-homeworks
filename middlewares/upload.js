import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp'); // Store temporarily before processing
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use original file name
  }
});

const upload = multer({ storage });

// import multer from "multer";
// import path from "path";

// const tempPath = path.join("tmp");//temp folder-

// const multerConfig = multer.diskStorage({
//   destination: tempPath,
//   filename: (_req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ dest: 'tmp/' });

// export { upload };

