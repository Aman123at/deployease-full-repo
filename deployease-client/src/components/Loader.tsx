import  { FC } from 'react';

const Loader:FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
};

export default Loader;