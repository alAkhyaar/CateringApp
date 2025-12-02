import { useState, useEffect } from 'react';
import { activitiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  HiOutlineSearch,
  HiOutlineClipboardCheck,
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineLogin,
  HiOutlineLogout,
  HiOutlineEye,
} from 'react-icons/hi';

const Activities = () => {
  const { getRoleName, canView } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  const modules = ['AUTH', 'USER', 'PROFILE', 'INCOME', 'EXPENSE', 'ORDER_IN', 'ORDER_OUT', 'MENU', 'INGREDIENT', 'EMPLOYEE'];
  const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW'];

  useEffect(() => {
    fetchActivities();
  }, [page, moduleFilter, actionFilter, dateFilter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20, module: moduleFilter, action: actionFilter };
      if (dateFilter.start && dateFilter.end) {
        params.startDate = dateFilter.start;
        params.endDate = dateFilter.end;
      }
      const response = await activitiesAPI.getAll(params);
      setActivities(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Gagal memuat log aktivitas');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      CREATE: HiOutlinePlus,
      UPDATE: HiOutlinePencil,
      DELETE: HiOutlineTrash,
      LOGIN: HiOutlineLogin,
      LOGOUT: HiOutlineLogout,
      VIEW: HiOutlineEye,
    };
    return icons[action] || HiOutlineClipboardCheck;
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: 'bg-emerald-100 text-emerald-600',
      UPDATE: 'bg-blue-100 text-blue-600',
      DELETE: 'bg-red-100 text-red-600',
      LOGIN: 'bg-green-100 text-green-600',
      LOGOUT: 'bg-slate-100 text-slate-600',
      VIEW: 'bg-purple-100 text-purple-600',
    };
    return colors[action] || 'bg-slate-100 text-slate-600';
  };

  if (!canView('activities')) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Log Aktivitas</h1>
        <p className="page-subtitle">Pantau aktivitas pengguna dalam sistem</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="p-4 flex flex-col lg:flex-row gap-4">
          <select
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              setPage(1);
            }}
            className="input w-full lg:w-40"
          >
            <option value="">Semua Modul</option>
            {modules.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="input w-full lg:w-40"
          >
            <option value="">Semua Aksi</option>
            {actions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <HiOutlineCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                className="input pl-12"
                placeholder="Dari tanggal"
              />
            </div>
            <div className="relative flex-1">
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

      {/* Activity List */}
      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : activities.length === 0 ? (
          <EmptyState
            icon={HiOutlineClipboardCheck}
            title="Belum ada aktivitas"
            description="Log aktivitas akan muncul di sini"
          />
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {activities.map((activity) => {
                const ActionIcon = getActionIcon(activity.action);
                return (
                  <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getActionColor(activity.action)}`}>
                        <ActionIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900">{activity.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">{activity.user?.name}</span>
                            <span className="badge badge-gray text-xs">{getRoleName(activity.user?.role)}</span>
                          </span>
                          <span>•</span>
                          <span>{format(new Date(activity.createdAt), 'dd MMM yyyy, HH:mm:ss', { locale: id })}</span>
                          <span>•</span>
                          <span className="badge badge-info text-xs">{activity.module}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`badge ${
                          activity.action === 'CREATE' ? 'badge-success' :
                          activity.action === 'UPDATE' ? 'badge-info' :
                          activity.action === 'DELETE' ? 'badge-danger' :
                          'badge-gray'
                        }`}>
                          {activity.action}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default Activities;

