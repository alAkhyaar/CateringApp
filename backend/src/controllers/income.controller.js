const prisma = require('../config/database');
const { logActivity } = require('../utils/activityLogger');
const { paginate, paginationResponse } = require('../utils/helpers');

// Get all incomes
const getAllIncomes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, startDate, endDate, category } = req.query;
    const { skip, take } = paginate(parseInt(page), parseInt(limit));

    const where = {};
    
    if (search) {
      where.description = { contains: search };
    }
    
    if (category) {
      where.category = category;
    }
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [incomes, total] = await Promise.all([
      prisma.income.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { date: 'desc' },
        skip,
        take,
      }),
      prisma.income.count({ where }),
    ]);

    res.json({
      success: true,
      ...paginationResponse(incomes, total, parseInt(page), parseInt(limit)),
    });
  } catch (error) {
    console.error('Get all incomes error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pemasukan.',
      error: error.message,
    });
  }
};

// Get income by ID
const getIncomeById = async (req, res) => {
  try {
    const { id } = req.params;

    const income = await prisma.income.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Data pemasukan tidak ditemukan.',
      });
    }

    res.json({
      success: true,
      data: income,
    });
  } catch (error) {
    console.error('Get income by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pemasukan.',
      error: error.message,
    });
  }
};

// Create income
const createIncome = async (req, res) => {
  try {
    const { date, description, amount, category, notes } = req.body;

    const income = await prisma.income.create({
      data: {
        date: new Date(date),
        description,
        amount: parseFloat(amount),
        category,
        notes,
        createdBy: req.user.id,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    await logActivity(
      req.user.id,
      'CREATE',
      'INCOME',
      `${req.user.name} menambah pemasukan: ${description} - Rp ${amount}`
    );

    res.status(201).json({
      success: true,
      message: 'Data pemasukan berhasil ditambahkan.',
      data: income,
    });
  } catch (error) {
    console.error('Create income error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambah data pemasukan.',
      error: error.message,
    });
  }
};

// Update income
const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, description, amount, category, notes } = req.body;

    const existingIncome = await prisma.income.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingIncome) {
      return res.status(404).json({
        success: false,
        message: 'Data pemasukan tidak ditemukan.',
      });
    }

    const income = await prisma.income.update({
      where: { id: parseInt(id) },
      data: {
        date: date ? new Date(date) : undefined,
        description,
        amount: amount ? parseFloat(amount) : undefined,
        category,
        notes,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    await logActivity(
      req.user.id,
      'UPDATE',
      'INCOME',
      `${req.user.name} mengubah pemasukan: ${income.description}`
    );

    res.json({
      success: true,
      message: 'Data pemasukan berhasil diperbarui.',
      data: income,
    });
  } catch (error) {
    console.error('Update income error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui data pemasukan.',
      error: error.message,
    });
  }
};

// Delete income
const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const existingIncome = await prisma.income.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingIncome) {
      return res.status(404).json({
        success: false,
        message: 'Data pemasukan tidak ditemukan.',
      });
    }

    await prisma.income.delete({
      where: { id: parseInt(id) },
    });

    await logActivity(
      req.user.id,
      'DELETE',
      'INCOME',
      `${req.user.name} menghapus pemasukan: ${existingIncome.description}`
    );

    res.json({
      success: true,
      message: 'Data pemasukan berhasil dihapus.',
    });
  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data pemasukan.',
      error: error.message,
    });
  }
};

// Get income summary/recap
const getIncomeSummary = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Total pemasukan
    const total = await prisma.income.aggregate({
      where,
      _sum: { amount: true },
      _count: true,
    });

    // Per kategori
    const byCategory = await prisma.income.groupBy({
      by: ['category'],
      where,
      _sum: { amount: true },
      _count: true,
    });

    res.json({
      success: true,
      data: {
        total: total._sum.amount || 0,
        count: total._count,
        byCategory,
      },
    });
  } catch (error) {
    console.error('Get income summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil rekapitulasi pemasukan.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
  getIncomeSummary,
};

