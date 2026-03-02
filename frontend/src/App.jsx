import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'; // Retain reactLogo for potential future use
import viteLogo from '/vite.svg'; // Retain viteLogo as well
import './App.css';
import apiService from './services/apiService'; // Import the API service

function App() {
  const [prompts, setPrompts] = useState([]);
  const [collections, setCollections] = useState([]);
  // Fetch prompts and collections using API service
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPrompts = await apiService.getPrompts();
        console.log('Fetched Prompts:', fetchedPrompts); // This line was added in the suggested changes to log fetched prompts
        setPrompts(fetchedPrompts.prompts);
      } catch (error) {
        console.error('Failed to fetch prompts:', error);
      }

      try {
        const fetchedCollections = await apiService.getCollections();
        console.log('Fetched Collections:', fetchedCollections); // This line was added in the suggested changes to log fetched collections
        setCollections(fetchedCollections.collections);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    };

    fetchData();
  }, []);

  return (
    // Simplified component structure to focus on what is shown on the Dashboard
      <div className="App">
      <h1>PromptLab Dashboard</h1>

        <section>
          <h2>Prompts</h2>
          <ul>
          {prompts.length ? (
            prompts.map((prompt) => (
              <li key={prompt.id}>{prompt.title}</li>
            ))
          ) : (
            <li>No prompts available</li> // Fallback message
          )}
        </ul>
      </section>

        <section>
          <h2>Collections</h2>
          <ul>
          {collections.length ? (
            collections.map((collection) => (
              <li key={collection.id}>{collection.name}</li>
            ))
          ) : (
            <li>No collections available</li> // Fallback message
          )}
        </ul>
      </section>
    </div>
  );
}

export default App;

