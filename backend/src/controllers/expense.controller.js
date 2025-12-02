const prisma = require('../config/database');
const { logActivity } = require('../utils/activityLogger');
const { paginate, paginationResponse } = require('../utils/helpers');

// Get all expenses
const getAllExpenses = async (req, res) => {
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

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
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
      prisma.expense.count({ where }),
    ]);

    res.json({
      success: true,
      ...paginationResponse(expenses, total, parseInt(page), parseInt(limit)),
    });
  } catch (error) {
    console.error('Get all expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pengeluaran.',
      error: error.message,
    });
  }
};

// Get expense by ID
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Data pengeluaran tidak ditemukan.',
      });
    }

    res.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error('Get expense by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pengeluaran.',
      error: error.message,
    });
  }
};

// Create expense
const createExpense = async (req, res) => {
  try {
    const { date, description, amount, category, notes } = req.body;

    const expense = await prisma.expense.create({
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
      'EXPENSE',
      `${req.user.name} menambah pengeluaran: ${description} - Rp ${amount}`
    );

    res.status(201).json({
      success: true,
      message: 'Data pengeluaran berhasil ditambahkan.',
      data: expense,
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambah data pengeluaran.',
      error: error.message,
    });
  }
};

// Update expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, description, amount, category, notes } = req.body;

    const existingExpense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: 'Data pengeluaran tidak ditemukan.',
      });
    }

    const expense = await prisma.expense.update({
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
      'EXPENSE',
      `${req.user.name} mengubah pengeluaran: ${expense.description}`
    );

    res.json({
      success: true,
      message: 'Data pengeluaran berhasil diperbarui.',
      data: expense,
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui data pengeluaran.',
      error: error.message,
    });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const existingExpense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: 'Data pengeluaran tidak ditemukan.',
      });
    }

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    await logActivity(
      req.user.id,
      'DELETE',
      'EXPENSE',
      `${req.user.name} menghapus pengeluaran: ${existingExpense.description}`
    );

    res.json({
      success: true,
      message: 'Data pengeluaran berhasil dihapus.',
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data pengeluaran.',
      error: error.message,
    });
  }
};

// Get expense summary/recap
const getExpenseSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Total pengeluaran
    const total = await prisma.expense.aggregate({
      where,
      _sum: { amount: true },
      _count: true,
    });

    // Per kategori
    const byCategory = await prisma.expense.groupBy({
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
    console.error('Get expense summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil rekapitulasi pengeluaran.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
};

