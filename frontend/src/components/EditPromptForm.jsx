import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { getPrompt, updatePrompt } from '../api/prompts';
import Button from './shared/Button';
import ErrorMessage from './shared/ErrorMessage';
import LoadingSpinner from './shared/LoadingSpinner';

const EditPromptForm = ({ onSuccess }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '', collectionId: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchPromptDetails = async () => {
      try {
        const prompt = await getPrompt(id);
        setFormData(prompt);
      } catch (error) {
        console.error('Error fetching prompt details:', error);
        setSubmitError('Failed to load prompt details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromptDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
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
      await updatePrompt(id, formData);
      onSuccess();
      navigate('/');
    } catch (error) {
      setSubmitError('Failed to update the prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <form className="space-y-4 max-w-lg mx-auto" onSubmit={handleSubmit}>
      {submitError && <ErrorMessage message={submitError} />}
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
      <div className="flex justify-end">
        <Button
          type="submit"
          label="Save Changes"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        />
      </div>
    </form>
  );
};

EditPromptForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default EditPromptForm;
