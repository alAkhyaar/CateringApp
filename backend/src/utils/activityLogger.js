const prisma = require('../config/database');

/**
 * Log aktivitas pengguna untuk monitoring oleh Pemilik
 * @param {number} userId - ID user yang melakukan aktivitas
 * @param {string} action - Jenis aksi (CREATE, UPDATE, DELETE, VIEW)
 * @param {string} module - Modul yang diakses (INCOME, EXPENSE, ORDER, MENU, etc)
 * @param {string} description - Deskripsi aktivitas
 * @param {string} ipAddress - IP Address pengguna (optional)
 */
const logActivity = async (userId, action, module, description, ipAddress = null) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        module,
        description,
        ipAddress,
      },
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = { logActivity };

