import React, { createContext, useContext } from 'react';

interface DatabaseService {
  query: (endpoint: string, data?: any) => Promise<any>;
}

const dbService: DatabaseService = {
  async query(endpoint: string, data?: any) {
    const response = await fetch(`/api/recipes?endpoint=${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
};

const DatabaseContext = createContext<DatabaseService>(dbService);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DatabaseContext.Provider value={dbService}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};