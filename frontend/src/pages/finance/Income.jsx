import { useState, useEffect } from 'react';
import { incomesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineTrendingUp,
  HiOutlineCalendar,
} from 'react-icons/hi';

const Income = () => {
  const { canEdit } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    amount: '',
    category: 'Pesanan',
    notes: '',
  });

  const categories = ['Pesanan', 'Lainnya'];

  useEffect(() => {
    fetchIncomes();
  }, [page, search, dateFilter]);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10, search };
      if (dateFilter.start && dateFilter.end) {
        params.startDate = dateFilter.start;
        params.endDate = dateFilter.end;
      }
      const response = await incomesAPI.getAll(params);
      setIncomes(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Gagal memuat data pemasukan');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedIncome) {
        await incomesAPI.update(selectedIncome.id, formData);
        toast.success('Pemasukan berhasil diperbarui');
      } else {
        await incomesAPI.create(formData);
        toast.success('Pemasukan berhasil ditambahkan');
      }
      setIsModalOpen(false);
      resetForm();
      fetchIncomes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan pemasukan');
    }
  };

  const handleDelete = async () => {
    try {
      await incomesAPI.delete(selectedIncome.id);
      toast.success('Pemasukan berhasil dihapus');
      fetchIncomes();
    } catch (error) {
      toast.error('Gagal menghapus pemasukan');
    }
  };

  const openEditModal = (income) => {
    setSelectedIncome(income);
    setFormData({
      date: format(new Date(income.date), 'yyyy-MM-dd'),
      description: income.description,
      amount: income.amount,
      category: income.category,
      notes: income.notes || '',
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedIncome(null);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      amount: '',
      category: 'Pesanan',
      notes: '',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Pemasukan</h1>
          <p className="page-subtitle">Kelola data pemasukan keuangan</p>
        </div>
        {canEdit('finance') && (
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <HiOutlinePlus className="w-5 h-5 mr-2" />
            Tambah Pemasukan
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari deskripsi..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input pl-12"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <HiOutlineCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                className="input pl-12"
                placeholder="Dari tanggal"
              />
            </div>
            <div className="relative">
              <HiOutlineCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                className="input pl-12"
                placeholder="Sampai tanggal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : incomes.length === 0 ? (
          <EmptyState
            icon={HiOutlineTrendingUp}
            title="Belum ada pemasukan"
            description="Mulai dengan menambahkan data pemasukan"
            action={
              canEdit('finance') && (
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                  <HiOutlinePlus className="w-5 h-5 mr-2" />
                  Tambah Pemasukan
                </button>
              )
            }
          />
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Deskripsi</th>
                    <th>Kategori</th>
                    <th className="text-right">Jumlah</th>
                    <th>Dibuat Oleh</th>
                    {canEdit('finance') && <th className="text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((income) => (
                    <tr key={income.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                            <HiOutlineTrendingUp className="w-5 h-5" />
                          </div>
                          <span>{format(new Date(income.date), 'dd MMM yyyy', { locale: id })}</span>
                        </div>
                      </td>
                      <td>
                        <p className="font-medium text-slate-900">{income.description}</p>
                        {income.notes && (
                          <p className="text-xs text-slate-500 truncate max-w-xs">{income.notes}</p>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-success">{income.category}</span>
                      </td>
                      <td className="text-right font-semibold text-emerald-600">
                        {formatCurrency(income.amount)}
                      </td>
                      <td className="text-slate-500">{income.user?.name}</td>
                      {canEdit('finance') && (
                        <td>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(income)}
                              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                            >
                              <HiOutlinePencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedIncome(income);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                            >
                              <HiOutlineTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedIncome ? 'Edit Pemasukan' : 'Tambah Pemasukan'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Tanggal</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              placeholder="Contoh: Pembayaran pesanan #123"
              required
            />
          </div>
          <div>
            <label className="label">Jumlah (Rp)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input"
              placeholder="0"
              required
              min="0"
            />
          </div>
          <div>
            <label className="label">Catatan (Opsional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input min-h-[80px]"
              placeholder="Catatan tambahan..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedIncome ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Pemasukan"
        message={`Apakah Anda yakin ingin menghapus pemasukan "${selectedIncome?.description}"?`}
        confirmText="Ya, Hapus"
      />
    </div>
  );
};

export default Income;

