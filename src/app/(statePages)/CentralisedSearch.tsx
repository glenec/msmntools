import { useState, useEffect } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ManifestResults from "./ManifestResults";
import CostcoAmazonResults from "./CostcoAmazonResults";

/**
 * CentralisedSearch is a component that provides a search input form and renders different child components
 * based on the `searchType` prop and the search query provided. It conditionally renders the Manifest component
 * for Costco manifest searches or FetchCentralisedSearch for other types.
 *
 * @component
 * @example
 * return <CentralisedSearch searchType="COSTCO_MANIFEST" />
 *
 * @param {Object} props - Props object for CentralisedSearch component.
 * @param {string} props.searchType - Type of search, determines which results component to render.
 */
const CentralisedSearch: React.FC<{ searchType: string }> = ({ searchType }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [submitSearch, setSubmitSearch] = useState("");
  
      function handleSearch(e: React.FormEvent<HTMLFormElement>) {
          e.preventDefault();
          if (!searchQuery.trim()) {
            console.log('Empty search query. Please enter a valid search term.');
            return;
          }
          setSubmitSearch(searchQuery);
          console.log('Search query:', searchQuery);
      }
  
      function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchQuery(e.target.value)
      }
  
      return (
        <>
            <form className="flex border-0 border-gray-200 rounded-lg overflow-hidden z-50 mt-0" onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="px-4 py-2 w-full focus:outline-none rounded-l-lg" 
                  onChange={handleSearchInputChange}
                />
                <button className="flex items-center justify-center px-4 bg-white text-black rounded-r-lg" type="submit" >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
  
                </button>
            </form>
            {searchQuery.trim() && searchType === 'COSTCO_MANIFEST' && <ManifestResults query={submitSearch} searchType={searchType} />}
            {searchQuery.trim() && searchType !== 'COSTCO_MANIFEST' && <CostcoAmazonResults query={submitSearch} searchType={searchType} />}
            
          </>
      )
  }


export default CentralisedSearch;