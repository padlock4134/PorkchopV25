// This is a placeholder file to satisfy TypeScript imports
// It's not actually used in the Next.js application

import React from 'react';
// Mock for react-router-dom
const mockRouter = {
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Routes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Route: () => null
};

// Mock for ./App
const App = () => null;

// This file is not actually used in Next.js
console.log('This file (src/main.tsx) is not used in Next.js and exists only to satisfy TypeScript imports');
