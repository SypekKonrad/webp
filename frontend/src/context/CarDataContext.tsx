import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import httpClient from '../api/httpClient';

interface CarData {
  Date: string;
  Price: string;
  'Kilometers_Traveled': string;
  Liters: string;
}

interface CarDataContextType {
  carData: CarData[];
  loading: boolean;
  error: string | null;
  fetchCarData: () => void;
}

const CarDataContext = createContext<CarDataContextType | undefined>(undefined);

export const useCarData = () => {
  const context = useContext(CarDataContext);
  if (!context) {
    throw new Error('useCarData must be used within a CarDataProvider');
  }
  return context;
};

export const CarDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [carData, setCarData] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 const fetchCarData = async () => {
    setLoading(true); // Set loading to true when starting the request
    setError(null); // Reset any previous errors
    try {
      const response = await httpClient.get('/get_car_data/');  // Using Axios
      console.log(response.data);  // Log response data if needed
      setCarData(response.data);  // Set the fetched data into state
    } catch (error: any) {
      console.error('Failed to fetch car data:', error);
      setError('Failed to fetch car data. Please try again later.');
    } finally {
      setLoading(false);  // Stop loading when request completes
    }
  };
// const fetchCarData = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//         // przekazac w react zeby requesty szly na backend
//         const response = await fetch('http://localhost:8000/api/get_car_data/');
//         console.log('Raw response:', response);
//         if (!response.ok) {
//             throw new Error('Failed to fetch car data');
//         }
//
//         const data = await response.json();
//         console.log('Raw response text:', data);
//
//         setCarData(data.data);
//     } catch (err) {
//         console.error('Error occurred:', err);
//         setError(err instanceof Error ? err.message : 'Unknown error');
//     } finally {
//         setLoading(false);
//     }
// }, []);

  useEffect(() => {
    fetchCarData();
  }, [fetchCarData]);

  return (
    <CarDataContext.Provider value={{ carData, loading, error, fetchCarData }}>
      {children}
    </CarDataContext.Provider>
  );
};