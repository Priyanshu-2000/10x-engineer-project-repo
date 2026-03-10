import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable button component with enhanced styling and variants.
 *
 * @component
 * @param {Object} props - Properties passed to component
 * @param {string} props.label - The text to display inside the button.
 * @param {function} props.onClick - Function to call on button click.
 * @param {string} [props.type='button'] - Type attribute of the button element.
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, success, danger).
 * @param {string} [props.size='md'] - Button size (sm, md, lg).
 * @param {string} [props.className] - Additional class names for styling.
 * @param {boolean} [props.disabled=false] - Disable the button if true.
 * @param {boolean} [props.loading=false] - Show loading state if true.
 * @param {React.ReactNode} [props.icon] - Optional icon to display.
 * @param {string} [props.iconPosition='left'] - Position of the icon (left, right).
 * @example
 * return (
 *   <Button 
 *     label="Click Me" 
 *     onClick={() => alert('Clicked!')} 
 *     variant="primary"
 *     size="md"
 *   />
 * )
 */
const Button = ({ 
  label, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  size = 'md',
  className = '', 
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left'
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger'
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  };

  const buttonClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${className}
  `.trim();

  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {label}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
};

export default Button;
