import React from 'react';
import PropTypes from 'prop-types';

/**
 * Modal dialog component for displaying pop-up content.
 *
 * @component
 * @param {Object} props - Properties passed to component
 * @param {boolean} props.isOpen - Boolean flag to control modal visibility.
 * @param {function} props.onClose - Function to call for closing the modal.
 * @param {React.ReactNode} props.children - Contents of the modal.
 * @example
 * return (
 *   <Modal isOpen={true} onClose={() => {}}>
 *     <p>Modal Content</p>
 *   </Modal>
 * )
 */
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg w-full max-w-md mx-4">
        <div className="p-4">
          <div className="text-right">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Modal;
