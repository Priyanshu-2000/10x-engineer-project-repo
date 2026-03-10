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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {initialData.id ? 'Edit Collection' : 'New Collection'}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                aria-invalid={errors.name ? 'true' : 'false'}
                placeholder="Enter collection name..."
              />
              {errors.name && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="input resize-none"
                aria-invalid={errors.description ? 'true' : 'false'}
                placeholder="Enter collection description..."
              />
              {errors.description && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.description}</div>}
            </div>
            {submitError && <ErrorMessage message={submitError} />}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                label="Cancel"
                onClick={() => navigate(-1)}
                variant="secondary"
              />
              <Button
                type="submit"
                label={loading ? 'Saving...' : (initialData.id ? 'Update Collection' : 'Create Collection')}
                variant="primary"
                disabled={loading}
                icon={loading ? <LoadingSpinner size="sm" /> : null}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

CollectionForm.propTypes = {
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default CollectionForm;

