import React, { useState, useEffect } from 'react';
import { api_url } from "../config";
import styles from './Manifest.module.css';

/**
 * The Manifest component fetches and displays a list of items based on the given query and searchType.
 * It includes functionalities such as sorting the list by various fields (item number, description, price, and date).
 * This component handles loading states and errors, displaying appropriate messages during data fetching and when no results are found.
 *
 * @component
 * @example
 * return <Manifest query="12345" searchType="COSTCO_MANIFEST" />
 *
 * @param {Object} props - Component props
 * @param {string} props.query - The search query used to fetch data.
 * @param {string} props.searchType - The type of search, used to construct the API URL.
 */
const ManifestResults: React.FC <{query: string, searchType: string}> = ({ query, searchType}) => {
    const [data, setData] = useState<ItemData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: 'asc' });
    
    useEffect(() => {
        if (!query) return;
        setData([]);
        console.log(`Fetching ${searchType} results for:`, query);
        setLoading(true);

        fetch(`${api_url}${searchType.toLowerCase()}/search?query=${query}`)
          .then((res) => res.json())
          .then((data) => {
            const jsonData: ItemData[] = data;
            setData(jsonData);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setData([]);
            setLoading(false);
          });
        }, [query, searchType])
    
    

    const sortData = (column: keyof ItemData, type: 'string' | 'number' | 'date') => {
        setSortConfig(prevConfig => ({
            column,
            direction: prevConfig.direction === 'asc' && prevConfig.column === column ? 'desc' : 'asc'
        }));
        setData(currentData => {
            let sortedData = [...currentData];
            sortedData.sort((a, b) => {
                let aValue: string | number = a[column];
                let bValue: string | number = b[column];
                if (type === 'number') {
                    aValue = parseFloat(aValue);
                    bValue = parseFloat(bValue);
                } else if (type === 'date') {
                    aValue = new Date(aValue).getTime();
                    bValue = new Date(bValue).getTime();
                }
                const directionModifier = sortConfig.direction === 'asc' ? 1 : -1;
                return aValue > bValue ? directionModifier : -directionModifier;
            });
            return sortedData;
        });
    };

    if (loading) return <div>Loading...</div>
    if (data.length === 0) return <div>No results</div>
    return (
        <div>
            <table className={styles.styledTable}>
                <thead>
                    <tr>
                        <th onClick={() => sortData('part_number', 'string')}>Item Number</th>
                        <th onClick={() => sortData('description', 'string')}>Description</th>
                        <th onClick={() => sortData('price', 'number')}>RRP</th>
                        <th onClick={() => sortData('date', 'date')}>Last received</th>
                        <th>Misc</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.part_number}>
                            <td>{item.part_number}</td>
                            <td>{item.description}</td>
                            <td>${item.price}</td>
                            <td>{new Date(item.date).toLocaleDateString('en-AU')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

interface ItemData {
    part_number: string;
    description: string;
    price: string;
    date: string;
}
  
interface SortConfig {
    column: keyof ItemData | null;
    direction: 'asc' | 'desc';
}

export default ManifestResults;