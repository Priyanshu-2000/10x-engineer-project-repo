import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';

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

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await apiService.get('/collections');
        setCollections(response.data.collections);
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Collections</h2>
      <ul className="space-y-4">
        {collections.map(collection => (
          <li key={collection.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{collection.name}</h3>
            <p className="text-gray-700">{collection.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionList;
