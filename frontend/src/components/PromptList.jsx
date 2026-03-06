import React, { useEffect, useState } from 'react';
import PromptCard from './PromptCard';
import { getPrompts } from '../api/prompts';
import SearchBar from './shared/SearchBar';
import { getCollections } from '../api/collections';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import Modal from './shared/Modal'; // New import for Modal
import PromptDetail from './PromptDetail'; // New import for PromptDetail

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

  // State for toggling prompt visibility
  const [isPromptListVisible, setPromptListVisible] = useState(false);

  // State for selected prompt and modal visibility
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  const navigate = useNavigate();

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
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2" onClick={() => setPromptListVisible(!isPromptListVisible)}>
        Prompts
      </h2>
      {isPromptListVisible && (
        <>
          <Button
            label="Create Prompt"
            onClick={() => navigate('/prompts/new')}
            className="mb-4 bg-blue-600 hover:bg-blue-700 text-white"
          />

      <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

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

      {filteredPrompts.length === 0 ? (
        <div className="text-center text-gray-500">
          No prompts available. Please create one or adjust your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map(prompt => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    setDetailModalOpen(true);
                  }}
                />
          ))}
        </div>
      )}
        </>
      )}

      <Modal isOpen={isDetailModalOpen} onClose={() => setDetailModalOpen(false)}>
        {selectedPrompt && <PromptDetail prompt={selectedPrompt} />}
      </Modal>
    </div>
  );
};

export default PromptList;

