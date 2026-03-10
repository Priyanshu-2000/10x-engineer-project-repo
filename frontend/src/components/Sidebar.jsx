import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import apiService from '../services/apiService';

/**
 * Enhanced sidebar component for navigating collections and quick actions.
 *
 * @component
 * @example
 * return (
 *   <Sidebar />
 * )
 */
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await apiService.getCollections();
        setCollections(response.collections || []);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
    },
    {
      name: 'All Prompts',
      href: '/prompts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      name: 'New Prompt',
      href: '/prompts/new',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    },
    {
      name: 'New Collection',
      href: '/collections/new',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'text-green-600 hover:text-green-700 hover:bg-green-50',
    },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className={`
      bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${isActive(item.href)
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <span className={`
                flex-shrink-0 transition-colors duration-200
                ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
              `}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="ml-3 truncate">{item.name}</span>
              )}
            </Link>
          ))}

          {/* Quick Actions */}
          {!isCollapsed && (
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Quick Actions
              </h3>
              <div className="mt-2 space-y-1">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${action.color}
                    `}
                  >
                    <span className="flex-shrink-0">
                      {action.icon}
                    </span>
                    <span className="ml-3 truncate">{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Collections */}
          {!isCollapsed && (
            <div className="pt-6">
              <div className="flex items-center justify-between px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Collections
                </h3>
                {collections.length > 0 && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {collections.length}
                  </span>
                )}
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
                ) : collections.length > 0 ? (
                  collections.map((collection) => (
                    <Link
                      key={collection.id}
                      to={`/collections/${collection.id}`}
                      className={`
                        group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200
                        ${isActive(`/collections/${collection.id}`)
                          ? 'bg-gray-50 text-gray-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <svg className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="ml-3 truncate">{collection.name}</span>
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No collections yet
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-3">
          {!isCollapsed && (
            <div className="text-xs text-gray-500 text-center">
              PromptLab v1.0
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

