import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Use useNavigate instead
import { getPrompt, deletePrompt } from '../api/prompts';
import apiService from '../services/apiService';  // Importing apiService for collection fetching
import Modal from './shared/Modal';
import Button from './shared/Button';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';

// Assume canEditPrompt is defined somewhere in your utilities
const canEditPrompt = () => {
  // Logic to determine if the user can edit the prompt
  return true; // Replace with actual logic
};

const PromptDetail = () => {
  const { id } = useParams(); // Use id which matches URL router parameter
  const navigate = useNavigate(); // Initialize useNavigate
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [collections, setCollections] = useState([]); // State to store collections

  useEffect(() => {
    // Fetch prompt details
    const fetchPrompt = async () => {
      try {
        const data = await getPrompt(id); // Use 'id' matched from URL
        setPrompt(data);
      } catch (err) {
        setError('Failed to load prompt.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch collections for mapping collection_id to name
    const fetchCollections = async () => {
      try {
        const result = await apiService.getCollections();
        setCollections(result.collections);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    // Concurrent fetching
    fetchPrompt();
    fetchCollections();
  }, [id]);

  // Function to retrieve collection name by id
  const getCollectionName = (collectionId) => {
    const collection = collections.find(c => c.id === collectionId);
    return collection ? collection.name : 'Unknown Collection';
  };

  const handleDelete = async () => {
    try {
      await deletePrompt(id); // Use 'id' here as well
      navigate('/');  // Redirect to home/dashboard after deletion
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
      <h1 className="text-2xl font-bold mb-4">{prompt.title}</h1>
      <p className="text-gray-700 mb-4">{prompt.content}</p>
      {prompt.collection_id && (
        <p className="text-gray-700 mb-4">
          Collection: {getCollectionName(prompt.collection_id)} {/* Render section for collection */}
        </p>
      )}
      {canEditPrompt() && (
      <Button
        label="Edit Prompt"
        onClick={() => navigate(`/edit/${id}`)} // Use 'id' here for navigation
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
