import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HiOutlineCurrencyDollar,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineUserGroup,
  HiOutlineExclamation,
  HiOutlineArrowRight,
} from 'react-icons/hi';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const Dashboard = () => {
  const { user, getRoleName, canView } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await reportsAPI.getDashboard();
      setData(response.data.data);
    } catch (error) {
      console.error('Fetch dashboard error:', error);
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

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      name: 'Pemasukan Bulan Ini',
      value: formatCurrency(data?.summary?.incomeThisMonth || 0),
      icon: HiOutlineTrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      show: canView('finance'),
      link: '/finance/income',
    },
    {
      name: 'Pengeluaran Bulan Ini',
      value: formatCurrency(data?.summary?.expenseThisMonth || 0),
      icon: HiOutlineTrendingDown,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      show: canView('finance'),
      link: '/finance/expense',
    },
    {
      name: 'Keuntungan',
      value: formatCurrency(data?.summary?.profit || 0),
      icon: HiOutlineCurrencyDollar,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
      show: canView('finance'),
      link: '/finance/recap',
    },
    {
      name: 'Pesanan Bulan Ini',
      value: data?.summary?.ordersThisMonth || 0,
      icon: HiOutlineClipboardList,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      show: canView('orders'),
      link: '/orders/in',
    },
    {
      name: 'Menu Tersedia',
      value: data?.summary?.totalMenus || 0,
      icon: HiOutlineCollection,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      show: canView('menu'),
      link: '/menu/list',
    },
    {
      name: 'Total Karyawan',
      value: data?.summary?.totalEmployees || 0,
      icon: HiOutlineUserGroup,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
      show: canView('hr'),
      link: '/hr/employees',
    },
  ];

  const visibleStats = stats.filter((stat) => stat.show);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Selamat datang kembali, {user?.name}! 👋
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {visibleStats.map((stat, index) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="stat-card group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Lihat detail
              <HiOutlineArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Low Stock Alert */}
      {canView('menu') && data?.summary?.lowStockCount > 0 && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
            <HiOutlineExclamation className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800">Peringatan Stok Rendah</h3>
            <p className="text-amber-700 text-sm">
              Ada {data.summary.lowStockCount} bahan dengan stok di bawah minimum.
            </p>
          </div>
          <Link to="/menu/ingredients" className="btn btn-secondary text-sm">
            Lihat Detail
          </Link>
        </div>
      )}

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        {canView('orders') && (
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Pesanan Terbaru</h3>
              <Link to="/orders/in" className="text-sm text-primary-600 hover:text-primary-700">
                Lihat Semua
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {data?.recentOrders?.length > 0 ? (
                data.recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{order.orderNumber}</p>
                        <p className="text-sm text-slate-500">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <span className={`badge ${
                          order.status === 'COMPLETED' ? 'badge-success' :
                          order.status === 'PENDING' ? 'badge-warning' :
                          order.status === 'CANCELLED' ? 'badge-danger' :
                          'badge-info'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  Belum ada pesanan
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Activities */}
        {canView('activities') && (
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Aktivitas Terbaru</h3>
              <Link to="/activities" className="text-sm text-primary-600 hover:text-primary-700">
                Lihat Semua
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {data?.recentActivities?.length > 0 ? (
                data.recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                        {activity.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 truncate">{activity.description}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {activity.user?.name} • {format(new Date(activity.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  Belum ada aktivitas
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Role Info for non-admin users */}
      {!canView('activities') && (
        <div className="mt-8 p-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl text-white">
          <h3 className="text-xl font-bold mb-2">Halo, {user?.name}!</h3>
          <p className="text-white/80 mb-4">
            Anda login sebagai <strong>{getRoleName(user?.role)}</strong>.
            Gunakan menu di sidebar untuk mengakses fitur yang tersedia untuk role Anda.
          </p>
          <div className="flex flex-wrap gap-2">
            {canView('finance') && (
              <Link to="/finance/income" className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                Kelola Keuangan
              </Link>
            )}
            {canView('orders') && (
              <Link to="/orders/in" className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                Kelola Pesanan
              </Link>
            )}
            {canView('menu') && (
              <Link to="/menu/list" className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                Kelola Menu
              </Link>
            )}
            {canView('hr') && (
              <Link to="/hr/employees" className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                Kelola Karyawan
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

