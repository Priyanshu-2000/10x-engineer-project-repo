import React from 'react';
import PropTypes from 'prop-types';

/**
 * Error message component for displaying errors.
 *
 * @component
 * @param {Object} props - Properties passed to component
 * @param {string} props.message - Error message text to display.
 * @example
 * return (
 *   <ErrorMessage message="An error occurred." />
 * )
 */
const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
      <p className="font-bold">Error</p>
      <p>{message}</p>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
