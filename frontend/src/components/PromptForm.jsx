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
    <div className="new-prompt-form">
      <h2 className="text-2xl font-bold mb-4">New Prompt</h2>
    <form className="space-y-4 max-w-lg mx-auto" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          aria-invalid={errors.title ? 'true' : 'false'}
        />
        {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          aria-invalid={errors.content ? 'true' : 'false'}
        />
        {errors.content && <div className="text-red-600 text-sm">{errors.content}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Collection</label>
        <select
          name="collection_id"
          value={formData.collection_id}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          aria-invalid={errors.collection_id ? 'true' : 'false'}
        >
          <option value="">Select a collection</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
        {errors.collection_id && <div className="text-red-600 text-sm">{errors.collection_id}</div>}
      </div>
      {submitError && <ErrorMessage message={submitError} />}
      <div className="flex justify-end">
        <Button
          type="submit"
          label={initialData.id ? 'Update Prompt' : 'Create Prompt'}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        />
      </div>
      {loading && <LoadingSpinner />}
    </form>
    </div>
  );
};

PromptForm.propTypes = {
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default PromptForm;
