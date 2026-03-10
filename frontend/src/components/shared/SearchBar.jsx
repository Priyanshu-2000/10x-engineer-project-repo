import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Enhanced SearchBar component with modern design and features.
 *
 * @component
 * @param {Object} props - Properties passed to component
 * @param {string} props.value - Search input value.
 * @param {function} props.onChange - Handler for input value change.
 * @param {string} [props.placeholder='Search...'] - Placeholder text for the input.
 * @param {boolean} [props.loading=false] - Whether to show loading state.
 * @param {function} [props.onClear] - Handler for clearing the search.
 * @param {string} [props.size='md'] - Size of the search bar (sm, md, lg).
 * @param {boolean} [props.autoFocus=false] - Whether to auto-focus the input.
 * @example
 * return (
 *   <SearchBar 
 *     value={searchTerm} 
 *     onChange={(e) => setSearchTerm(e.target.value)}
 *     placeholder="Search prompts..."
 *     onClear={() => setSearchTerm('')}
 *   />
 * )
 */
const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  loading = false,
  onClear,
  size = 'md',
  autoFocus = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange({ target: { value: '' } });
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="relative">
      <div className={`
        relative flex items-center
        ${isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        transition-all duration-200
      `}>
        {/* Search Icon */}
        <div className="absolute left-3 flex items-center pointer-events-none">
          {loading ? (
            <svg className={`${iconSizes[size]} text-gray-400 dark:text-gray-500 animate-spin`} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className={`${iconSizes[size]} text-gray-400 dark:text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
            transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            ${sizeClasses[size]}
            ${isFocused ? 'shadow-md' : 'shadow-sm'}
          `}
          placeholder={placeholder}
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            type="button"
            aria-label="Clear search"
          >
            <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Suggestions or Results Count */}
      {value && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-500 dark:text-gray-400 px-1">
          {loading ? 'Searching...' : `Press Escape to clear`}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  loading: PropTypes.bool,
  onClear: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  autoFocus: PropTypes.bool,
};

export default SearchBar;
