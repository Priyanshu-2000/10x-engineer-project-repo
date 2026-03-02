import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable button component for the application.
 *
 * @component
 * @param {Object} props - Properties passed to component
 * @param {string} props.label - The text to display inside the button.
 * @param {function} props.onClick - Function to call on button click.
 * @param {string} [props.type='button'] - Type attribute of the button element.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {boolean} [props.disabled=false] - Disable the button if true.
 * @example
 * return (
 *   <Button label="Click Me" onClick={() => alert('Clicked!')} />
 * )
 */
const Button = ({ label, onClick, type = 'button', className, disabled = false }) => {
  return (
    <button
      type={type}
      className={`py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
