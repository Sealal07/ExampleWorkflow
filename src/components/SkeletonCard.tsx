import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse flex flex-col h-full">
      <div className="h-40 bg-gray-200 w-full"></div>
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="flex gap-2 my-2">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-9 bg-gray-200 rounded w-full mt-auto"></div>
      </div>
    </div>
  );
};
