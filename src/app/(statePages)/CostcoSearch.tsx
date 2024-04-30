import { useState, useEffect } from "react";
import Slider from "react-slick";
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CopyToClipboard from "../(assetHelpers)/ClipboardCopy";
import { NextArrow, PrevArrow } from "../(assetHelpers)/SliderArrows";


const CostcoSearch: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [submitSearch, setSubmitSearch] = useState("");
      const image_settings = {
          dots: true,
          infinite: false,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          adaptiveHeight: false,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />
      };
  
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
  
            {searchQuery.trim() && <FetchCostcoResults query={submitSearch} />}
          </>
      )
  }

const FetchCostcoResults: React.FC<{ query: string }> = ({ query }) => {
    const [results, setResults] = useState<{ [id: string]: { description: string; images: string[] } }>({});
    const [isLoading, setLoading] = useState(false);
    
    useEffect(() => {
      if (!query) return;
      console.log('Fetching Costco results for:', query);
      setLoading(true);
      let grouped: { [id: string]: 
        {
          description: string;
          images: string[];
        }} = {};
    
      fetch(`http://localhost:8010/proxy/costco/search?query=${query}`)
        .then((res) => res.json())
        .then((data) => {
          data.forEach((item: { part_number: string; description: string; image: string; }) => {
            if (grouped[item.part_number] == null) {
              grouped[item.part_number] = {
                  description: item.description,
                  images: []
              };
            }
            grouped[item.part_number].images.push(item.image);
        });
          setResults(grouped)
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
      }, [query])
   
    if (isLoading) return <p>Loading...</p>
    if (!results) return <p>No results</p>
    const image_settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: false,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />
    };
  
    return (
      <div className="costco-search-results grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 bg-zinc-900">  
        {Object.entries(results).map(([part_number, item], i) => (
        <div key={`test=${i}`} className="item-card border-2 border-gray-200 rounded-xl bg-white drop-shadow-md divide-y divide-dashed shadow-white hover:scale-105 hover:transition hover:duration-100">
          <div className="image-card px-12 py-12 relative">
              <Slider {...image_settings}>
              {item.images.map((image: string, i: number) => (
                  <div key={`${part_number}=${i}`} className="relative min-h-52">
                      <Image 
                          src={`http://localhost:8010/proxy/image/${image}`}
                          alt="placeholder"
                          fill
                          
                          style={{
                            objectFit: 'contain'
                          }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={true} 
                      />
                    </div>
                ))}
                </Slider>
            </div>
  
            <div className="item-part-number-copy border-0 border-gray-200 border-dashed rounded-lg bg-white">
              <div className="text-center m-2">
                <CopyToClipboard textToCopy={`${part_number}`} />
              </div>
            </div>
            
            <div className="item-description border-0 rounded-lg bg-white">
                <div className="text-center p-4 my-2">
                    <p>{item.description}</p>
                </div>
            </div>
          </div>  
        ))}
      </div>
    )
  }

export default CostcoSearch;