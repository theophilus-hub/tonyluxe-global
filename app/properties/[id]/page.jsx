'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductPage from '../../../components/ProductPage';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/properties/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch property details');
        }
        
        const data = await response.json();
        console.log('Property data received:', data.property);
        setProperty(data.property);
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Failed to load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="text-gray-700">{error || 'Property not found'}</p>
        <a href="/properties" className="mt-4 text-blue-500 hover:underline">
          Back to Properties
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ProductPage product={property} type="property" />
    </div>
  );
}
