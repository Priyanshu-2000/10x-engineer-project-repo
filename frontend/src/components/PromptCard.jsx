import React, { useState } from 'react';
import Modal from './shared/Modal';
import PromptDetail from './PromptDetail';

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
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-white shadow-md rounded p-4 hover:shadow-lg transition-shadow duration-300">
      <h3 className="font-semibold text-lg mb-2 cursor-pointer" onClick={() => setModalOpen(true)}>{prompt.title}</h3>
      <p className="text-gray-700 mb-4">{prompt.content}</p>
      <a href="#" className="text-blue-500 hover:underline" onClick={() => setModalOpen(true)}>View Details</a>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <PromptDetail promptId={prompt.id} />
      </Modal>
    </div>
  );
};

export default PromptCard;
