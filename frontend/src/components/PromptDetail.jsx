import { useParams, useHistory } from 'react-router-dom';
import { getPrompt, deletePrompt } from '../api/prompts';
import Modal from './shared/Modal';
import Button from './shared/Button';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';

const PromptDetail = () => {
  const { promptId } = useParams();
  const history = useHistory();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const data = await getPrompt(promptId);
        setPrompt(data);
      } catch (err) {
        setError('Failed to load prompt.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrompt();
  }, [promptId]);

  const handleDelete = async () => {
    try {
      await deletePrompt(promptId);
      history.push('/');  // Redirect to home/dashboard after deletion
    } catch (err) {
      setError('Failed to delete prompt.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!prompt) {
    return <div>No prompt found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{prompt.title}</h1>
      <p className="text-gray-700 mb-4">{prompt.content}</p>
      <Button
        label="Edit Prompt"
        onClick={() => history.push(`/edit/${promptId}`)}
        className="bg-yellow-500 hover:bg-yellow-600 mr-2"
      />
      <Button
        label="Delete Prompt"
        onClick={() => setModalOpen(true)}
        className="bg-red-600 hover:bg-red-700"
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <p>Are you sure you want to delete this prompt?</p>
        <Button
          label="Confirm Delete"
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700"
        />
      </Modal>
    </div>
  );
};

export default PromptDetail;
