import React, { createContext, useContext, useState, useEffect } from 'react';
import { ImageAnalysis } from '../types';

interface AnalyzedImage {
  id: string;
  file: File;
  analysis: ImageAnalysis;
  timestamp: number;
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  analyzedImages: AnalyzedImage[];
  addAnalyzedImage: (file: File, analysis: ImageAnalysis) => void;
  clearHistory: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [analyzedImages, setAnalyzedImages] = useState<AnalyzedImage[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const addAnalyzedImage = (file: File, analysis: ImageAnalysis) => {
    const newImage: AnalyzedImage = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      analysis,
      timestamp: Date.now(),
    };
    setAnalyzedImages(prev => [newImage, ...prev].slice(0, 10)); // Keep last 10 images
  };

  const clearHistory = () => {
    setAnalyzedImages([]);
  };

  return (
    <AppContext.Provider value={{ 
      theme, 
      toggleTheme, 
      analyzedImages, 
      addAnalyzedImage,
      clearHistory 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}; 