import { HiOutlineInbox } from 'react-icons/hi';

const EmptyState = ({
  icon: Icon = HiOutlineInbox,
  title = 'Tidak ada data',
  description = 'Belum ada data yang tersedia.',
  action,
}) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;

