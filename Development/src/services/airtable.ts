import Airtable from 'airtable';

// Type definitions
export interface User {
  id: string;
  Email: string;
  'First Name': string;
  'Last Name': string;
  'Subscription Tier': string;
  'Subscription Status': string;
  'Created At': string;
  'Last Updated': string;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: 'Rare' | 'El Dente';
  status: 'Active' | 'Inactive';
  startDate: string;
  endDate: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  createdAt: string;
  lastUpdated: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
  isPublic: boolean;
  imageUrl?: string; // Optional field for recipe images
}

// Initialize Airtable with explicit API key and base ID
// You should replace these with your actual Airtable credentials
const AIRTABLE_API_KEY = 'your_airtable_api_key'; // Replace with your API key
const AIRTABLE_BASE_ID = 'your_airtable_base_id'; // Replace with your base ID

// Create a base instance
let base: any;
try {
  base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
  console.log("Airtable base initialized");
} catch (error) {
  console.error("Failed to initialize Airtable base:", error);
  base = null;
}

// Create mock tables for fallback
const createMockTable = (name: string) => {
  const mockData: any[] = [];
  
  return {
    select: ({ filterByFormula, maxRecords }: any = {}) => {
      console.log(`MOCK ${name}: select called with filter:`, filterByFormula);
      return {
        firstPage: async () => {
          console.log(`MOCK ${name}: returning empty results`);
          return [];
        }
      };
    },
    create: async (fields: any) => {
      console.log(`MOCK ${name}: create called with:`, fields);
      const id = `${name.toLowerCase()}_${Date.now()}`;
      const record = { id, fields };
      mockData.push(record);
      return record;
    },
    update: async (id: string, fields: any) => {
      console.log(`MOCK ${name}: update called for ${id} with:`, fields);
      return { id, fields };
    },
    destroy: async (id: string) => {
      console.log(`MOCK ${name}: destroy called for ${id}`);
      return { id, deleted: true };
    }
  };
};

// Create a hybrid function to get a table (real or mock)
const getTable = (tableName: string) => {
  if (base) {
    try {
      return base(tableName);
    } catch (error) {
      console.error(`Error getting table ${tableName}:`, error);
      return createMockTable(tableName);
    }
  }
  return createMockTable(tableName);
};

// Table references - these will be either real Airtable tables or mock implementations
const usersTable = getTable('Users');
const subscriptionsTable = getTable('Subscriptions');
const recipesTable = getTable('Recipes');

// Test function to verify Airtable connection
export const testAirtableConnection = async (): Promise<boolean> => {
  if (!base) {
    console.error("Airtable base not initialized");
    return false;
  }
  
  try {
    // Try to fetch one record from the Users table
    const records = await usersTable.select({ maxRecords: 1 }).firstPage();
    console.log("Airtable connection successful:", records.length >= 0);
    return true;
  } catch (error) {
    console.error('Airtable connection error:', error);
    return false;
  }
};

// Export table references
export {
  usersTable,
  subscriptionsTable,
  recipesTable
};