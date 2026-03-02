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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
