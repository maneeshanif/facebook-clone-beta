'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { FaSearch, FaMapMarkerAlt, FaPlus, FaTimes, FaCamera } from 'react-icons/fa';

interface Product {
  id: string;
  title: string;
  price: number;
  location: string;
  image_url: string;
  category: string;
  created_at: string;
  seller: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSellForm, setShowSellForm] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'vehicles', name: 'Vehicles' },
    { id: 'property', name: 'Property' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'hobbies', name: 'Hobbies' },
    { id: 'garden', name: 'Garden' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      // In a real app, we would fetch from Supabase
      // For now, we'll use mock data

      // Mock products data
      const mockProducts: Product[] = [
        {
          id: 'product1',
          title: 'iPhone 13 Pro - Like New',
          price: 799,
          location: 'San Francisco, CA',
          image_url: 'https://source.unsplash.com/random/800x600/?iphone',
          category: 'electronics',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          seller: {
            id: 'user1',
            full_name: 'Jane Smith',
            avatar_url: null,
          },
        },
        {
          id: 'product2',
          title: 'Leather Sofa - Excellent Condition',
          price: 450,
          location: 'Los Angeles, CA',
          image_url: 'https://source.unsplash.com/random/800x600/?sofa',
          category: 'furniture',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          seller: {
            id: 'user2',
            full_name: 'John Doe',
            avatar_url: null,
          },
        },
        {
          id: 'product3',
          title: 'Mountain Bike - Trek',
          price: 350,
          location: 'Seattle, WA',
          image_url: 'https://source.unsplash.com/random/800x600/?bike',
          category: 'hobbies',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          seller: {
            id: 'user3',
            full_name: 'Alice Johnson',
            avatar_url: null,
          },
        },
        {
          id: 'product4',
          title: 'Sony PlayStation 5',
          price: 499,
          location: 'Chicago, IL',
          image_url: 'https://source.unsplash.com/random/800x600/?playstation',
          category: 'electronics',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          seller: {
            id: 'user4',
            full_name: 'Bob Williams',
            avatar_url: null,
          },
        },
        {
          id: 'product5',
          title: 'Vintage Desk Lamp',
          price: 45,
          location: 'Portland, OR',
          image_url: 'https://source.unsplash.com/random/800x600/?lamp',
          category: 'furniture',
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          seller: {
            id: 'user5',
            full_name: 'Carol Brown',
            avatar_url: null,
          },
        },
        {
          id: 'product6',
          title: 'Canon EOS R5 Camera',
          price: 3299,
          location: 'New York, NY',
          image_url: 'https://source.unsplash.com/random/800x600/?camera',
          category: 'electronics',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          seller: {
            id: 'user6',
            full_name: 'David Miller',
            avatar_url: null,
          },
        },
        {
          id: 'product7',
          title: 'Dining Table with 4 Chairs',
          price: 250,
          location: 'Austin, TX',
          image_url: 'https://source.unsplash.com/random/800x600/?dining-table',
          category: 'furniture',
          created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          seller: {
            id: 'user7',
            full_name: 'Eve Davis',
            avatar_url: null,
          },
        },
        {
          id: 'product8',
          title: 'Nike Air Jordan 1 - Size 10',
          price: 180,
          location: 'Miami, FL',
          image_url: 'https://source.unsplash.com/random/800x600/?sneakers',
          category: 'clothing',
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          seller: {
            id: 'user8',
            full_name: 'Frank Wilson',
            avatar_url: null,
          },
        },
      ];

      setProducts(mockProducts);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    } else if (diffSeconds < 3600) {
      return `${Math.floor(diffSeconds / 60)} minutes ago`;
    } else if (diffSeconds < 86400) {
      return `${Math.floor(diffSeconds / 3600)} hours ago`;
    } else if (diffSeconds < 604800) {
      return `${Math.floor(diffSeconds / 86400)} days ago`;
    } else if (diffSeconds < 2592000) {
      return `${Math.floor(diffSeconds / 604800)} weeks ago`;
    } else if (diffSeconds < 31536000) {
      return `${Math.floor(diffSeconds / 2592000)} months ago`;
    } else {
      return `${Math.floor(diffSeconds / 31536000)} years ago`;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar />

      <div className="container mx-auto flex flex-1 flex-col lg:flex-row px-4 py-6">
        <Sidebar className="sticky top-16 hidden w-full lg:w-1/5 lg:block" />

        <div className="w-full px-0 sm:px-4 lg:w-4/5 lg:pl-4">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Marketplace</h1>
              <p className="text-gray-600">Buy and sell items in your local area</p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowSellForm(true)}
                className="flex items-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Sell Something
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Marketplace"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
            </div>

            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct ? (
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex justify-between">
                <h2 className="text-xl font-semibold">{selectedProduct.title}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-blue-600 hover:underline"
                >
                  Back to listings
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Image
                    src={selectedProduct.image_url}
                    alt={selectedProduct.title}
                    width={800}
                    height={600}
                    className="w-full rounded-lg object-cover"
                  />
                </div>

                <div>
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-green-600">${selectedProduct.price}</h3>
                    <p className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-1" />
                      {selectedProduct.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      Listed {formatTimeAgo(selectedProduct.created_at)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold">Seller Information</h4>
                    <div className="mt-2 flex items-center">
                      {selectedProduct.seller.avatar_url ? (
                        <Image
                          src={selectedProduct.seller.avatar_url}
                          alt={selectedProduct.seller.full_name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                          {getInitials(selectedProduct.seller.full_name)}
                        </div>
                      )}
                      <div className="ml-3">
                        <Link href={`/profile/${selectedProduct.seller.id}`} className="font-semibold hover:underline">
                          {selectedProduct.seller.full_name}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700">
                      Message Seller
                    </button>
                    <button className="w-full rounded-md border border-gray-300 bg-white py-2 font-semibold text-gray-700 hover:bg-gray-50">
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 font-semibold">Description</h4>
                <p className="text-gray-700">
                  This is a placeholder description for {selectedProduct.title}. In a real application, this would contain detailed information about the product, its condition, and any other relevant details the seller wants to share.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="relative h-48">
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">${product.price}</h3>
                      <p className="line-clamp-1">{product.title}</p>
                      <p className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="mr-1" />
                        {product.location}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-lg bg-white p-8 text-center shadow">
                  <p className="text-gray-600">No products found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sell Form Modal */}
        {showSellForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 sm:p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Sell Something</h2>
                <button
                  onClick={() => setShowSellForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="What are you selling?"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2">$</span>
                    <input
                      type="number"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pl-6 focus:border-blue-500 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                    {categories.filter(cat => cat.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Condition</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    rows={3}
                    placeholder="Describe what you're selling"
                  ></textarea>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Photos</label>
                  <label className="flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 hover:bg-gray-50">
                    <input type="file" className="hidden" accept="image/*" multiple />
                    <div className="text-center">
                      <FaCamera className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">Click to add photos</p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowSellForm(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert('Your item has been listed! (This is a demo)');
                      setShowSellForm(false);
                    }}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    List Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
