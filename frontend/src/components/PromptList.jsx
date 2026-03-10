import React, { useEffect, useState } from 'react';
import PromptCard from './PromptCard';
import { getPrompts } from '../api/prompts';
import SearchBar from './shared/SearchBar';
import { getCollections } from '../api/collections';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';
import Button from './shared/Button';
import { useNavigate } from 'react-router-dom';

/**
 * Enhanced component for displaying a list of prompts in a modern grid layout.
 *
 * @component
 * @example
 * return (
 *   <PromptList />
 * )
 */
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

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Re-fetch data
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
  };

  console.log('PromptList rendering - prompts:', prompts.length, 'collections:', collections.length, 'loading:', loading, 'error:', error);

  if (loading) {
    console.log('PromptList: Showing loading state');
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading prompts..." />
      </div>
    );
  }

  if (error) {
    console.log('PromptList: Showing error state');
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage 
          message={error}
          variant="error"
          dismissible
          onDismiss={() => setError(null)}
          action={
            <Button
              label="Try Again"
              onClick={handleRetry}
              variant="danger"
              size="sm"
            />
          }
        />
      </div>
    );
  }

  console.log('PromptList: Rendering main content');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Prompts</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredPrompts.length} of {prompts.length} prompts
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              label="Create New Prompt"
              onClick={() => navigate('/prompts/new')}
              variant="primary"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <SearchBar 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prompts by title..."
            onClear={() => setSearchTerm('')}
          />

          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="select"
            aria-label="Filter by Collection"
          >
            <option value="">All Collections</option>
            {collections.map(collection => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCollection) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {selectedCollection && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                Collection: {collections.find(c => c.id === selectedCollection)?.name}
                <button
                  onClick={() => setSelectedCollection('')}
                  className="ml-2 text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCollection('');
              }}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {filteredPrompts.length === 0 ? (
        <div className="text-center py-12">
          <div className="card max-w-md mx-auto p-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || selectedCollection ? 'No prompts match your filters' : 'No prompts available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || selectedCollection 
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'Create your first prompt to get started with PromptLab.'
              }
            </p>
            {searchTerm || selectedCollection ? (
              <Button
                label="Clear Filters"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCollection('');
                }}
                variant="secondary"
              />
            ) : (
              <Button
                label="Create Your First Prompt"
                onClick={() => navigate('/prompts/new')}
                variant="primary"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              />
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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