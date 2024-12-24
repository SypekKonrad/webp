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
  total_kms: number;
  total_liters: number;
  seasonal_analysis: SeasonalAnalysis[];
  plot1_image: string;
  plot2_image: string;
  plot3_image: string;
  plot4_image: string;
  plot5_image: string;
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
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null); // Allow null initially
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysisData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.get('/analyze_car_data/');
      const analysis = response.data.analysis || {};
      const plot1Image = response.data.plot1_image || ''; // Handle plot_image
      const plot2Image = response.data.plot2_image || ''; // Handle plot_image
      const plot3Image = response.data.plot3_image || ''; // Handle plot_image
      const plot4Image = response.data.plot4_image || ''; // Handle plot_image
      const plot5Image = response.data.plot5_image || ''; // Handle plot_image

      setAnalysisData({
        total_expenditure: analysis.total_expenditure || 0,
        average_expenditure_per_refueling: analysis.average_expenditure_per_refueling || 0,
        average_price_per_km: analysis.average_price_per_km || 0,
        average_fuel_consumption: analysis.average_fuel_consumption || 0,
        total_kms: analysis.total_kms || 0,
        total_liters: analysis.total_liters || 0,
        seasonal_analysis: analysis.seasonal_analysis || [],
        plot1_image: plot1Image,
        plot2_image: plot2Image,
        plot3_image: plot3Image,
        plot4_image: plot4Image,
        plot5_image: plot5Image,
      });
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

