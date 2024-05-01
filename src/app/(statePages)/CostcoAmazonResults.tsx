import { useState, useEffect } from "react";``
import { NextArrow, PrevArrow } from "../(assetHelpers)/SliderArrows";
import { api_url } from "../config";
import Slider from "react-slick";
import Image from 'next/image';
import CopyToClipboard from "../(assetHelpers)/ClipboardCopy";

/**
 * CostcoAmazonResults fetches and displays search results based on the provided `query` and `searchType`.
 * It manages loading state and error handling, and dynamically groups and displays results with image sliders
 * for each part. Uses a responsive grid layout to present the items.
 *
 * @component
 * @example
 * return <FetchCentralisedSearch query="12345" searchType="COSTCO_PRODUCT" />
 *
 * @param {Object} props - Props object for FetchCentralisedSearch component.
 * @param {string} props.query - The search query string used to fetch results.
 * @param {string} props.searchType - Identifies the type of search, used to construct the fetch URL.
 */
const CostcoAmazonResults: React.FC<{ query: string, searchType: string }> = ({ query, searchType }) => {
    const [results, setResults] = useState<{ [id: string]: { description: string; images: string[] } }>({});
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
      if (!query) return;
      console.log(`Fetching ${searchType} results for:`, query);
      setLoading(true);
      let grouped: { [id: string]: 
        {
          description: string;
          images: string[];
        }} = {};
    
      fetch(`${api_url}${searchType.toLowerCase()}/search?query=${query}`)
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
      }, [query, searchType])
   
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
      <div className={`${searchType}-search-results grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 bg-zinc-900}`}>  
        {Object.entries(results).map(([part_number, item], i) => (
        <div key={`test=${i}`} className="item-card border-2 border-gray-200 rounded-xl bg-white drop-shadow-md divide-y divide-dashed shadow-white hover:scale-105 hover:transition hover:duration-100">
          <div className="image-card px-12 py-12 relative">
              <Slider {...image_settings}>
              {item.images.map((image: string, i: number) => (
                  <div key={`${part_number}=${i}`} className="relative min-h-52">
                      <Image 
                          src={`${api_url}/image/${image}`}
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

export default CostcoAmazonResults;