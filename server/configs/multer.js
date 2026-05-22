//  import multer from 'multer';

//  const storage = multer.diskStorage({})
//     const upload = multer({storage})

//     export default upload;

import multer from 'multer';
import fs from 'fs';

// ✅ Automatically check for or create an 'uploads' directory in your backend root
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Set up disk storage with explicit destination and filename rules
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

export default upload;
