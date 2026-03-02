import React, { useEffect, useState } from 'react';
import PromptCard from './PromptCard';
import { getPrompts } from '../api/prompts';
import SearchBar from './shared/SearchBar';
import { getCollections } from '../api/collections';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage'; // Assuming you have an ErrorMessage component

/**
 * Component for displaying a list of prompts in grid format.
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching both prompts and collections data concurrently using Promise.all
        const [promptsResponse, collectionsResponse] = await Promise.all([
          getPrompts(),
          getCollections(),
        ]);
        setPrompts(promptsResponse.prompts || []); // Default to empty array if no prompts
        setCollections(collectionsResponse.collections || []); // Default to empty array if no collections
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

  if (loading) {
    return <LoadingSpinner />; // Utilize a spinner for loading state
  }

  if (error) {
    return <ErrorMessage message={error} />; // Display error message using ErrorMessage component
  }

  return (
    <div className="p-4">
      {/* Search bar component to filter prompts */}
      <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      {/* Dropdown to select collections for filtering prompts */}
      <select
        value={selectedCollection}
        onChange={(e) => setSelectedCollection(e.target.value)}
        className="mb-4 border border-gray-300 rounded py-2 px-3"
        aria-label="Select Collection"
      >
        <option value="">All Collections</option>
        {collections.map(collection => (
          <option key={collection.id} value={collection.id}>{collection.name}</option>
        ))}
      </select>

      {/* Handle case where no prompts match the filters */}
      {filteredPrompts.length === 0 ? (
        <div className="text-center text-gray-500">
          No prompts available. Please create one or adjust your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptList;

