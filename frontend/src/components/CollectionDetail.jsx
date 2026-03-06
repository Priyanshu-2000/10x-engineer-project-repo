import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/apiService';

const CollectionDetail = () => {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [prompts, setPrompts] = useState([]); // State for storing prompts
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const collectionData = await apiService.getData(`/collections/${id}`);
        setCollection(collectionData);

        // Fetch associated prompts using list_prompts API
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
    <div className="collection-detail">
      <h1>{collection.name}</h1>
      <p>{collection.description}</p>

      {/* Display associated prompts fetched using the list_prompts API */}
      {prompts.length > 0 ? (
        <div className="associated-prompts">
          <h2>Associated Prompts</h2>
          <ul>
            {prompts.map(prompt => (
              <li key={prompt.id} className="prompt-item">
                <h3>{prompt.title}</h3>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No associated prompts found.</p>
      )}
    </div>
  );
};

export default CollectionDetail;

