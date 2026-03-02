import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createPrompt, updatePrompt } from '../api/prompts';
import Button from './shared/Button';
import ErrorMessage from './shared/ErrorMessage';
import LoadingSpinner from './shared/LoadingSpinner';

const PromptForm = ({ initialData = {}, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });  // Clear error when input changes
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.content) newErrors.content = 'Content is required';
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
      if (initialData.id) {
        await updatePrompt(initialData.id, formData);
      } else {
        await createPrompt(formData);
      }
      onSuccess();
    } catch (error) {
      setSubmitError('Failed to save the prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

PromptForm.propTypes = {
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default PromptForm;
