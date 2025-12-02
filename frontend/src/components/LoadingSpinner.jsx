const LoadingSpinner = ({ size = 'md', text = 'Memuat...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} border-primary-500 border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="mt-4 text-slate-500">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

