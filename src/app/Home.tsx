'use client'
import React, { useEffect } from 'react';
import { useState } from 'react';
import CentralisedSearch from './(statePages)/CentralisedSearch';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/**
 * HomePage is a React functional component that manages the display of different search pages 
 * such as 'COSTCO', 'AMAZON', and 'COSTCO_MANIFEST'. It includes a navigation bar that allows 
 * the user to switch between these pages. The selected page influences the appearance of the 
 * navigation buttons and controls which search component (CentralisedSearch) is rendered.
 * @component
 * @example
 * return <HomePage />
 */
const HomePage: React.FC = () => {
  const [page, setPage] = useState('COSTCO');
  const handlePageChange = (page: string) => {
    setPage(page);
  };

  const Nav: React.FC = () => {
    const tabStyle = (currentTab: string) => ({
      padding: '1rem', 
      borderBottom: page === currentTab ? '#f3f4f6' : 'none',
      marginBottom: page === currentTab ? '0px' : '0',
      background: page === currentTab ? '#f3f4f6' : 'lightgrey', 
      borderLeft: '0px solid lightgrey',
      borderRight: '0px solid lightgrey',
      borderTop: '0px solid lightgrey',
      opacity: page === currentTab ? 1 : 0.2,
    });

    return (
      <div className="flex justify-left border-b-0 border-gray-100 mt-4 z-0">
        <button className="rounded-lg mr-2" style={tabStyle('COSTCO')} onClick={() => handlePageChange('COSTCO')}>
          <small><b>COSTCO</b></small>
        </button>
        <button className="rounded-lg mr-2" style={tabStyle('AMAZON')} onClick={() => handlePageChange('AMAZON')}>
          <small><b>AMAZON</b></small>
        </button>
        <button className="rounded-lg mr-2" style={tabStyle('COSTCO_MANIFEST')} onClick={() => handlePageChange('COSTCO_MANIFEST')}>
          <small><b>MANIFEST</b></small>
        </button>
      </div>
    );
  };

  useEffect(() => {
    console.log(page);
  }, [page]);

  return (
    <div className="md:container md:mx-auto bg-zinc-900 ">
      <Nav />
      <div className="rounded-lg pt-4 mb-[-10px]" >
        {(page === 'COSTCO' || page === 'AMAZON' || page === 'COSTCO_MANIFEST') && <CentralisedSearch searchType={page} />}
      </div>
      
    </div>
  );
};

export default HomePage;
