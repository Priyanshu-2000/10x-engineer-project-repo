import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Removed BrowserRouter import
import './App.css';
import apiService from './services/apiService'; // Import the API service
import PromptForm from './components/PromptForm'; // Import the PromptForm component
import Sidebar from './components/Sidebar'; // Import the Sidebar component
import CollectionForm from './components/CollectionForm'; // Import the CollectionForm component
import PromptDetail from './components/PromptDetail'; // Import the PromptDetail component
import CollectionDetail from './components/CollectionDetail'; // Import the CollectionDetail component
import EditPromptForm from './components/EditPromptForm'; // Import the EditPromptForm component
import Button from './components/shared/Button'; // Correct import path for Button component

function App() {
  const [prompts, setPrompts] = useState([]);
  const [collections, setCollections] = useState([]);
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPrompts = await apiService.getPrompts();
      console.log('Fetched Prompts:', fetchedPrompts);
        setPrompts(fetchedPrompts.prompts);
      } catch (error) {
        console.error('Failed to fetch prompts:', error);
      }
      try {
        const fetchedCollections = await apiService.getCollections();
        console.log('Fetched Collections:', fetchedCollections);
        setCollections(fetchedCollections.collections);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    };
    fetchData();
  }, []);

  return (
      <div className="App">
        <Sidebar /> {/* Include Sidebar for navigation */}
        <div className="content p-4"> {/* Add padding for better UI spacing */}
          <h1 className="text-2xl font-bold mb-6">PromptLab Dashboard</h1> {/* Update class names for styling */}

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-2">Prompts</h2>
                  <Button
                    label="Create New Prompt"
              onClick={() => (window.location.href = '/prompts/new')} // Replace navigate with direct window location change
                    className="mb-4 bg-blue-600 hover:bg-blue-700 text-white"
                  />
                  <ul className="list-disc pl-5">
                    {prompts.length ? (
                      prompts.map((prompt) => (
                        <li key={prompt.id}>
                  <Link to={`/prompts/${prompt.id}`}>{prompt.title}</Link>
                        </li>
                      ))
                    ) : (
                <li>No prompts available</li> // Fallback message
                    )}
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">Collections</h2>
                  <Button
                    label="Create New Collection"
              onClick={() => (window.location.href = '/collections/new')} // Replace navigate with direct window location change
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
                <li>No collections available</li> // Fallback message
                    )}
                  </ul>
                </section>
        {/* Define routes inside main content */}
        <Routes>
          <Route path="/prompts/new" element={<PromptForm onSuccess={() => {}} />} />
          <Route path="/collections/new" element={<CollectionForm onSuccess={() => {}} />} />
          <Route path="/prompts/:id" element={<PromptDetail />} /> {/* Define route for individual prompt detail */}
          <Route path="/collections/:id" element={<CollectionDetail />} /> {/* Define route for individual collection detail */}
          <Route path="/edit/:id" element={<EditPromptForm onSuccess={() => {}} />} /> {/* Ensure EditPromptForm is routed correctly */}
        </Routes>
      </div>
    </div>
  );
}

export default App;

