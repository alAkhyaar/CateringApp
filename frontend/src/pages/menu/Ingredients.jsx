import { useState, useEffect } from 'react';
import { ingredientsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineCube,
  HiOutlineExclamation,
} from 'react-icons/hi';

const Ingredients = () => {
  const { canEdit } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Bahan Pokok',
    stock: '',
    unit: 'kg',
    minStock: '',
    price: '',
    supplier: '',
    notes: '',
  });

  const categories = ['Bahan Pokok', 'Protein', 'Sayuran', 'Bumbu', 'Minuman', 'Lainnya'];
  const units = ['kg', 'gram', 'liter', 'ml', 'pcs', 'pack', 'box'];

  useEffect(() => {
    fetchIngredients();
  }, [page, search, categoryFilter, lowStockFilter]);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const response = await ingredientsAPI.getAll({
        page,
        limit: 10,
        search,
        category: categoryFilter,
        lowStock: lowStockFilter,
      });
      setIngredients(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Gagal memuat data bahan');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedIngredient) {
        await ingredientsAPI.update(selectedIngredient.id, formData);
        toast.success('Bahan berhasil diperbarui');
      } else {
        await ingredientsAPI.create(formData);
        toast.success('Bahan berhasil ditambahkan');
      }
      setIsModalOpen(false);
      resetForm();
      fetchIngredients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan bahan');
    }
  };

  const handleDelete = async () => {
    try {
      await ingredientsAPI.delete(selectedIngredient.id);
      toast.success('Bahan berhasil dihapus');
      fetchIngredients();
    } catch (error) {
      toast.error('Gagal menghapus bahan');
    }
  };

  const openEditModal = (ingredient) => {
    setSelectedIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      category: ingredient.category,
      stock: ingredient.stock,
      unit: ingredient.unit,
      minStock: ingredient.minStock,
      price: ingredient.price,
      supplier: ingredient.supplier || '',
      notes: ingredient.notes || '',
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedIngredient(null);
    setFormData({
      name: '',
      category: 'Bahan Pokok',
      stock: '',
      unit: 'kg',
      minStock: '',
      price: '',
      supplier: '',
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

  const isLowStock = (ingredient) => {
    return parseFloat(ingredient.stock) <= parseFloat(ingredient.minStock);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Stok Bahan</h1>
          <p className="page-subtitle">Kelola stok bahan baku</p>
        </div>
        {canEdit('menu') && (
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <HiOutlinePlus className="w-5 h-5 mr-2" />
            Tambah Bahan
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
              placeholder="Cari nama bahan..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input pl-12"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="input w-full md:w-48"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={lowStockFilter}
              onChange={(e) => {
                setLowStockFilter(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">Stok Rendah</span>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : ingredients.length === 0 ? (
          <EmptyState
            icon={HiOutlineCube}
            title="Belum ada bahan"
            description="Mulai dengan menambahkan data bahan baku"
            action={
              canEdit('menu') && (
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                  <HiOutlinePlus className="w-5 h-5 mr-2" />
                  Tambah Bahan
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
                    <th>Nama Bahan</th>
                    <th>Kategori</th>
                    <th className="text-right">Stok</th>
                    <th className="text-right">Stok Min</th>
                    <th className="text-right">Harga/Unit</th>
                    <th>Supplier</th>
                    {canEdit('menu') && <th className="text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.id} className={isLowStock(ingredient) ? 'bg-red-50' : ''}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isLowStock(ingredient) ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'
                          }`}>
                            {isLowStock(ingredient) ? (
                              <HiOutlineExclamation className="w-5 h-5" />
                            ) : (
                              <HiOutlineCube className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{ingredient.name}</p>
                            {isLowStock(ingredient) && (
                              <span className="text-xs text-red-600">Stok Rendah!</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">{ingredient.category}</span>
                      </td>
                      <td className={`text-right font-semibold ${isLowStock(ingredient) ? 'text-red-600' : ''}`}>
                        {ingredient.stock} {ingredient.unit}
                      </td>
                      <td className="text-right text-slate-500">
                        {ingredient.minStock} {ingredient.unit}
                      </td>
                      <td className="text-right">{formatCurrency(ingredient.price)}</td>
                      <td className="text-slate-500">{ingredient.supplier || '-'}</td>
                      {canEdit('menu') && (
                        <td>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(ingredient)}
                              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                            >
                              <HiOutlinePencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedIngredient(ingredient);
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
        title={selectedIngredient ? 'Edit Bahan' : 'Tambah Bahan'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nama Bahan</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Contoh: Beras"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="label">Satuan</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="input"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Stok</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="input"
                placeholder="0"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="label">Stok Minimum</label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="input"
                placeholder="0"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="label">Harga/Unit (Rp)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input"
                placeholder="0"
                required
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="label">Supplier</label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="input"
              placeholder="Nama supplier..."
            />
          </div>
          <div>
            <label className="label">Catatan</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input min-h-[60px]"
              placeholder="Catatan tambahan..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedIngredient ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Bahan"
        message={`Apakah Anda yakin ingin menghapus bahan "${selectedIngredient?.name}"?`}
        confirmText="Ya, Hapus"
      />
    </div>
  );
};

export default Ingredients;

