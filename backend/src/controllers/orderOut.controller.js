const prisma = require('../config/database');
const { logActivity } = require('../utils/activityLogger');
const { paginate, paginationResponse, generateOrderNumber } = require('../utils/helpers');

// Get all orders out
const getAllOrdersOut = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, startDate, endDate } = req.query;
    const { skip, take } = paginate(parseInt(page), parseInt(limit));

    const where = {};
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (startDate && endDate) {
      where.deliveryDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [orders, total] = await Promise.all([
      prisma.orderOut.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true },
          },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.orderOut.count({ where }),
    ]);

    res.json({
      success: true,
      ...paginationResponse(orders, total, parseInt(page), parseInt(limit)),
    });
  } catch (error) {
    console.error('Get all orders out error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pesanan keluar.',
      error: error.message,
    });
  }
};

// Get order out by ID
const getOrderOutById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.orderOut.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { id: true, name: true },
        },
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan.',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get order out by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pesanan.',
      error: error.message,
    });
  }
};

// Create order out
const createOrderOut = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerAddress,
      orderDate,
      deliveryDate,
      completedDate,
      status,
      notes,
      items,
    } = req.body;

    // Calculate total
    let totalAmount = 0;
    const orderItems = items.map(item => {
      const subtotal = item.quantity * item.unitPrice;
      totalAmount += subtotal;
      return {
        menuId: item.menuId || null,
        menuName: item.menuName,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice),
        subtotal: subtotal,
        notes: item.notes,
      };
    });

    const order = await prisma.orderOut.create({
      data: {
        orderNumber: generateOrderNumber('ORD-OUT'),
        customerName,
        customerPhone,
        customerAddress,
        orderDate: new Date(orderDate),
        deliveryDate: new Date(deliveryDate),
        completedDate: completedDate ? new Date(completedDate) : null,
        totalAmount,
        status: status || 'DELIVERED',
        notes,
        createdBy: req.user.id,
        items: {
          create: orderItems,
        },
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
        items: true,
      },
    });

    await logActivity(
      req.user.id,
      'CREATE',
      'ORDER_OUT',
      `${req.user.name} menambah pesanan keluar: ${order.orderNumber} untuk ${customerName}`
    );

    res.status(201).json({
      success: true,
      message: 'Pesanan keluar berhasil ditambahkan.',
      data: order,
    });
  } catch (error) {
    console.error('Create order out error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambah pesanan.',
      error: error.message,
    });
  }
};

// Update order out
const updateOrderOut = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerPhone,
      customerAddress,
      orderDate,
      deliveryDate,
      completedDate,
      status,
      notes,
      items,
    } = req.body;

    const existingOrder = await prisma.orderOut.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan.',
      });
    }

    // Calculate total if items updated
    let totalAmount = existingOrder.totalAmount;
    if (items && items.length > 0) {
      totalAmount = 0;
      const orderItems = items.map(item => {
        const subtotal = item.quantity * item.unitPrice;
        totalAmount += subtotal;
        return {
          menuId: item.menuId || null,
          menuName: item.menuName,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice),
          subtotal: subtotal,
          notes: item.notes,
        };
      });

      await prisma.orderOutItem.deleteMany({
        where: { orderId: parseInt(id) },
      });

      await prisma.orderOutItem.createMany({
        data: orderItems.map(item => ({
          ...item,
          orderId: parseInt(id),
        })),
      });
    }

    const order = await prisma.orderOut.update({
      where: { id: parseInt(id) },
      data: {
        customerName,
        customerPhone,
        customerAddress,
        orderDate: orderDate ? new Date(orderDate) : undefined,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
        completedDate: completedDate ? new Date(completedDate) : undefined,
        totalAmount,
        status,
        notes,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
        items: true,
      },
    });

    await logActivity(
      req.user.id,
      'UPDATE',
      'ORDER_OUT',
      `${req.user.name} mengubah pesanan keluar: ${order.orderNumber}`
    );

    res.json({
      success: true,
      message: 'Pesanan berhasil diperbarui.',
      data: order,
    });
  } catch (error) {
    console.error('Update order out error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui pesanan.',
      error: error.message,
    });
  }
};

// Delete order out
const deleteOrderOut = async (req, res) => {
  try {
    const { id } = req.params;

    const existingOrder = await prisma.orderOut.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan.',
      });
    }

    await prisma.orderOut.delete({
      where: { id: parseInt(id) },
    });

    await logActivity(
      req.user.id,
      'DELETE',
      'ORDER_OUT',
      `${req.user.name} menghapus pesanan keluar: ${existingOrder.orderNumber}`
    );

    res.json({
      success: true,
      message: 'Pesanan berhasil dihapus.',
    });
  } catch (error) {
    console.error('Delete order out error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus pesanan.',
      error: error.message,
    });
  }
};

// Get order out summary
const getOrderOutSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.deliveryDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const total = await prisma.orderOut.aggregate({
      where,
      _sum: { totalAmount: true },
      _count: true,
    });

    const byStatus = await prisma.orderOut.groupBy({
      by: ['status'],
      where,
      _sum: { totalAmount: true },
      _count: true,
    });

    res.json({
      success: true,
      data: {
        total: total._sum.totalAmount || 0,
        count: total._count,
        byStatus,
      },
    });
  } catch (error) {
    console.error('Get order out summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil rekapitulasi pesanan.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrdersOut,
  getOrderOutById,
  createOrderOut,
  updateOrderOut,
  deleteOrderOut,
  getOrderOutSummary,
};

