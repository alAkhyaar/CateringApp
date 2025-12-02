import { useState, useEffect } from 'react';
import { ordersOutAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  HiOutlineSearch,
  HiOutlinePaperAirplane,
  HiOutlineEye,
} from 'react-icons/hi';
import Modal from '../../components/Modal';

const OrdersOut = () => {
  const { canEdit } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const statuses = ['DELIVERED', 'COMPLETED'];

  useEffect(() => {
    fetchOrders();
  }, [page, search, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersOutAPI.getAll({ page, limit: 10, search, status: statusFilter });
      setOrders(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Gagal memuat data pesanan');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const badges = {
      DELIVERED: 'badge-info',
      COMPLETED: 'badge-success',
    };
    return badges[status] || 'badge-gray';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Pesanan Keluar</h1>
        <p className="page-subtitle">Daftar pesanan yang sudah dikirim</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nomor pesanan atau nama pelanggan..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input pl-12"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="input w-full sm:w-48"
          >
            <option value="">Semua Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={HiOutlinePaperAirplane}
            title="Belum ada pesanan keluar"
            description="Pesanan yang sudah dikirim akan muncul di sini"
          />
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>No. Pesanan</th>
                    <th>Pelanggan</th>
                    <th>Tanggal Kirim</th>
                    <th className="text-right">Total</th>
                    <th>Status</th>
                    <th className="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <p className="font-medium text-slate-900">{order.orderNumber}</p>
                      </td>
                      <td>
                        <p className="font-medium text-slate-900">{order.customerName}</p>
                        <p className="text-xs text-slate-500">{order.customerPhone}</p>
                      </td>
                      <td>{format(new Date(order.deliveryDate), 'dd MMM yyyy', { locale: id })}</td>
                      <td className="text-right font-semibold">{formatCurrency(order.totalAmount)}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsViewModalOpen(true);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                            title="Lihat Detail"
                          >
                            <HiOutlineEye className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* View Detail Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detail Pesanan Keluar"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">No. Pesanan</p>
                <p className="font-medium">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <span className={`badge ${getStatusBadge(selectedOrder.status)}`}>{selectedOrder.status}</span>
              </div>
              <div>
                <p className="text-sm text-slate-500">Pelanggan</p>
                <p className="font-medium">{selectedOrder.customerName}</p>
                <p className="text-sm text-slate-500">{selectedOrder.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Alamat</p>
                <p className="font-medium">{selectedOrder.customerAddress}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tanggal Kirim</p>
                <p className="font-medium">{format(new Date(selectedOrder.deliveryDate), 'dd MMMM yyyy', { locale: id })}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tanggal Selesai</p>
                <p className="font-medium">
                  {selectedOrder.completedDate 
                    ? format(new Date(selectedOrder.completedDate), 'dd MMMM yyyy', { locale: id })
                    : '-'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-2">Item Pesanan</p>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Item</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Harga</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, index) => (
                      <tr key={index} className="border-t border-slate-100">
                        <td className="px-4 py-2 text-sm">{item.menuName}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-2 text-sm text-right font-medium">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50">
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-right font-medium">Total</td>
                      <td className="px-4 py-2 text-right font-bold text-primary-600">{formatCurrency(selectedOrder.totalAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersOut;

