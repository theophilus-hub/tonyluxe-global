import { getToken } from 'next-auth/jwt';
import connectToDatabase from '../../../lib/mongodb';
import Property from '../../../models/Property';
import Car from '../../../models/Car';

// Helper function to log errors in production
const logError = (error, message) => {
  console.error(`Stats API Error - ${message}:`, error);
  return { error: message, details: process.env.NODE_ENV === 'development' ? error.message : undefined };
};

export default async function handler(req, res) {
  try {
    // Check authentication using JWT token with simplified options
    const token = await getToken({ req });
    
    // Log authentication attempt in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth token received:', token ? 'Valid token' : 'No token');
      if (token) console.log('User role:', token.role);
    }
    
    // Check if user is authenticated
    if (!token) {
      console.error('Authentication failed: No token');
      return res.status(401).json({ error: 'Authentication required', code: 'NO_TOKEN' });
    }
    
    // Check if user has appropriate role
    if (token.role !== 'admin' && token.role !== 'manager') {
      console.error(`Authentication failed: Invalid role ${token.role}`);
      return res.status(403).json({ error: 'Insufficient permissions', code: 'INVALID_ROLE' });
    }
  
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
    // Connect to the database
    await connectToDatabase();
    
    // Log successful connection in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Successfully connected to database');
    }
    
    // Get property statistics
    const totalProperties = await Property.countDocuments();
    const propertiesForSale = await Property.countDocuments({ status: 'For Sale' });
    const propertiesForRent = await Property.countDocuments({ status: 'For Rent' });
    const propertiesSold = await Property.countDocuments({ status: 'Sold' });
    const propertiesRented = await Property.countDocuments({ status: 'Rented' });
    const propertiesAvailable = await Property.countDocuments({ status: 'Available' });
    const propertiesTaken = await Property.countDocuments({ status: 'Taken' });
    const featuredProperties = await Property.countDocuments({ featured: true });
    
    // Get Short Let properties
    const shortLetProperties = await Property.countDocuments({ propertyType: 'Short Let' });
    
    // Get car statistics
    const totalCars = await Car.countDocuments();
    const carsForSale = await Car.countDocuments({ status: 'For Sale' });
    const carsSold = await Car.countDocuments({ status: 'Sold' });
    const featuredCars = await Car.countDocuments({ featured: true });
    
    // Get recent properties
    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title price status createdAt');
    
    // Get recent cars
    const recentCars = await Car.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title price status createdAt');
    
    // Calculate total value of properties and cars
    const propertyValuePipeline = [
      { $match: { status: { $in: ['For Sale', 'For Rent', 'Available'] } } },
      { $group: { _id: null, totalValue: { $sum: '$price' } } }
    ];
    
    const carValuePipeline = [
      { $match: { status: 'For Sale' } },
      { $group: { _id: null, totalValue: { $sum: '$price' } } }
    ];
    
    const propertyValueResult = await Property.aggregate(propertyValuePipeline);
    const carValueResult = await Car.aggregate(carValuePipeline);
    
    const totalPropertyValue = propertyValueResult.length > 0 ? propertyValueResult[0].totalValue : 0;
    const totalCarValue = carValueResult.length > 0 ? carValueResult[0].totalValue : 0;
    
    // Return all statistics
    return res.status(200).json({
      properties: {
        total: totalProperties,
        forSale: propertiesForSale,
        forRent: propertiesForRent,
        sold: propertiesSold,
        rented: propertiesRented,
        available: propertiesAvailable,
        taken: propertiesTaken,
        shortLet: shortLetProperties,
        featured: featuredProperties,
        totalValue: totalPropertyValue,
        recent: recentProperties
      },
      cars: {
        total: totalCars,
        forSale: carsForSale,
        sold: carsSold,
        featured: featuredCars,
        totalValue: totalCarValue,
        recent: recentCars
      },
      overall: {
        totalListings: totalProperties + totalCars,
        totalValue: totalPropertyValue + totalCarValue
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json(logError(error, 'Failed to fetch statistics'));
  }
}
