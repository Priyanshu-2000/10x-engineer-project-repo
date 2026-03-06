// Import necessary components for interactivity
import { useNavigate } from 'react-router-dom';
// import Button from './shared/Button'; // Remove unused import if buttons are not needed here
/**
 * Sidebar component for navigating collections.
 *
 * @component
 * @example
 * return (
 *   <Sidebar />
 * )
 */
const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="bg-gray-800 text-white w-64 p-4">
      <nav>
        <ul className="space-y-2">
          {/* Your existing navigation items */}
        </ul>
      </nav>
      {/* Removed create buttons from here to avoid duplication */}
    </aside>
  );
};

export default Sidebar; // Ensure Sidebar is the default export

