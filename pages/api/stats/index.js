import { getToken } from 'next-auth/jwt';
import connectToDatabase from '../../../lib/mongodb';
import Property from '../../../models/Property';
import Car from '../../../models/Car';

export default async function handler(req, res) {
  // Check authentication using JWT token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Only admin can access statistics
  if (!token || token.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get property statistics
    const totalProperties = await Property.countDocuments();
    const propertiesForSale = await Property.countDocuments({ status: 'For Sale' });
    const propertiesForRent = await Property.countDocuments({ status: 'For Rent' });
    const propertiesSold = await Property.countDocuments({ status: 'Sold' });
    const propertiesRented = await Property.countDocuments({ status: 'Rented' });
    const featuredProperties = await Property.countDocuments({ featured: true });
    
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
      { $match: { status: { $in: ['For Sale', 'For Rent'] } } },
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
    return res.status(500).json({ error: 'Error fetching statistics' });
  }
}
