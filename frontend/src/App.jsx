import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import apiService from './services/apiService';
import PromptForm from './components/PromptForm';
import Sidebar from './components/Sidebar';
import CollectionForm from './components/CollectionForm';
import PromptDetail from './components/PromptDetail';
import CollectionDetail from './components/CollectionDetail';
import EditPromptForm from './components/EditPromptForm';
import Button from './components/shared/Button';
import LoadingSpinner from './components/shared/LoadingSpinner';
import ErrorMessage from './components/shared/ErrorMessage';

function App() {
  const [prompts, setPrompts] = useState([]);
  const [collections, setCollections] = useState([]);
  // Removed searchTerm state
  const [selectedCollection, setSelectedCollection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPrompts = await apiService.getPrompts();
        setPrompts(fetchedPrompts.prompts);
        const fetchedCollections = await apiService.getCollections();
        setCollections(fetchedCollections.collections);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Adjusted the filtering logic to exclude search terms
  const filteredPrompts = prompts.filter(prompt =>
    (selectedCollection ? prompt.collection_id === selectedCollection : true)
  );

  const isDetailView =
    /^\/prompts\/.+$/.test(location.pathname) ||
    /^\/collections\/.+$/.test(location.pathname);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
      <div className="App">
      {!isDetailView && <Sidebar />}
      <div className="content p-4">
        {!isDetailView && (
          <>
            <h1 className="text-2xl font-bold mb-6">PromptLab Dashboard</h1>
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Prompts</h2>
              <Button
                label="Create New Prompt"
                onClick={() => (window.location.href = '/prompts/new')}
                className="mb-4 bg-blue-600 hover:bg-blue-700 text-white"
              />

              {/* Removed search bar JSX */}
              <select
                value={selectedCollection}
                onChange={e => setSelectedCollection(e.target.value)}
                className="border rounded p-2 mb-4"
              >
                <option value="">All Collections</option>
                {collections.map(collection => (
                  <option key={collection.id} value={collection.id}>{collection.name}</option>
                ))}
              </select>

              <ul className="list-disc pl-5">
                {filteredPrompts.length ? (
                  filteredPrompts.map((prompt) => (
                    <li key={prompt.id}>
                      <Link to={`/prompts/${prompt.id}`}>{prompt.title}</Link>
                    </li>
                  ))
                ) : (
                  <li>No prompts available</li>
                )}
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">Collections</h2>
              <Button
                label="Create New Collection"
                onClick={() => (window.location.href = '/collections/new')}
                className="mb-4 bg-blue-600 hover:bg-blue-700 text-white"
              />
              <ul className="list-disc pl-5">
                {collections.length ? (
                  collections.map((collection) => (
                    <li key={collection.id}>
                      <Link to={`/collections/${collection.id}`}>{collection.name}</Link>
                    </li>
                  ))
                ) : (
                  <li>No collections available</li>
                )}
              </ul>
            </section>
          </>
        )}

        <Routes>
          <Route path="/prompts/new" element={<PromptForm onSuccess={() => {}} />} />
          <Route path="/collections/new" element={<CollectionForm onSuccess={() => {}} />} />
          <Route path="/prompts/:id" element={<PromptDetail />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/edit/:id" element={<EditPromptForm onSuccess={() => {}} />}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;

