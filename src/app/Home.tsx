'use client'
import React, { useEffect } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CostcoSearch from './(statePages)/CostcoSearch';


// make sure to uninstall local-cors-proxy
// npm uninstall -g local-cors-proxy
// and replace localhost:8010/proxy with masman.photos/ or maybe none?
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
          <div className="flex flex-col justify-center items-center">
          {/* <Image src="/costco-logo.png" alt="Costco" width={50} height={50} /> */}
          <small>COSTCO</small>
          </div>
        </button>
        <button className="rounded-lg mr-2" style={tabStyle('AMAZON')} onClick={() => handlePageChange('AMAZON')}>
          AMAZON
        </button>
        <button className="rounded-lg mr-2" style={tabStyle('COSTCO_IMAGES')} onClick={() => handlePageChange('COSTCO_IMAGES')}>
          COSTCO IMAGE FINDER
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
      {page === 'COSTCO' && <CostcoSearch />}
      </div>
      
    </div>
  );
};

export default HomePage;
