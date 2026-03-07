import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

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
        const collectionData = await apiService.getData(`/collections/${id}`);
        setCollection(collectionData);

        const promptData = await apiService.getData(`/prompts?collection_id=${id}`);
        setPrompts(promptData.prompts);
      } catch (err) {
        setError('Error loading collection details and associated prompts');
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!collection) {
    return <div>No details found for this collection.</div>;
  }

  return (
    <div className="collection-detail max-w-2xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="back-button text-blue-500 hover:text-blue-700 mb-4 flex items-center">
        &#x2190; Back {/* Arrow icon for better visual indication */}
      </button>
      <h2 className="text-3xl font-bold mb-4">{collection.name}</h2>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Description</h3>
        <p className="text-gray-600">{collection.description}</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Associated Prompts</h3>
        {prompts.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {prompts.map(prompt => (
              <li key={prompt.id} className="py-4">
                <h4 className="text-lg font-medium text-gray-900">{prompt.title}</h4>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No associated prompts found.</p>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
