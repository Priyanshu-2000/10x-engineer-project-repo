import React from 'react';

/**
 * Individual prompt display card used in PromptList
 *
 * @component
 * @prop {Object} prompt - The prompt to display.
 * @example
 * const prompt = { title: 'Sample Prompt', content: 'This is the content.' }
 * return (
 *   <PromptCard prompt={prompt} />
 * )
 */
const PromptCard = ({ prompt }) => {
  return (
    <div className="bg-white shadow-md rounded p-4 hover:shadow-lg transition-shadow duration-300">
      <h3 className="font-semibold text-lg mb-2">{prompt.title}</h3>
      <p className="text-gray-700 mb-4">{prompt.content}</p>
      <a href="#" className="text-blue-500 hover:underline">View Details</a>
    </div>
  );
};

export default PromptCard;
