// import multer from 'multer';
// import path from 'path';

// // Cấu hình nơi lưu ảnh
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../../public/uploads'));
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const filename = `avatar_${Date.now()}${ext}`;
//         cb(null, filename);
//     },
// });

// export const upload = multer({ storage });
