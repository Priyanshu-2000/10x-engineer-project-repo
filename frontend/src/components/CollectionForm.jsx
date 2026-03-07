import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Button from './shared/Button';
import ErrorMessage from './shared/ErrorMessage';
import LoadingSpinner from './shared/LoadingSpinner'; // Import LoadingSpinner
import { createCollection } from '../api/collections'; // Import createCollection function

const CollectionForm = ({ initialData = {}, onSuccess }) => {
  const navigate = useNavigate(); // Initialize navigate for redirection

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setSubmitError(null);

    try {
      // Call the imported function
      await createCollection(formData);
      onSuccess();
      navigate('/'); // Redirect to the default page after successful creation
    } catch (error) {
      setSubmitError('Failed to save the collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-collection-form">
      <h2 className="text-2xl font-bold mb-4">New Collection</h2> {/* Add heading */}
      <form className="space-y-4 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-invalid={errors.description ? 'true' : 'false'}
          />
          {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}
        </div>
        {submitError && <ErrorMessage message={submitError} />}
        <div className="flex justify-end">
          <Button
            type="submit"
            label="Create Collection"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          />
        </div>
        {loading && <LoadingSpinner />}
      </form>
    </div>
  );
};

CollectionForm.propTypes = {
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default CollectionForm;

