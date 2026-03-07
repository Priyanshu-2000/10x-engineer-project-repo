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
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!prompt) {
    return <div>No prompt found.</div>;
  }

  return (
    <div className="p-4">
      <button
        onClick={() => navigate('/')}
        className="text-blue-500 hover:text-blue-700 mb-4 flex items-center"
      >
        &#x2190; {/* Using HTML entity for left arrow */}
      </button>
      <h1 className="text-2xl font-bold mb-4">{prompt.title}</h1>
      <p className="text-gray-700 mb-4">{prompt.content}</p>
      {prompt.collection_id && (
        <p className="text-gray-700 mb-4">
          Collection: {getCollectionName(prompt.collection_id)}
        </p>
      )}
      {canEditPrompt() && (
      <Button
        label="Edit Prompt"
        onClick={() => navigate(`/edit/${id}`)}
        className="bg-yellow-500 hover:bg-yellow-600 mr-2"
      />
      )}
      <Button
        label="Delete Prompt"
        onClick={() => setModalOpen(true)}
        className="bg-red-600 hover:bg-red-700"
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <p>Are you sure you want to delete this prompt?</p>
        <Button
          label="Confirm Delete"
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700"
        />
      </Modal>
    </div>
  );
};

export default PromptDetail;

