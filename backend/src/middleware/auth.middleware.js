const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

// Middleware untuk verifikasi JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Akun Anda telah dinonaktifkan.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token telah kadaluarsa. Silakan login kembali.',
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada autentikasi.',
    });
  }
};

// Middleware untuk mengecek role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Tidak terautentikasi.',
      });
    }

    // Super Admin memiliki akses ke semua
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    // Pemilik memiliki akses view ke semua
    if (req.user.role === 'PEMILIK') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melakukan aksi ini.',
      });
    }

    next();
  };
};

// Middleware khusus untuk aksi yang hanya bisa dilakukan (bukan view)
const authorizeAction = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Tidak terautentikasi.',
      });
    }

    // Super Admin memiliki akses ke semua
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melakukan aksi ini.',
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize, authorizeAction };

