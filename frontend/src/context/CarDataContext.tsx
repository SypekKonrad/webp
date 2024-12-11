import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import httpClient from '../api/httpClient';

 // import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';


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

interface SeasonalAnalysis {
  Season: string;
  'Fuel consumption (L/100km)': number;
  'Fuel Efficiency (km/L)': number;
}

interface AnalysisData {
  total_expenditure: number;
  average_expenditure_per_refueling: number;
  average_price_per_km: number;
  average_fuel_consumption: number;
  seasonal_analysis: SeasonalAnalysis[];
}

interface AnalysisContextType {
  analysisData: AnalysisData | null;
  loading: boolean;
  error: string | null;
  fetchAnalysisData: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysisData = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysisData must be used within an AnalysisProvider');
  }
  return context;
};

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysisData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.get('/analyze_car_data/');
      setAnalysisData(response.data.analysis);
    } catch (error: any) {
      console.error('Failed to fetch analysis data:', error);
      setError('Failed to fetch analysis data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalysisData();
  }, [fetchAnalysisData]);

  return (
    <AnalysisContext.Provider value={{ analysisData, loading, error, fetchAnalysisData }}>
      {children}
    </AnalysisContext.Provider>
  );
};

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

const fetchCarData = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await httpClient.get('/get_car_data/');
    console.log('Axios response:', response);
    setCarData(response.data.data);
  } catch (error: any) {
    console.error('Failed to fetch car data:', error);
    setError('Failed to fetch car data. Please try again later.');
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchCarData();
  }, [fetchCarData]);

  return (
    <CarDataContext.Provider value={{ carData, loading, error, fetchCarData }}>
      {children}
    </CarDataContext.Provider>
  );
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