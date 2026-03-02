import React from 'react';

/**
 * Loading spinner component for indicating loading states.
 *
 * @component
 * @example
 * return (
 *   <LoadingSpinner />
 * )
 */
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>
  );
};

export default LoadingSpinner;
