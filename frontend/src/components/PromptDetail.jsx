import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPrompt, deletePrompt } from '../api/prompts';
import apiService from '../services/apiService';
import Modal from './shared/Modal';
import Button from './shared/Button';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';

const canEditPrompt = () => {
  return true;
};

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const data = await getPrompt(id);
        setPrompt(data);
      } catch (err) {
        setError('Failed to load prompt.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCollections = async () => {
      try {
        const result = await apiService.getCollections();
        setCollections(result.collections);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchPrompt();
    fetchCollections();
  }, [id]);

  const getCollectionName = (collectionId) => {
    const collection = collections.find(c => c.id === collectionId);
    return collection ? collection.name : 'Unknown Collection';
  };

  const handleDelete = async () => {
    try {
      const response = await deletePrompt(id);
      if (response.ok) { // Check if the request was successful
        navigate('/');   // Navigate back to the list of prompts
      } else {
        const errorData = await response.json(); // Try parsing any error message
        setError(errorData.message || 'Failed to delete prompt.');
      }
    } catch (err) {
      setError('Failed to delete prompt.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading prompt..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Prompt Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">No details found for this prompt.</p>
          <Button
            label="Go Back"
            onClick={() => navigate(-1)}
            variant="primary"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          label="Back"
          onClick={() => navigate(-1)}
          variant="secondary"
          size="sm"
          className="mb-6"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
        />

        {/* Prompt Content */}
        <div className="card p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{prompt.title}</h1>
              {prompt.collection_id && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Collection: {getCollectionName(prompt.collection_id)}</span>
                </div>
              )}
            </div>
            <div className="flex space-x-2 ml-4">
              {canEditPrompt() && (
                <Button
                  label="Edit"
                  onClick={() => navigate(`/edit/${id}`)}
                  variant="secondary"
                  size="sm"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  }
                />
              )}
              <Button
                label="Delete"
                onClick={() => setModalOpen(true)}
                variant="danger"
                size="sm"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                }
              />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Content</h3>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {prompt.content}
              </p>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setModalOpen(false)}
          title="Delete Prompt"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Are you sure?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  This action cannot be undone. This will permanently delete the prompt "{prompt.title}".
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                label="Cancel"
                onClick={() => setModalOpen(false)}
                variant="secondary"
              />
              <Button
                label="Delete Prompt"
                onClick={handleDelete}
                variant="danger"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PromptDetail;

