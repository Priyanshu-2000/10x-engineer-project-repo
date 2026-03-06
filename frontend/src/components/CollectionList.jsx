import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import Button from './shared/Button'; // Importing Button for creating new collection
import Modal from './shared/Modal'; // Importing Modal for displaying collection details
import CollectionDetail from './CollectionDetail'; // Importing CollectionDetail component

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
  const [isCollectionListVisible, setCollectionListVisible] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null); // State for selected collection
  const [isDetailModalOpen, setDetailModalOpen] = useState(false); // State for modal visibility

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
      <h2
        className="text-xl font-semibold mb-2"
        onClick={() => setCollectionListVisible(!isCollectionListVisible)}
      >
        Collections
      </h2>
      {isCollectionListVisible && (
        <>
          <Button
            label="Create Collection"
            onClick={() => console.log('Navigate to Create Collection Form')} // Implement navigation logic
            className="mb-4 bg-blue-600 hover:bg-blue-700 text-white"
          />
      <ul className="space-y-4">
        {collections.map(collection => (
              <li
                key={collection.id}
                className="p-4 bg-white rounded shadow"
                onClick={() => { setSelectedCollection(collection); setDetailModalOpen(true); }}
              >
                <h3 className="font-semibold">{collection.name}</h3>
                <p className="text-gray-700">{collection.description}</p>
              </li>
        ))}
      </ul>
        </>
      )}

      <Modal isOpen={isDetailModalOpen} onClose={() => setDetailModalOpen(false)}>
        {selectedCollection && <CollectionDetail collection={selectedCollection} />}
      </Modal>
    </div>
  );
};

export default CollectionList;

