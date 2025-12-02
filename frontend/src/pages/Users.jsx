import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineKey,
  HiOutlineUsers,
} from 'react-icons/hi';

const Users = () => {
  const { getRoleName, canEdit } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'ADMIN_CS',
    isActive: true,
  });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll({ page, limit: 10, search, role: roleFilter });
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        const { password, ...updateData } = formData;
        await usersAPI.update(selectedUser.id, updateData);
        toast.success('User berhasil diperbarui');
      } else {
        await usersAPI.create(formData);
        toast.success('User berhasil ditambahkan');
      }
      setIsModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan user');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.resetPassword(selectedUser.id, { newPassword });
      toast.success('Password berhasil direset');
      setIsPasswordModalOpen(false);
      setNewPassword('');
    } catch (error) {
      toast.error('Gagal mereset password');
    }
  };

  const handleDelete = async () => {
    try {
      await usersAPI.delete(selectedUser.id);
      toast.success('User berhasil dihapus');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus user');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role,
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      role: 'ADMIN_CS',
      isActive: true,
    });
  };

  const roles = [
    { value: 'PEMILIK', label: 'Pemilik' },
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'ADMIN_KEUANGAN', label: 'Admin Keuangan' },
    { value: 'ADMIN_CS', label: 'Admin Customer Service' },
    { value: 'ADMIN_MENU', label: 'Admin Menu & Bahan' },
    { value: 'ADMIN_SDM', label: 'Admin SDM' },
  ];

  if (!canEdit('users')) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Kelola User</h1>
          <p className="page-subtitle">Tambah, edit, atau hapus akun pengguna</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <HiOutlinePlus className="w-5 h-5 mr-2" />
          Tambah User
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input pl-12"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="input w-full sm:w-48"
          >
            <option value="">Semua Role</option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : users.length === 0 ? (
          <EmptyState
            icon={HiOutlineUsers}
            title="Belum ada user"
            description="Mulai dengan menambahkan user baru"
            action={
              <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                <HiOutlinePlus className="w-5 h-5 mr-2" />
                Tambah User
              </button>
            }
          />
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <span className="text-primary-700 font-semibold">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.phone || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge badge-info">{getRoleName(user.role)}</span>
                      </td>
                      <td>
                        <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {user.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsPasswordModalOpen(true);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                            title="Reset Password"
                          >
                            <HiOutlineKey className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                            title="Edit"
                          >
                            <HiOutlinePencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                            title="Hapus"
                          >
                            <HiOutlineTrash className="w-5 h-5" />
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Tambah User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nama</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              required
              disabled={!!selectedUser}
            />
          </div>
          {!selectedUser && (
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input"
                required
                minLength={6}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">No. Telepon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="input"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Alamat</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input min-h-[80px]"
            />
          </div>
          {selectedUser && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm text-slate-700">
                User aktif
              </label>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedUser ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Reset Password"
        size="sm"
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-slate-600">
            Reset password untuk user <strong>{selectedUser?.name}</strong>
          </p>
          <div>
            <label className="label">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
              required
              minLength={6}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Hapus User"
        message={`Apakah Anda yakin ingin menghapus user "${selectedUser?.name}"?`}
        confirmText="Ya, Hapus"
      />
    </div>
  );
};

export default Users;

