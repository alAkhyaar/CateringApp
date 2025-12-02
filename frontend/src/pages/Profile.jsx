import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineLockClosed,
  HiOutlineCamera,
} from 'react-icons/hi';

const Profile = () => {
  const { user, updateProfile, changePassword, getRoleName } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { ...profileData };
    if (avatar) {
      data.avatar = avatar;
    }

    await updateProfile(data);
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }

    setLoading(true);
    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    
    if (result.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Profil Saya</h1>
        <p className="page-subtitle">Kelola informasi akun Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card lg:col-span-1">
          <div className="p-6 text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-primary-700">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white cursor-pointer hover:bg-primary-600 transition-colors shadow-lg">
                <HiOutlineCamera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">{user?.name}</h3>
            <p className="text-slate-500">{user?.email}</p>
            <span className="inline-block mt-2 badge badge-info">
              {getRoleName(user?.role)}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card lg:col-span-2">
          {/* Tabs */}
          <div className="border-b border-slate-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'profile'
                    ? 'text-primary-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Edit Profil
                {activeTab === 'profile' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'password'
                    ? 'text-primary-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Ubah Password
                {activeTab === 'password' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'profile' ? (
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div>
                  <label className="label">Nama Lengkap</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input pl-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Email</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={user?.email}
                      className="input pl-12 bg-slate-50"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Email tidak dapat diubah</p>
                </div>

                <div>
                  <label className="label">No. Telepon</label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="input pl-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Alamat</label>
                  <div className="relative">
                    <HiOutlineLocationMarker className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="input pl-12 min-h-[100px]"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="label">Password Saat Ini</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="input pl-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Password Baru</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="input pl-12"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="input pl-12"
                      required
                    />
                  </div>
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || passwordData.newPassword !== passwordData.confirmPassword}
                  className="btn btn-primary"
                >
                  {loading ? 'Menyimpan...' : 'Ubah Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

