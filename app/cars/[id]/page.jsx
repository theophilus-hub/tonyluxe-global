'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductPage from '../../../components/ProductPage';

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/cars/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch car details');
        }
        
        const data = await response.json();
        setCar(data.car);
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError('Failed to load car details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchCar();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="text-gray-700">{error || 'Car not found'}</p>
        <a href="/cars" className="mt-4 text-blue-500 hover:underline">
          Back to Cars
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ProductPage product={car} type="car" />
    </div>
  );
}
