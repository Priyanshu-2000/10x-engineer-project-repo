import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPrompt, updatePrompt } from '../api/prompts';
import Button from './shared/Button';
import ErrorMessage from './shared/ErrorMessage';
import LoadingSpinner from './shared/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const PromptForm = ({ initialData = {}, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    collection_id: initialData.collectionId || '',
  });
  const [collections, setCollections] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const result = await apiService.getCollections();
        setCollections(result.collections);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };
    fetchCollections();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    console.log(`Updated ${name}: ${value}`); // Console log for input change
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.content) newErrors.content = 'Content is required';
    if (!formData.collection_id) newErrors.collection_id = 'Collection is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form'); // Log for starting submission
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('Validation errors:', validationErrors); // Log for validation errors
      return;
    }
    setLoading(true);
    setSubmitError(null);
    try {
      const payload = { ...formData, collection_id: formData.collection_id };
      console.log('Payload:', payload); // Log for payload before submission
      if (initialData.id) {
        await updatePrompt(initialData.id, payload);
      } else {
        await createPrompt(payload);
      }
      console.log('Prompt created successfully.'); // Log success message
      onSuccess();
      navigate('/');
    } catch (error) {
      console.error('Failed to save the prompt:', error); // Console log for errors
      setSubmitError('Failed to save the prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {initialData.id ? 'Edit Prompt' : 'New Prompt'}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input"
                aria-invalid={errors.title ? 'true' : 'false'}
                placeholder="Enter prompt title..."
              />
              {errors.title && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                className="input resize-none"
                aria-invalid={errors.content ? 'true' : 'false'}
                placeholder="Enter prompt content..."
              />
              {errors.content && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.content}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Collection</label>
              <select
                name="collection_id"
                value={formData.collection_id}
                onChange={handleInputChange}
                className="select"
                aria-invalid={errors.collection_id ? 'true' : 'false'}
              >
                <option value="">Select a collection</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
              {errors.collection_id && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.collection_id}</div>}
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
                label={loading ? 'Saving...' : (initialData.id ? 'Update Prompt' : 'Create Prompt')}
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

PromptForm.propTypes = {
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default PromptForm;
