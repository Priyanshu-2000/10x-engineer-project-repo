import React, { useEffect, useState } from 'react';
import PromptCard from './PromptCard';
import { getPrompts } from '../api/prompts';
import SearchBar from './shared/SearchBar';
import { getCollections } from '../api/collections';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';
import Button from './shared/Button';
import { useNavigate } from 'react-router-dom';

const PromptList = () => {
  const [prompts, setPrompts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promptsResponse, collectionsResponse] = await Promise.all([
          getPrompts(),
          getCollections(),
        ]);
        setPrompts(promptsResponse.prompts || []);
        setCollections(collectionsResponse.collections || []);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPrompts = prompts.filter(prompt =>
    (selectedCollection ? prompt.collection_id === selectedCollection : true) &&
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePromptClick = (prompt) => {
    navigate(`/prompts/${prompt.id}`);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }} className="dark:bg-gray-900">
        <LoadingSpinner size="lg" text="Loading prompts..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }} className="dark:bg-gray-900">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div 
      style={{ 
        padding: '2rem', 
        backgroundColor: '#f9fafb', 
        minHeight: '100vh',
        color: '#111827'
      }} 
      className="dark:bg-gray-900 dark:text-white"
    >
      {/* Debug Info */}
      <div style={{ 
        backgroundColor: '#ef4444', 
        color: 'white', 
        padding: '1rem', 
        marginBottom: '1rem',
        borderRadius: '0.5rem'
      }}>
        DEBUG: PromptList - {prompts.length} prompts, {collections.length} collections, {filteredPrompts.length} filtered
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#111827',
          marginBottom: '0.5rem'
        }} className="dark:text-white">
          All Prompts
        </h1>
        <p style={{ 
          color: '#6b7280',
          marginBottom: '1.5rem'
        }} className="dark:text-gray-300">
          {filteredPrompts.length} of {prompts.length} prompts
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <Button
            label="Create New Prompt"
            onClick={() => navigate('/prompts/new')}
            variant="primary"
          />
        </div>

        {/* Filters */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <SearchBar 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prompts by title..."
            onClear={() => setSearchTerm('')}
          />

          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              color: '#111827'
            }}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Collections</option>
            {collections.map(collection => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        backgroundColor: '#22c55e', 
        color: 'white', 
        padding: '1rem', 
        marginBottom: '1rem',
        borderRadius: '0.5rem'
      }}>
        DEBUG: About to render {filteredPrompts.length} prompts
      </div>

      {filteredPrompts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }} className="dark:bg-gray-800 dark:border-gray-600">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '1rem'
          }} className="dark:text-white">
            No prompts available
          </h3>
          <p style={{ 
            color: '#6b7280',
            marginBottom: '1.5rem'
          }} className="dark:text-gray-300">
            Create your first prompt to get started with PromptLab.
          </p>
          <Button
            label="Create Your First Prompt"
            onClick={() => navigate('/prompts/new')}
            variant="primary"
          />
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem',
          backgroundColor: '#fbbf24',
          padding: '1rem',
          borderRadius: '0.5rem'
        }}>
          <div style={{ color: 'white', fontWeight: 'bold' }}>
            DEBUG: Rendering {filteredPrompts.length} prompt cards
          </div>
          {filteredPrompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onClick={() => handlePromptClick(prompt)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptList;