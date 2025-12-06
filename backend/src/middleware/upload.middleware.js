const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'general';
    
    if (req.baseUrl.includes('menus')) {
      folder = 'menus';
    } else if (req.baseUrl.includes('employees')) {
      folder = 'employees';
    } else if (req.baseUrl.includes('users') || req.baseUrl.includes('auth')) {
      folder = 'avatars';
    }

    const uploadPath = path.join(uploadDir, folder);
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedName = file.originalname.toLowerCase().replace(/\s+/g, '-');
    cb(null, uniqueSuffix + path.extname(sanitizedName));
  },
});

// File filter - Multer 2.x compatible
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Multer 2.x: pass error as second argument for rejection
    cb(new Error('Tipe file tidak diizinkan. Hanya JPEG, PNG, GIF, dan WebP yang diperbolehkan.'));
  }
};

// Create multer instance - Multer 2.x compatible
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
});

module.exports = upload;

