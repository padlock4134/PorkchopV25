import React from 'react';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { useRouter } from 'next/router';
import { 
  findCommunityFeature,
  chefCornerChallenges,
  communityFeatures
} from '../utils/chefKnowledge';
import ChefFreddieLogo from './ChefFreddieLogo';
import type { Recipe } from '../utils/recipeData';
import { analyzeTopic } from '../utils/topicDetection';

// Define message types
type MessageType = 'greeting' | 'help' | 'recipe' | 'general' | 'technique' | 'problem' | 'substitution' | 'timing' | 'pairing' | 'method';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'chef';
  timestamp: string;
  recipeRecommendation?: Recipe;
  suggestedQuestions?: string[];
}

interface ChefResponse {
  text: string;
  type: MessageType;
  suggestedQuestions?: string[];
  additionalInfo?: {
    tips?: string[];
    solutions?: string[];
    techniques?: string[];
    examples?: string[];
    temperature?: string;
    equipment?: string[];
    pairings?: string[];
    avoidList?: string[];
    seasonalSuggestions?: string[];
  };
}

interface QueryAnalysis {
  type: MessageType;
  keywords: string[];
  intent: string;
}

interface RouteFeature {
  name: string;
  suggestedQuestions: string[];
}

interface RouteContextBase {
  features: RouteFeature[];
}

const GlobalChefFreddie: React.FC = () => {
  const router = useRouter();
  
  // Hide on home page
  if (router.pathname === '/') {
    return null;
  }
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasSuggestion, setHasSuggestion] = useState(true); // Show suggestion dot by default
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    isVisible, 
    showChefFreddie, 
    hideChefFreddie: hideChefFreddieProp,
    currentRecipe,
    recommendedRecipe,
    currentRoute,
    getActiveGPTContext,
    getGPTContextResponse,
    getSimilarRecipeRecommendations,
    getRandomRecipeRecommendations,
    setRecommendedRecipe,
    setCurrentRoute,
    setCurrentRecipe,
    getContextualHelp,
    getRouteSuggestedQuestions,
    getRouteTitle
  } = useChefFreddie();
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Create the user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: userInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Add the user message to the chat
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');

    // Process the message and get response
    processMessageAndGetResponse(userMessage.text);
  };

  // Process message and get response
  const processMessageAndGetResponse = async (messageText: string) => {
    // First, analyze if the topic is cooking-related
    const topicAnalysis = analyzeTopic(messageText);

    // If off-topic, gently redirect while maintaining Chef Freddie's personality
    if (!topicAnalysis.isOnTopic) {
      const chefResponse: Message = {
        id: `chef-${Date.now()}`,
        text: topicAnalysis.suggestedRedirect || "That's interesting! Let me share a helpful cooking tip with you...",
        sender: 'chef',
        timestamp: new Date().toISOString(),
        suggestedQuestions: [
          "Tell me more about cooking techniques",
          "What recipes do you recommend?",
          "Got any kitchen tips?"
        ]
      };
      setMessages(prev => [...prev, chefResponse]);
      return;
    }

    // Continue with normal message processing for on-topic messages
    const detectQueryContext = (query: string): string => {
      // All queries use the same context now
      return 'General Cooking Expert';
    };

    // Get response based on message content
    let responseText = '';
    let recipeRecommendation: Recipe | null = null;
    let suggestedQuestions: string[] = [];
    let messageType: MessageType = 'general';

    // Check if user is asking for recipe suggestions
    if (messageText.toLowerCase().includes('suggest') && messageText.toLowerCase().includes('recipe')) {
      messageType = 'recipe';
      
      // Get recipe recommendations
      let recommendedRecipes: Recipe[] = [];
      
      // If user is viewing a recipe, suggest similar recipes
      if (currentRecipe) {
        recommendedRecipes = getSimilarRecipeRecommendations(currentRecipe);
      } else {
        // Otherwise, suggest random recipes
        recommendedRecipes = getRandomRecipeRecommendations(3);
      }
      
      if (recommendedRecipes.length > 0) {
        recipeRecommendation = recommendedRecipes[0];
        responseText = `Here's a recipe suggestion for you: ${recipeRecommendation.title}. It's a ${recipeRecommendation.difficulty} ${recipeRecommendation.cuisine} dish that takes about ${recipeRecommendation.cookingTime} minutes to make.`;
        
        // Add suggested questions
        suggestedQuestions = [
          `How do I make ${recipeRecommendation.title}?`,
          `What ingredients do I need for ${recipeRecommendation.title}?`,
          `Suggest a different recipe`
        ];
      } else {
        responseText = "I don't have any recipe recommendations at the moment. Please try again later.";
      }
    } else {
      // For other types of queries, use the GPT context response
      const queryContext = detectQueryContext(messageText);
      
      // Simulate typing delay
      setIsTyping(true);
      
      // Get response from the appropriate context
      responseText = await getGPTContextResponse(messageText);
      
      // Determine message type based on query content
      if (messageText.toLowerCase().includes('knife') || 
          messageText.toLowerCase().includes('technique') || 
          messageText.toLowerCase().includes('method')) {
        messageType = 'technique';
      } else if (messageText.toLowerCase().includes('substitute') || 
                messageText.toLowerCase().includes('replacement')) {
        messageType = 'substitution';
      } else if (messageText.toLowerCase().includes('problem') || 
                messageText.toLowerCase().includes('help') || 
                messageText.toLowerCase().includes('fix')) {
        messageType = 'problem';
      } else if (messageText.toLowerCase().includes('time') || 
                messageText.toLowerCase().includes('how long')) {
        messageType = 'timing';
      } else if (messageText.toLowerCase().includes('pair') || 
                messageText.toLowerCase().includes('serve with')) {
        messageType = 'pairing';
      } else {
        messageType = 'general';
      }
      
      // Get suggested follow-up questions based on the active context
      const activeContext = getActiveGPTContext();
      suggestedQuestions = activeContext.suggestedQuestions.slice(0, 3);
    }
    
    // Create the chef's response message
    const chefResponse: Message = {
      id: `chef-${Date.now()}`,
      text: responseText,
      sender: 'chef',
      timestamp: new Date().toISOString(),
      recipeRecommendation: recipeRecommendation || undefined,
      suggestedQuestions: suggestedQuestions
    };
    
    // Add a slight delay to simulate typing
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, chefResponse]);
    }, 1000);
  };

  // Handle clicking a suggested question
  const handleSuggestedQuestionClick = (question: string) => {
    // Create the user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: question,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Add the user message to the chat
    setMessages(prev => [...prev, userMessage]);
    
    // Process the response directly without updating the input field
    processMessageAndGetResponse(question);
  };

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Show welcome message when chat is opened
  useEffect(() => {
    if (isVisible && messages.length === 0) {
      // Get contextual help based on current route or recipe
      const welcomeMessage = getContextualHelp();
      
      // Add welcome message
      const chefGreeting: Message = {
        id: `chef-${Date.now()}`,
        text: welcomeMessage,
        sender: 'chef',
        timestamp: new Date().toISOString(),
        suggestedQuestions: getActiveGPTContext().suggestedQuestions.slice(0, 3)
      };
      
      setMessages([chefGreeting]);
    }
  }, [isVisible]);

  // Update route when router changes but NEVER auto-show Chef Freddie
  useEffect(() => {
    if (router.pathname) {
      setCurrentRoute(router.pathname);
      // Don't force hide here - it breaks click functionality
    }
  }, [router.pathname, setCurrentRoute]);

  // Handle keyboard events in the input field
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  // Local function to hide Chef Freddie and clear messages
  const hideChefFreddie = () => {
    console.log('Hiding Chef Freddie and clearing messages');
    // Clear messages
    setMessages([]);
    // Reset input
    setUserInput('');
    // Hide Chef Freddie
    hideChefFreddieProp();
  };

  // Toggle minimized state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get the suggested questions for the current page
  const getPageGPTContexts = () => {
    // Return empty array - we're no longer showing expertise blocks
    return [];
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          onClick={() => {
            console.log("Opening Chef Freddie");
            showChefFreddie();
          }}
          className="bg-butcher-600 text-white p-3 rounded-full shadow-lg hover:bg-butcher-700 focus:outline-none focus:ring-2 focus:ring-butcher-500 flex items-center justify-center"
        >
          <ChefFreddieLogo size="small" showNotification={hasSuggestion} />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chef Freddie Chat Window */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-80 sm:w-96 overflow-hidden flex flex-col"
            style={{ height: '500px', maxHeight: '70vh' }}
          >
            {/* Chat Header */}
            <div className="bg-butcher-700 text-white p-3 flex justify-between items-center">
              <div className="flex items-center">
                <ChefFreddieLogo size="small" showNotification={false} />
                <span className="text-white font-medium ml-2">Chef Freddie</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    // Clear history when minimizing
                    setMessages([]);
                    setUserInput('');
                    setIsMinimized(true);
                  }}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-4"
              style={{ backgroundColor: '#f8f9fa' }}
            >
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-4">
                    <h2 className="text-xl font-bold text-butcher-800 mb-3">{getRouteTitle()}</h2>
                    <p className="text-gray-600 mb-4">Ask me any cooking questions or for recipe suggestions!</p>
                    <div className="space-y-2">
                      {getRouteSuggestedQuestions().map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestionClick(question)}
                          className="block w-full text-left text-sm bg-butcher-50 hover:bg-butcher-100 rounded p-2 transition-colors border border-butcher-200 shadow-sm"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-butcher-600 text-white' 
                        : 'bg-white shadow-sm border border-gray-200'
                    }`}
                  >
                    {/* Message text with markdown-like formatting */}
                    <div className="whitespace-pre-wrap">
                      {message.text.split('\n').map((line, i) => {
                        // Bold text (between ** **)
                        const boldRegex = /\*\*(.*?)\*\*/g;
                        const formattedLine = line.replace(boldRegex, '<strong>$1</strong>');
                        
                        return (
                          <div 
                            key={i} 
                            className={`${i > 0 ? 'mt-2' : ''}`}
                            dangerouslySetInnerHTML={{ __html: formattedLine }}
                          />
                        );
                      })}
                    </div>
                    
                    {/* Recipe recommendation */}
                    {message.recipeRecommendation && (
                      <div className="mt-2 p-2 bg-butcher-50 rounded border border-butcher-100">
                        <div className="font-medium text-butcher-800">{message.recipeRecommendation.title}</div>
                        <div className="text-xs text-gray-600 mt-1 flex items-center">
                          <span className="mr-2">{message.recipeRecommendation.difficulty}</span>
                          <span className="mx-2">•</span>
                          <span>{message.recipeRecommendation.cookingTime} min</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Suggested questions */}
                    {message.sender === 'chef' && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.suggestedQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestedQuestionClick(question)}
                            className="block w-full text-left text-sm bg-butcher-50 hover:bg-butcher-100 rounded p-2 transition-colors border border-butcher-200 shadow-sm"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs mt-1 text-right text-gray-500">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200">
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Chef Freddie..."
                  className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-butcher-500"
                />
                <button
                  type="submit"
                  className="bg-butcher-600 text-white p-2 rounded-r-lg hover:bg-butcher-700 focus:outline-none focus:ring-2 focus:ring-butcher-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Minimized Chat Bubble */}
      {isMinimized && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-butcher-600 text-white p-3 rounded-full shadow-lg fixed bottom-4 right-4 cursor-pointer flex items-center justify-center"
          onClick={toggleMinimize}
        >
          <ChefFreddieLogo size="small" />
        </motion.div>
      )}
    </div>
  );
};

export default GlobalChefFreddie;