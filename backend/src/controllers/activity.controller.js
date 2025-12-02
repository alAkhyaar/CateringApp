const prisma = require('../config/database');
const { paginate, paginationResponse } = require('../utils/helpers');

// Get all activities (for Pemilik monitoring)
const getAllActivities = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, module, action, startDate, endDate } = req.query;
    const { skip, take } = paginate(parseInt(page), parseInt(limit));

    const where = {};
    
    if (userId) {
      where.userId = parseInt(userId);
    }
    
    if (module) {
      where.module = module;
    }
    
    if (action) {
      where.action = action;
    }
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, role: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.activityLog.count({ where }),
    ]);

    res.json({
      success: true,
      ...paginationResponse(activities, total, parseInt(page), parseInt(limit)),
    });
  } catch (error) {
    console.error('Get all activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data aktivitas.',
      error: error.message,
    });
  }
};

// Get activity summary
const getActivitySummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Total activities
    const total = await prisma.activityLog.count({ where });

    // By module
    const byModule = await prisma.activityLog.groupBy({
      by: ['module'],
      where,
      _count: true,
    });

    // By action
    const byAction = await prisma.activityLog.groupBy({
      by: ['action'],
      where,
      _count: true,
    });

    // By user
    const byUser = await prisma.activityLog.groupBy({
      by: ['userId'],
      where,
      _count: true,
    });

    // Get user names
    const userIds = byUser.map(u => u.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, role: true },
    });

    const byUserWithNames = byUser.map(u => ({
      ...u,
      user: users.find(user => user.id === u.userId),
    }));

    // Recent activities (last 10)
    const recent = await prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    res.json({
      success: true,
      data: {
        total,
        byModule,
        byAction,
        byUser: byUserWithNames,
        recent,
      },
    });
  } catch (error) {
    console.error('Get activity summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil ringkasan aktivitas.',
      error: error.message,
    });
  }
};

// Get user activity
const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const { skip, take } = paginate(parseInt(page), parseInt(limit));

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.activityLog.count({ where: { userId: parseInt(userId) } }),
    ]);

    res.json({
      success: true,
      ...paginationResponse(activities, total, parseInt(page), parseInt(limit)),
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil aktivitas user.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllActivities,
  getActivitySummary,
  getUserActivity,
};

