import React from 'react';
import PropTypes from 'prop-types';

/**
 * Enhanced error message component with different variants and actions.
 *
 * @component
 * @param {Object} props - Properties passed to component
 * @param {string} props.message - Error message text to display.
 * @param {string} [props.title='Error'] - Title for the error message.
 * @param {string} [props.variant='error'] - Variant of the message (error, warning, info, success).
 * @param {boolean} [props.dismissible=false] - Whether the message can be dismissed.
 * @param {function} [props.onDismiss] - Function to call when dismissing the message.
 * @param {React.ReactNode} [props.action] - Optional action button or element.
 * @param {string} [props.className] - Additional CSS classes.
 * @example
 * return (
 *   <ErrorMessage 
 *     message="An error occurred." 
 *     variant="error"
 *     dismissible
 *     onDismiss={() => setError(null)}
 *   />
 * )
 */
const ErrorMessage = ({ 
  message, 
  title = 'Error',
  variant = 'error',
  dismissible = false,
  onDismiss,
  action,
  className = ''
}) => {
  const variants = {
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-400',
      title: 'text-red-800',
      message: 'text-red-700',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
      message: 'text-yellow-700',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      message: 'text-blue-700',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    success: {
      container: 'bg-green-50 border-green-200',
      icon: 'text-green-400',
      title: 'text-green-800',
      message: 'text-green-700',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  };

  const currentVariant = variants[variant];

  return (
    <div 
      className={`
        rounded-lg border p-4 ${currentVariant.container} ${className}
        animate-slide-down
      `} 
      role="alert"
    >
      <div className="flex items-start">
        {/* Icon */}
        <div className="flex-shrink-0">
          <svg 
            className={`h-5 w-5 ${currentVariant.icon}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={currentVariant.iconPath} 
            />
          </svg>
        </div>

        {/* Content */}
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${currentVariant.title}`}>
            {title}
          </h3>
          <div className={`mt-1 text-sm ${currentVariant.message}`}>
            {typeof message === 'string' ? (
              <p>{message}</p>
            ) : (
              message
            )}
          </div>
          
          {/* Action */}
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onDismiss}
                className={`
                  inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${currentVariant.icon} hover:bg-opacity-20 hover:bg-current
                  focus:ring-offset-${variant}-50 focus:ring-${variant}-600
                `}
                aria-label="Dismiss"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default ErrorMessage;
