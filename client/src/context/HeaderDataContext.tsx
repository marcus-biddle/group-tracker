import React, { createContext, useContext, useState } from 'react';

interface DateProps {
    month: number,
    year: number,
    day: number
}
// Define the shape of your context
interface HeaderData {
  date: DateProps | null; // The selected date, initially null
}

interface HeaderDataContextType {
  headerData: HeaderData;
  setHeaderData: React.Dispatch<React.SetStateAction<HeaderData>>;
}

// Create the context with a default value
const HeaderDataContext = createContext<HeaderDataContextType | undefined>(undefined);

// Provider component
export const HeaderDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [headerData, setHeaderData] = useState<HeaderData>({
    date: {
        day: -1,
        month: new Date().getMonth()+1, //Add +1 to get current month number
        year: new Date().getFullYear()
      }, 
  });

  return (
    <HeaderDataContext.Provider value={{ headerData, setHeaderData }}>
      {children}
    </HeaderDataContext.Provider>
  );
};

// Hook to use the context
export const useHeaderData = (): HeaderDataContextType => {
  const context = useContext(HeaderDataContext);
  if (!context) {
    throw new Error('useHeaderData must be used within a HeaderDataProvider');
  }
  return context;
};
