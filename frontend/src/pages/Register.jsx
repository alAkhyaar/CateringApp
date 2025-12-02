import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from 'react-icons/hi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'ADMIN_CS',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...data } = formData;
    const result = await register(data);
    
    if (result.success) {
      navigate('/login');
    }
    
    setLoading(false);
  };

  const roles = [
    { value: 'ADMIN_CS', label: 'Admin Customer Service' },
    { value: 'ADMIN_KEUANGAN', label: 'Admin Keuangan' },
    { value: 'ADMIN_MENU', label: 'Admin Menu & Bahan' },
    { value: 'ADMIN_SDM', label: 'Admin SDM' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decoration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="text-center text-white relative z-10">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <span className="text-6xl font-bold">C</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Bergabung Bersama Kami</h2>
          <p className="text-white/80 max-w-md">
            Daftarkan akun Anda untuk mulai mengelola catering dengan sistem yang terintegrasi.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30 lg:hidden">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Buat Akun Baru</h1>
            <p className="text-slate-500 mt-2">Isi data diri Anda</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nama Lengkap</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input pl-12"
                  placeholder="Nama lengkap"
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-12"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input pl-12 pr-12"
                    placeholder="Min. 6 karakter"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff className="w-5 h-5" />
                    ) : (
                      <HiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Konfirmasi Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input pl-12"
                    placeholder="Ulangi password"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="label">No. Telepon</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input pl-12"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>

            <div>
              <label className="label">Alamat</label>
              <div className="relative">
                <HiOutlineLocationMarker className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input pl-12 min-h-[80px]"
                  placeholder="Alamat lengkap"
                />
              </div>
            </div>

            <div>
              <label className="label">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Daftar'
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

