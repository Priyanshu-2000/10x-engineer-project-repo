import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * Main application layout component that includes a header and sidebar.
 *
 * @component
 * @example
 * return (
 *   <Layout>
 *     // child components here
 *   </Layout>
 * )
 */
const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
