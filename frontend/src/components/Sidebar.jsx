import React from 'react';

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
  return (
    <aside className="bg-gray-800 text-white w-64 p-4">
      <nav>
        <ul className="space-y-2">
          <li><a href="#" className="block py-2 px-3 hover:bg-gray-700 rounded">Collections</a></li>
          <li><a href="#" className="block py-2 px-3 hover:bg-gray-700 rounded">List 1</a></li>
          <li><a href="#" className="block py-2 px-3 hover:bg-gray-700 rounded">List 2</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
