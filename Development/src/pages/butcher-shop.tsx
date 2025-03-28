import React from 'react';
import type { NextPage } from 'next';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { useEffect } from 'react';
import Link from 'next/link';

interface LocalProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'meat' | 'produce' | 'dairy' | 'bakery' | 'specialty';
  subcategory?: string;
  producer: string;
  origin: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
  weight?: string;
  unit?: string;
  tags: string[];
}

interface LocalProducer {
  id: string;
  name: string;
  type: 'butcher' | 'farmer' | 'baker' | 'cheesemaker' | 'specialty';
  location: string;
  specialty: string;
  description: string;
  image: string;
  rating: number;
  distance: string;
}

const TheGrange: NextPage = () => {
  const { showChefFreddie, setCurrentRoute } = useChefFreddie();
  const [activeCategory, setActiveCategory] = React.useState<'all' | LocalProduct['category']>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Show Chef Freddie when page loads
  React.useEffect(() => {
    showChefFreddie();
    setCurrentRoute('/the-grange');
  }, [showChefFreddie, setCurrentRoute]);

  // Mock data for local products
  const localProducts: LocalProduct[] = [
    {
      id: 'p1',
      name: 'Prime Ribeye Steak',
      description: 'Beautifully marbled prime ribeye with exceptional tenderness and flavor. Dry-aged for 21 days.',
      price: '$28.99/lb',
      category: 'meat',
      subcategory: 'beef',
      producer: 'Heritage Meats',
      origin: 'Black Angus, Nebraska',
      image: 'ribeye',
      inStock: true,
      featured: true,
      weight: '16-20 oz per steak',
      unit: 'lb',
      tags: ['Prime', 'Dry-Aged', 'Grass-Fed']
    },
    {
      id: 'p2',
      name: 'Heritage Pork Chops',
      description: 'Thick-cut bone-in pork chops from heritage breed pigs raised on pasture without antibiotics.',
      price: '$14.99/lb',
      category: 'meat',
      subcategory: 'pork',
      producer: 'Heritage Meats',
      origin: 'Berkshire, Iowa',
      image: 'pork-chop',
      inStock: true,
      weight: '10-12 oz per chop',
      unit: 'lb',
      tags: ['Heritage', 'Pasture-Raised', 'Bone-In']
    },
    {
      id: 'p3',
      name: 'Free-Range Whole Chicken',
      description: 'Pasture-raised chicken with rich flavor. Perfect for roasting whole or breaking down.',
      price: '$4.99/lb',
      category: 'meat',
      subcategory: 'poultry',
      producer: 'Green Acres Farm',
      origin: 'Amish Country, Pennsylvania',
      image: 'chicken',
      inStock: true,
      weight: '3.5-4.5 lbs',
      unit: 'lb',
      tags: ['Free-Range', 'Air-Chilled', 'Antibiotic-Free']
    },
    {
      id: 'p4',
      name: 'Grass-Fed Ground Beef',
      description: '85% lean ground beef from grass-fed cattle. Perfect for premium burgers and meatballs.',
      price: '$8.99/lb',
      category: 'meat',
      subcategory: 'beef',
      producer: 'Heritage Meats',
      origin: 'Montana',
      image: 'ground-beef',
      inStock: true,
      weight: '1 lb package',
      unit: 'lb',
      tags: ['Grass-Fed', 'Sustainable', '85% Lean']
    },
    {
      id: 'p5',
      name: 'Lamb Rack',
      description: 'Premium French-trimmed rack of lamb. Tender, flavorful, and perfect for special occasions.',
      price: '$24.99/lb',
      category: 'meat',
      subcategory: 'lamb',
      producer: 'Heritage Meats',
      origin: 'New Zealand',
      image: 'lamb-rack',
      inStock: false,
      weight: '1.5-2 lbs per rack',
      unit: 'lb',
      tags: ['Grass-Fed', 'French-Trimmed', 'Premium']
    },
    {
      id: 'p6',
      name: 'Smoked Bacon',
      description: 'Thick-cut, applewood smoked bacon from heritage breed pigs. Cured with brown sugar and spices.',
      price: '$12.99/lb',
      category: 'meat',
      subcategory: 'pork',
      producer: 'Heritage Meats',
      origin: 'Vermont',
      image: 'bacon',
      inStock: true,
      featured: true,
      weight: '12 oz package',
      unit: 'lb',
      tags: ['Smoked', 'Thick-Cut', 'Heritage']
    },
    {
      id: 'p7',
      name: 'Duck Breast',
      description: 'Plump, tender duck breast with rich flavor. Perfect for pan-searing with a crispy skin.',
      price: '$18.99/lb',
      category: 'meat',
      subcategory: 'poultry',
      producer: 'Green Acres Farm',
      origin: 'Hudson Valley, New York',
      image: 'duck',
      inStock: true,
      weight: '8-10 oz per breast',
      unit: 'lb',
      tags: ['Free-Range', 'Air-Chilled', 'Specialty']
    },
    {
      id: 'p8',
      name: 'Beef Brisket',
      description: 'Whole packer brisket, perfect for smoking. Well-marbled with a generous fat cap.',
      price: '$10.99/lb',
      category: 'meat',
      subcategory: 'beef',
      producer: 'Heritage Meats',
      origin: 'Texas',
      image: 'brisket',
      inStock: true,
      weight: '10-14 lbs',
      unit: 'lb',
      tags: ['Smoking', 'BBQ', 'Prime']
    },
    {
      id: 'p9',
      name: 'Venison Tenderloin',
      description: 'Wild-harvested venison tenderloin with a clean, rich flavor. Exceptionally lean and tender.',
      price: '$32.99/lb',
      category: 'meat',
      subcategory: 'specialty',
      producer: 'Wild Harvest',
      origin: 'Michigan',
      image: 'venison',
      inStock: false,
      weight: '1-1.5 lbs',
      unit: 'lb',
      tags: ['Wild', 'Lean', 'Seasonal']
    },
    {
      id: 'p10',
      name: 'Heirloom Tomatoes',
      description: 'Fresh, vine-ripened heirloom tomatoes with rich, complex flavors.',
      price: '$4.99/lb',
      category: 'produce',
      subcategory: 'tomatoes',
      producer: 'Green Acres Farm',
      origin: 'Amish Country, Pennsylvania',
      image: 'heirloom-tomatoes',
      inStock: true,
      weight: '1 lb',
      unit: 'lb',
      tags: ['Heirloom', 'Vine-Ripened', 'Fresh']
    },
    {
      id: 'p11',
      name: 'Artisanal Cheddar Cheese',
      description: 'Rich, creamy artisanal cheddar cheese with a smooth, velvety texture.',
      price: '$12.99/lb',
      category: 'dairy',
      subcategory: 'cheese',
      producer: 'The Cheese Maker',
      origin: 'Wisconsin',
      image: 'cheddar-cheese',
      inStock: true,
      weight: '1 lb block',
      unit: 'lb',
      tags: ['Artisanal', 'Cheddar', 'Creamy']
    },
    {
      id: 'p12',
      name: 'Fresh Baguette',
      description: 'Freshly baked baguette with a crispy crust and soft interior.',
      price: '$2.99/loaf',
      category: 'bakery',
      subcategory: 'bread',
      producer: 'The Bakery',
      origin: 'Local',
      image: 'baguette',
      inStock: true,
      weight: '1 loaf',
      unit: 'loaf',
      tags: ['Fresh', 'Crispy', 'Soft']
    }
  ];

  // Mock data for local producers
  const localProducers: LocalProducer[] = [
    {
      id: 'b1',
      name: 'Heritage Meats',
      type: 'butcher',
      location: 'Downtown',
      specialty: 'Dry-aged beef',
      description: 'Family-owned butcher shop specializing in dry-aged beef and heritage breed pork. All meats are sourced from farms within 100 miles.',
      image: 'heritage',
      rating: 4.8,
      distance: '1.2 miles'
    },
    {
      id: 'b2',
      name: 'Green Acres Farm',
      type: 'farmer',
      location: 'Westside',
      specialty: 'Grass-fed & finished',
      description: 'Focusing exclusively on grass-fed and finished meats with regenerative farming practices. Known for exceptional lamb and beef.',
      image: 'green-acres',
      rating: 4.6,
      distance: '3.5 miles'
    },
    {
      id: 'b3',
      name: 'The Cheese Maker',
      type: 'cheesemaker',
      location: 'Northside',
      specialty: 'Artisanal cheese',
      description: 'Artisanal cheesemaker with a focus on traditional techniques and high-quality milk sources.',
      image: 'cheese-maker',
      rating: 4.9,
      distance: '2.8 miles'
    },
    {
      id: 'b4',
      name: 'The Bakery',
      type: 'baker',
      location: 'Downtown',
      specialty: 'Fresh bread',
      description: 'Family-owned bakery specializing in freshly baked bread, pastries, and desserts.',
      image: 'bakery',
      rating: 4.7,
      distance: '1.5 miles'
    }
  ];

  // Filter products based on category and search
  const filteredProducts = localProducts.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Generate a placeholder image for local products
  const getProductImage = (product: LocalProduct) => {
    const getCategoryColor = (category: LocalProduct['category']): string => {
      switch(category) {
        case 'meat': return 'bg-gradient-to-br from-red-700 to-red-900';
        case 'produce': return 'bg-gradient-to-br from-green-600 to-green-800';
        case 'dairy': return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
        case 'bakery': return 'bg-gradient-to-br from-orange-400 to-orange-600';
        case 'specialty': return 'bg-gradient-to-br from-purple-600 to-purple-800';
        default: return 'bg-gradient-to-br from-butcher-600 to-butcher-800';
      }
    };

    const getCategoryIcon = (category: LocalProduct['category']): string => {
      switch(category) {
        case 'meat': return '🥩';
        case 'produce': return '🥗';
        case 'dairy': return '🧀';
        case 'bakery': return '🍞';
        case 'specialty': return '🦌';
        default: return '🥓';
      }
    };

    return (
      <div className={`${getCategoryColor(product.category)} w-full h-full flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute opacity-20 text-white text-9xl font-bold">
          {product.name.substring(0, 1)}
        </div>
        <div className="text-5xl z-10">
          {getCategoryIcon(product.category)}
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)' 
          }}></div>
        </div>
        {product.featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold z-20">
            Featured
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-butcher-900 mb-4 font-serif">The Grange</h1>
        <p className="text-xl text-butcher-600">Premium local products from farmers, butchers, and specialty producers</p>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-butcher-800 to-butcher-900 rounded-xl p-8 mb-12 text-white shadow-vintage">
        <div className="md:flex items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-3xl font-semibold mb-4 font-serif">Quality Products, Delivered Fresh</h2>
            <p className="text-butcher-100 mb-6">
              The Grange connects you with local farmers, butchers, and specialty producers who are passionate about their craft. 
              Browse premium products, learn about sourcing, and find the perfect items for your recipes.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-satriales-500 hover:bg-satriales-600 transition-colors px-6 py-3 rounded-lg font-medium">
                Browse Selection
              </button>
              <button className="bg-transparent border border-white hover:bg-white hover:text-butcher-900 transition-colors px-6 py-3 rounded-lg font-medium">
                Find Local Producers
              </button>
            </div>
          </div>
          <div className="md:w-1/3 h-64 bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-butcher-50 to-butcher-100 flex items-center justify-center">
              <span className="text-8xl">🥩</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-butcher-900 font-serif">Featured Products</h2>
          <Link href="#all-products" className="text-satriales-600 hover:text-satriales-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {localProducts.filter(p => p.featured).map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-vintage overflow-hidden border border-butcher-100 hover:shadow-lg transition-shadow">
              <div className="h-48">
                {getProductImage(product)}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-butcher-900">{product.name}</h3>
                  <span className="text-satriales-600 font-bold">{product.price}</span>
                </div>
                <p className="text-butcher-600 text-sm mb-4">{product.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-vintage-100 text-butcher-700 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-sm text-butcher-500 mb-4">
                  <span className="flex items-center mr-4">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {product.origin}
                  </span>
                  <span>{product.weight} {product.unit}</span>
                </div>
                <button 
                  className={`w-full px-4 py-2 rounded-lg font-medium ${
                    product.inStock 
                      ? 'bg-satriales-500 text-white hover:bg-satriales-600' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Products */}
      <div id="all-products" className="mb-16">
        <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-butcher-900 font-serif">Browse Our Selection</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, types, tags..."
                  className="w-full md:w-64 px-4 py-2 border border-butcher-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-satriales-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="w-5 h-5 absolute right-3 top-2.5 text-butcher-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <select
                className="px-4 py-2 border border-butcher-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-satriales-500"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as any)}
              >
                <option value="all">All Categories</option>
                <option value="meat">Meat</option>
                <option value="produce">Produce</option>
                <option value="dairy">Dairy</option>
                <option value="bakery">Bakery</option>
                <option value="specialty">Specialty</option>
              </select>
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-vintage-50 rounded-lg">
              <span className="text-4xl mb-4 block">🔍</span>
              <h3 className="text-lg font-medium text-butcher-800 mb-2">No products found</h3>
              <p className="text-butcher-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-vintage-100 overflow-hidden">
                  <div className="h-40">
                    {getProductImage(product)}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-butcher-800">{product.name}</h3>
                      <span className="text-satriales-600 font-bold">{product.price}</span>
                    </div>
                    <p className="text-sm text-butcher-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-vintage-100 text-butcher-700 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-xs text-butcher-500 mb-3">
                      <span className="flex items-center mr-3">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {product.origin}
                      </span>
                      <span>{product.weight} {product.unit}</span>
                    </div>
                    
                    <button 
                      className={`w-full px-3 py-1.5 rounded-lg text-sm font-medium ${
                        product.inStock 
                          ? 'bg-satriales-500 text-white hover:bg-satriales-600' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      } transition-colors`}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Local Producers */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-butcher-900 mb-8 font-serif">Local Producer Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {localProducers.map(producer => (
            <div key={producer.id} className="bg-white rounded-lg shadow-vintage p-6 border border-butcher-200">
              <div className="w-16 h-16 bg-butcher-100 rounded-full mb-4 flex items-center justify-center">
                <span className="text-2xl">🔪</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-butcher-900">{producer.name}</h3>
                <div className="flex items-center text-amber-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-butcher-800 font-medium">{producer.rating}</span>
                </div>
              </div>
              <div className="flex items-center text-sm text-butcher-500 mb-3">
                <span className="flex items-center mr-4">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {producer.location} ({producer.distance})
                </span>
              </div>
              <p className="text-butcher-600 mb-4">
                <span className="font-medium text-butcher-800">Specialty:</span> {producer.specialty}
              </p>
              <p className="text-butcher-600 mb-4">
                {producer.description}
              </p>
              <button className="w-full px-4 py-2 bg-butcher-800 text-white rounded-lg hover:bg-butcher-900 transition-colors">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Education Section */}
      <div className="mb-16 bg-white p-8 rounded-lg shadow-vintage relative">
        <h2 className="text-2xl font-semibold text-butcher-900 mb-6 font-serif">The Producer's Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-butcher-800 mb-4">Understanding Local Products</h3>
            <p className="text-butcher-600 mb-4">
              Knowing your local products is essential for selecting the right items for your recipes. Our guide helps you understand 
              the differences between various products, their best uses, and flavor profiles.
            </p>
            <button className="px-4 py-2 bg-satriales-500 text-white rounded-lg hover:bg-satriales-600 transition-colors">
              Explore Local Products
            </button>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-butcher-800 mb-4">Product Preparation Tips</h3>
            <p className="text-butcher-600 mb-4">
              Learn professional techniques for preparing different products. From trimming and tying to aging and tenderizing, 
              discover how to get the most flavor and value from your purchases.
            </p>
            <button className="px-4 py-2 bg-satriales-500 text-white rounded-lg hover:bg-satriales-600 transition-colors">
              View Preparation Tips
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 butcher-stamp opacity-10"></div>
      </div>
      
      {/* Newsletter Signup */}
      <div className="bg-butcher-800 text-white p-8 rounded-lg shadow-vintage">
        <h2 className="text-2xl font-semibold mb-4 font-serif">Join The Grange Community</h2>
        <p className="mb-6">
          Subscribe to receive updates on new products, special offers, and exclusive producer tips.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-1 px-4 py-3 rounded-md text-butcher-800 focus:outline-none focus:ring-2 focus:ring-satriales-500"
          />
          <button className="bg-satriales-500 hover:bg-satriales-600 transition-colors px-6 py-3 rounded-md font-medium">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheGrange;