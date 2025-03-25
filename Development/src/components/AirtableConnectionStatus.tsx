// src/components/AirtableConnectionStatus.tsx
import React, { useState, useEffect } from 'react';
import { testAirtableConnection } from '../services/airtable';

const AirtableConnectionStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error' | 'not-configured'>('loading');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if API key is configured
        const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
        const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
        
        if (!apiKey || apiKey === 'key_placeholder_for_development') {
          setStatus('not-configured');
          setErrorDetails('Airtable API key is not configured. Please check environment variables.');
          return;
        }
        
        if (!baseId || baseId === 'app_placeholder_for_development') {
          setStatus('not-configured');
          setErrorDetails('Airtable Base ID is not configured. Please check environment variables.');
          return;
        }
        
        const isConnected = await testAirtableConnection();
        
        if (isConnected) {
          setStatus('connected');
        } else {
          setStatus('error');
          setErrorDetails('Failed to connect to Airtable. Please check your API key and Base ID.');
        }
      } catch (error) {
        setStatus('error');
        setErrorDetails(`Error connecting to Airtable: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    checkConnection();
  }, []);

  const renderStatusIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="animate-spin h-5 w-5 border-2 border-porkchop-600 rounded-full border-t-transparent"></div>
        );
      case 'connected':
        return (
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'not-configured':
        return (
          <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Checking Airtable connection...';
      case 'connected':
        return 'Connected to Airtable';
      case 'error':
        return 'Failed to connect to Airtable';
      case 'not-configured':
        return 'Airtable not configured';
      default:
        return 'Unknown status';
    }
  };

  if (status === 'connected' && import.meta.env.MODE === 'production') {
    return null; // Don't show anything in production if connected
  }

  return (
    <div className={`fixed bottom-4 left-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
      status === 'connected' ? 'bg-green-50 border border-green-200' :
      status === 'error' ? 'bg-red-50 border border-red-200' :
      status === 'not-configured' ? 'bg-yellow-50 border border-yellow-200' :
      'bg-gray-50 border border-gray-200'
    }`}>
      {renderStatusIcon()}
      <div>
        <div className="font-medium">{getStatusText()}</div>
        
        {(status === 'error' || status === 'not-configured') && (
          <div>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-gray-600 underline hover:text-gray-800"
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
            
            {showDetails && errorDetails && (
              <div className="mt-2 text-sm text-gray-600 max-w-md">
                <p>{errorDetails}</p>
                
                <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                  <p className="font-medium">Quick Fix:</p>
                  <ol className="list-decimal list-inside text-xs mt-1 space-y-1">
                    <li>Create a <code>.env</code> file in your project root</li>
                    <li>Add the following lines:</li>
                    <pre className="bg-gray-100 p-1 mt-1 overflow-x-auto">
                      <code>
                        VITE_AIRTABLE_API_KEY=your_api_key_here<br/>
                        VITE_AIRTABLE_BASE_ID=your_base_id_here
                      </code>
                    </pre>
                    <li>Restart your development server</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AirtableConnectionStatus;