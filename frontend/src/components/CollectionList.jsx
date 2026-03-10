import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import Button from './shared/Button';
import Modal from './shared/Modal';
import LoadingSpinner from './shared/LoadingSpinner';
import CollectionDetail from './CollectionDetail';

/**
 * Component for displaying a list of collections.
 *
 * @component
 * @example
 * return (
 *   <CollectionList />
 * )
 */
const CollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await apiService.getCollections();
        setCollections(response.collections || []);
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading collections..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Collections</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {collections.length} collection{collections.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              label="Create Collection"
              onClick={() => console.log('Navigate to Create Collection Form')}
              variant="primary"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            />
          </div>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-12">
            <div className="card max-w-md mx-auto p-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Collections Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first collection to organize your prompts.
              </p>
              <Button
                label="Create Your First Collection"
                onClick={() => console.log('Navigate to Create Collection Form')}
                variant="primary"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map(collection => (
              <div
                key={collection.id}
                className="card card-hover cursor-pointer group"
                onClick={() => { setSelectedCollection(collection); setDetailModalOpen(true); }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                      {collection.name}
                    </h3>
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                    {collection.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>View details</span>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-600 rounded-xl transition-colors duration-200 pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={isDetailModalOpen} onClose={() => setDetailModalOpen(false)} size="2xl">
          {selectedCollection && <CollectionDetail collection={selectedCollection} />}
        </Modal>
      </div>
    </div>
  );
};

export default CollectionList;

