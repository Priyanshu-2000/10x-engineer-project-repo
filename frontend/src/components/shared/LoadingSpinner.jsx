import React from 'react';
import PropTypes from 'prop-types';

/**
 * Enhanced loading spinner component with different sizes and styles.
 *
 * @component
 * @param {Object} props - Properties passed to component
 * @param {string} [props.size='md'] - Size of the spinner (sm, md, lg, xl).
 * @param {string} [props.color='blue'] - Color variant of the spinner.
 * @param {string} [props.text] - Optional loading text to display.
 * @param {boolean} [props.overlay=false] - Whether to show as full-screen overlay.
 * @example
 * return (
 *   <LoadingSpinner size="lg" text="Loading..." />
 * )
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  text,
  overlay = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'border-blue-600 dark:border-blue-400',
    gray: 'border-gray-600 dark:border-gray-400',
    green: 'border-green-600 dark:border-green-400',
    yellow: 'border-yellow-600 dark:border-yellow-400',
    red: 'border-red-600 dark:border-red-400'
  };

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div
        className={`
          animate-spin rounded-full border-2 border-gray-200 dark:border-gray-600 border-t-2
          ${sizeClasses[size]} 
          ${colorClasses[color]}
        `}
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinnerElement}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-8">
      {spinnerElement}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['blue', 'gray', 'green', 'yellow', 'red']),
  text: PropTypes.string,
  overlay: PropTypes.bool,
};

export default LoadingSpinner;
