import React, { useState } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { motion } from 'framer-motion';

interface ContextCardProps {
  name: string;
  description: string;
  expertise: string[];
  isActive: boolean;
  onClick: () => void;
}

const ContextCard: React.FC<ContextCardProps> = ({ 
  name, 
  description, 
  expertise, 
  isActive, 
  onClick 
}) => {
  return (
    <motion.div 
      className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'border-butcher-600 bg-butcher-50 shadow-md' 
          : 'border-gray-300 bg-white hover:border-butcher-300 hover:bg-butcher-50/30'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isActive && (
        <motion.div 
          className="absolute -top-2 -right-2 bg-butcher-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
      <h3 className="font-semibold text-lg text-butcher-800">{name}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <div className="mt-3">
        <div className="text-xs text-gray-500 mb-1">Expertise:</div>
        <div className="flex flex-wrap gap-1">
          {expertise.map((skill, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ChefFreddieContextSelector: React.FC = () => {
  const { 
    getActiveGPTContext, 
    setActiveGPTContext, 
    getAllGPTContexts 
  } = useChefFreddie();
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedContext, setSelectedContext] = useState('');
  
  const activeContext = getActiveGPTContext();
  const allContexts = getAllGPTContexts();
  
  const handleConfirmSwitch = () => {
    setActiveGPTContext(selectedContext);
    setShowConfirmation(false);
  };
  
  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-butcher-800">Chef Freddie's Knowledge</h2>
        <p className="text-gray-600">
          Chef Freddie has comprehensive knowledge across all culinary areas. The active context below highlights his current focus, but he can answer questions about any cooking topic.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {allContexts.map((context) => (
          <ContextCard
            key={context.name}
            name={context.name}
            description={context.description}
            expertise={context.expertise || []}
            isActive={context.name === activeContext.name}
            onClick={() => {
              if (context.name === activeContext.name) return;
              setSelectedContext(context.name);
              setShowConfirmation(true);
            }}
          />
        ))}
      </div>
      
      {/* Active context details */}
      <div className="mt-6 p-4 bg-butcher-50 rounded-lg border border-butcher-200">
        <h3 className="font-semibold text-butcher-800">Currently Active: {activeContext.name}</h3>
        <p className="text-sm text-gray-700 mt-1">{activeContext.description}</p>
        <div className="mt-3">
          <div className="text-sm text-gray-700 mb-2">Example questions you can ask:</div>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {activeContext.sampleQuestions.slice(0, 3).map((question: string, index: number) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <h3 className="text-lg font-semibold text-butcher-800 mb-2">Change Chef Freddie's Expertise?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to switch Chef Freddie to {selectedContext} mode? 
              This will change the types of responses he provides.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-butcher-600 text-white rounded-md hover:bg-butcher-700"
                onClick={handleConfirmSwitch}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChefFreddieContextSelector;
