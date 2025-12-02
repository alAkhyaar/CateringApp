/**
 * Generate nomor order otomatis
 * @param {string} prefix - Prefix untuk nomor order (ORD-IN, ORD-OUT)
 * @returns {string} Nomor order
 */
const generateOrderNumber = (prefix = 'ORD') => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${prefix}-${year}${month}${day}-${random}`;
};

/**
 * Generate nomor karyawan otomatis
 * @param {number} count - Jumlah karyawan saat ini
 * @returns {string} Nomor karyawan
 */
const generateEmployeeId = (count) => {
  return `EMP${(count + 1).toString().padStart(4, '0')}`;
};

/**
 * Format angka ke format Rupiah
 * @param {number} amount - Jumlah uang
 * @returns {string} Format Rupiah
 */
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format tanggal ke format Indonesia
 * @param {Date} date - Tanggal
 * @returns {string} Format tanggal Indonesia
 */
const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Pagination helper
 * @param {number} page - Halaman saat ini
 * @param {number} limit - Jumlah per halaman
 * @returns {object} skip dan take untuk Prisma
 */
const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};

/**
 * Build pagination response
 * @param {array} data - Data hasil query
 * @param {number} total - Total data
 * @param {number} page - Halaman saat ini
 * @param {number} limit - Jumlah per halaman
 * @returns {object} Response dengan pagination
 */
const paginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

module.exports = {
  generateOrderNumber,
  generateEmployeeId,
  formatRupiah,
  formatDate,
  paginate,
  paginationResponse,
};

