import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import Button from './shared/Button';
import LoadingSpinner from './shared/LoadingSpinner';

const CollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }} className="dark:bg-gray-900">
        <LoadingSpinner size="lg" text="Loading collections..." />
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
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#111827',
          marginBottom: '0.5rem'
        }} className="dark:text-white">
          Collections
        </h1>
        <p style={{ 
          color: '#6b7280',
          marginBottom: '1.5rem'
        }} className="dark:text-gray-300">
          {collections.length} collection{collections.length !== 1 ? 's' : ''}
        </p>

        <Button
          label="Create Collection"
          onClick={() => navigate('/collections/new')}
          variant="primary"
        />
      </div>

      {collections.length === 0 ? (
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
            No Collections Yet
          </h3>
          <p style={{ 
            color: '#6b7280',
            marginBottom: '1.5rem'
          }} className="dark:text-gray-300">
            Create your first collection to organize your prompts.
          </p>
          <Button
            label="Create Your First Collection"
            onClick={() => navigate('/collections/new')}
            variant="primary"
          />
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem'
        }}>
          {collections.map(collection => (
            <div
              key={collection.id}
              onClick={() => {
                console.log('Navigating to collection:', collection.id);
                navigate(`/collections/${collection.id}`);
              }}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              className="dark:bg-gray-800 dark:border-gray-600 hover:shadow-lg dark:hover:bg-gray-700"
            >
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '0.75rem'
              }} className="dark:text-white">
                {collection.name}
              </h3>
              <p style={{ 
                color: '#6b7280',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                lineHeight: '1.5'
              }} className="dark:text-gray-300">
                {collection.description || 'No description provided.'}
              </p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#9ca3af',
                fontSize: '0.875rem'
              }} className="dark:text-gray-400">
                <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>View details</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionList;