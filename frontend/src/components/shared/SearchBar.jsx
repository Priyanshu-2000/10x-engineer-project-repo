import React from 'react';
import PropTypes from 'prop-types';

/**
 * SearchBar component for inputting search queries.
 *
 * @component
 * @param {Object} props - Properties passed to component
 * @param {string} props.value - Search input value.
 * @param {function} props.onChange - Handler for input value change.
 * @example
 * return (
 *   <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 * )
 */
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Search..."
      />
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchBar;
