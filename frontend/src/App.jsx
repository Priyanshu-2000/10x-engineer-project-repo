import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import apiService from './services/apiService';
import PromptForm from './components/PromptForm';
import PromptList from './components/PromptList';
import CollectionList from './components/CollectionList';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
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
  const [selectedCollection, setSelectedCollection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Apply dark mode classes to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  const filteredPrompts = prompts.filter(prompt =>
    (selectedCollection ? prompt.collection_id === selectedCollection : true)
  );

  const isDetailView =
    /^\/prompts\/\d+$/.test(location.pathname) ||
    /^\/collections\/\d+$/.test(location.pathname) ||
    /^\/edit\/\d+$/.test(location.pathname);

  const isDashboard = location.pathname === '/';

  // Debug logging
  console.log('Current pathname:', location.pathname);
  console.log('isDetailView:', isDetailView);
  console.log('isDashboard:', isDashboard);

  if (loading) {
    return <LoadingSpinner overlay text="Loading PromptLab..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <Header />
      
      <div className="flex">
        {!isDetailView && <Sidebar />}
        
        <main className={`flex-1 ${!isDetailView ? 'ml-0' : ''} bg-gray-50 dark:bg-gray-900 min-h-screen`}>
          {isDashboard && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Dashboard Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to PromptLab
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Manage and organize your AI prompts efficiently
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Prompts</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{prompts.length}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Collections</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{collections.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Content Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Prompts Section */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Prompts</h2>
                    <Button
                      label="View All"
                      onClick={() => navigate('/prompts')}
                      variant="secondary"
                      size="sm"
                    />
                  </div>

                  <div className="mb-4">
                    <Button
                      label="Create New Prompt"
                      onClick={() => navigate('/prompts/new')}
                      variant="primary"
                      className="w-full"
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <select
                      value={selectedCollection}
                      onChange={e => setSelectedCollection(e.target.value)}
                      className="select w-full"
                    >
                      <option value="">All Collections</option>
                      {collections.map(collection => (
                        <option key={collection.id} value={collection.id}>{collection.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredPrompts.length ? (
                      filteredPrompts.slice(0, 5).map((prompt) => (
                        <Link
                          key={prompt.id}
                          to={`/prompts/${prompt.id}`}
                          className="block p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                        >
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">{prompt.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                            {prompt.content?.substring(0, 100)}...
                          </p>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No prompts available</p>
                        <p className="text-sm">Create your first prompt to get started</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Collections Section */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Collections</h2>
                    <Button
                      label="View All"
                      onClick={() => navigate('/collections')}
                      variant="secondary"
                      size="sm"
                    />
                  </div>

                  <div className="mb-4">
                    <Button
                      label="Create New Collection"
                      onClick={() => navigate('/collections/new')}
                      variant="success"
                      className="w-full"
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      }
                    />
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {collections.length ? (
                      collections.slice(0, 5).map((collection) => (
                        <Link
                          key={collection.id}
                          to={`/collections/${collection.id}`}
                          className="block p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                        >
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">{collection.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {collection.description?.substring(0, 60)}...
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p>No collections available</p>
                        <p className="text-sm">Create your first collection to organize prompts</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Routes>
            <Route path="/prompts" element={<PromptList />} />
            <Route path="/collections" element={<CollectionList />} />
            <Route path="/prompts/new" element={<PromptForm onSuccess={() => {}} />} />
            <Route path="/collections/new" element={<CollectionForm onSuccess={() => {}} />} />
            <Route path="/prompts/:id" element={<PromptDetail />} />
            <Route path="/collections/:id" element={<CollectionDetail />} />
            <Route path="/edit/:id" element={<EditPromptForm onSuccess={() => {}} />}/>
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppWithTheme() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWithTheme;

