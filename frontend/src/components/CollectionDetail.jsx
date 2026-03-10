import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiService from '../services/apiService';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';
import Button from './shared/Button';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        console.log('Fetching collection with ID:', id);
        
        // Try to get specific collection first
        let collection;
        try {
          collection = await apiService.getData(`/collections/${id}`);
          console.log('Fetched specific collection:', collection);
        } catch (specificError) {
          console.log('Specific collection API failed, falling back to list method');
          // Fallback to getting all collections and filtering
          const collectionsResponse = await apiService.getCollections();
          collection = collectionsResponse.collections.find(c => c.id.toString() === id);
          console.log('Found collection from list:', collection);
        }
        
        if (!collection) {
          setError('Collection not found');
          setLoading(false);
          return;
        }
        
        setCollection(collection);

        // Get prompts for this collection
        let collectionPrompts = [];
        try {
          const promptData = await apiService.getData(`/prompts?collection_id=${id}`);
          collectionPrompts = promptData.prompts || [];
          console.log('Fetched collection prompts:', collectionPrompts);
        } catch (promptError) {
          console.log('Collection prompts API failed, falling back to list method');
          // Fallback to getting all prompts and filtering
          const promptsResponse = await apiService.getPrompts();
          collectionPrompts = promptsResponse.prompts.filter(p => p.collection_id.toString() === id);
          console.log('Filtered prompts from list:', collectionPrompts);
        }
        
        setPrompts(collectionPrompts);
      } catch (err) {
        console.error('Error fetching collection details:', err);
        setError('Error loading collection details and associated prompts');
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading collection details..." />
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

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Collection Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">No details found for this collection.</p>
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

        {/* Collection Header */}
        <div className="card p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{collection.name}</h1>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>{prompts.length} prompt{prompts.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                label="Edit Collection"
                onClick={() => navigate(`/collections/${id}/edit`)}
                variant="secondary"
                size="sm"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              />
              <Button
                label="Add Prompt"
                onClick={() => navigate(`/prompts/new?collection=${id}`)}
                variant="primary"
                size="sm"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {collection.description || 'No description provided for this collection.'}
            </p>
          </div>
        </div>

        {/* Associated Prompts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Associated Prompts</h2>
            {prompts.length > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full">
                {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {prompts.length > 0 ? (
            <div className="space-y-4">
              {prompts.map(prompt => (
                <Link
                  key={prompt.id}
                  to={`/prompts/${prompt.id}`}
                  className="block p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {prompt.title}
                      </h4>
                      {prompt.content && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {prompt.content.substring(0, 150)}...
                        </p>
                      )}
                      <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                        {prompt.created_at && (
                          <div className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
                          </div>
                        )}
                        {prompt.version && (
                          <div className="flex items-center ml-4">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span>v{prompt.version}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Prompts Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This collection doesn't have any prompts yet. Create your first prompt to get started.
              </p>
              <Button
                label="Create First Prompt"
                onClick={() => navigate(`/prompts/new?collection=${id}`)}
                variant="primary"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
