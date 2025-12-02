const prisma = require('../config/database');
const { logActivity } = require('../utils/activityLogger');
const { paginate, paginationResponse, generateOrderNumber } = require('../utils/helpers');

// Get all orders in
const getAllOrdersIn = async (req, res) => {
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
      where.orderDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [orders, total] = await Promise.all([
      prisma.orderIn.findMany({
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
      prisma.orderIn.count({ where }),
    ]);

    res.json({
      success: true,
      ...paginationResponse(orders, total, parseInt(page), parseInt(limit)),
    });
  } catch (error) {
    console.error('Get all orders in error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pesanan masuk.',
      error: error.message,
    });
  }
};

// Get order in by ID
const getOrderInById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.orderIn.findUnique({
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
    console.error('Get order in by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pesanan.',
      error: error.message,
    });
  }
};

// Create order in
const createOrderIn = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerAddress,
      orderDate,
      deliveryDate,
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

    const order = await prisma.orderIn.create({
      data: {
        orderNumber: generateOrderNumber('ORD-IN'),
        customerName,
        customerPhone,
        customerAddress,
        orderDate: new Date(orderDate),
        deliveryDate: new Date(deliveryDate),
        totalAmount,
        status: status || 'PENDING',
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
      'ORDER_IN',
      `${req.user.name} menambah pesanan masuk: ${order.orderNumber} untuk ${customerName}`
    );

    res.status(201).json({
      success: true,
      message: 'Pesanan masuk berhasil ditambahkan.',
      data: order,
    });
  } catch (error) {
    console.error('Create order in error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambah pesanan.',
      error: error.message,
    });
  }
};

// Update order in
const updateOrderIn = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerPhone,
      customerAddress,
      orderDate,
      deliveryDate,
      status,
      notes,
      items,
    } = req.body;

    const existingOrder = await prisma.orderIn.findUnique({
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

      // Delete existing items and create new ones
      await prisma.orderInItem.deleteMany({
        where: { orderId: parseInt(id) },
      });

      await prisma.orderInItem.createMany({
        data: orderItems.map(item => ({
          ...item,
          orderId: parseInt(id),
        })),
      });
    }

    const order = await prisma.orderIn.update({
      where: { id: parseInt(id) },
      data: {
        customerName,
        customerPhone,
        customerAddress,
        orderDate: orderDate ? new Date(orderDate) : undefined,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
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
      'ORDER_IN',
      `${req.user.name} mengubah pesanan masuk: ${order.orderNumber}`
    );

    res.json({
      success: true,
      message: 'Pesanan berhasil diperbarui.',
      data: order,
    });
  } catch (error) {
    console.error('Update order in error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui pesanan.',
      error: error.message,
    });
  }
};

// Delete order in
const deleteOrderIn = async (req, res) => {
  try {
    const { id } = req.params;

    const existingOrder = await prisma.orderIn.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan.',
      });
    }

    await prisma.orderIn.delete({
      where: { id: parseInt(id) },
    });

    await logActivity(
      req.user.id,
      'DELETE',
      'ORDER_IN',
      `${req.user.name} menghapus pesanan masuk: ${existingOrder.orderNumber}`
    );

    res.json({
      success: true,
      message: 'Pesanan berhasil dihapus.',
    });
  } catch (error) {
    console.error('Delete order in error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus pesanan.',
      error: error.message,
    });
  }
};

// Get order in summary
const getOrderInSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.orderDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const total = await prisma.orderIn.aggregate({
      where,
      _sum: { totalAmount: true },
      _count: true,
    });

    const byStatus = await prisma.orderIn.groupBy({
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
    console.error('Get order in summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil rekapitulasi pesanan.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrdersIn,
  getOrderInById,
  createOrderIn,
  updateOrderIn,
  deleteOrderIn,
  getOrderInSummary,
};

