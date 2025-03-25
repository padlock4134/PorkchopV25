// src/App.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SavedRecipesProvider } from './context/SavedRecipesContext';
import { ChefFreddieProvider } from './context/ChefFreddieContext';
import { ChallengeProvider } from './context/ChallengeContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CreateRecipe from './components/CreateRecipe';
import MyCookbook from './components/MyCookbook';
import ButcherShop from './components/ButcherShop';
import ProfilePage from './components/ProfilePage';
import Login from './components/LoginPage';
import Signup from './components/SignupPage';
import PrivateRoute from './components/PrivateRoute';
import GlobalChefFreddie from './components/GlobalChefFreddie';
import ChefsCorner from './components/ChefsCorner';
import AirtableConnectionStatus from './components/AirtableConnectionStatus';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && <Navigation />}
      <main className={!isAuthPage ? 'pt-16' : ''}>
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/create-recipe"
            element={
              <PrivateRoute>
                <CreateRecipe />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-cookbook"
            element={
              <PrivateRoute>
                <MyCookbook />
              </PrivateRoute>
            }
          />
          <Route
            path="/butcher-shop"
            element={
              <PrivateRoute>
                <ButcherShop />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/chefs-corner"
            element={
              <PrivateRoute>
                <ChefsCorner />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {!isAuthPage && <GlobalChefFreddie />}
      {process.env.NODE_ENV === 'development' && <AirtableConnectionStatus />}
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <SavedRecipesProvider>
      <ChefFreddieProvider>
        <ChallengeProvider>
          <AppContent />
        </ChallengeProvider>
      </ChefFreddieProvider>
    </SavedRecipesProvider>
  </AuthProvider>
);

export default App;