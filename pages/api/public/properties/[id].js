import connectToDatabase from '../../../../lib/mongodb';
import Property from '../../../../models/Property';
import { ObjectId } from 'mongodb';

// Currency utility function for server-side
function getCurrencySymbol(currency) {
  return currency === 'USD' ? '$' : '₦';
}

function formatCurrency(amount, currency = 'NGN') {
  const symbol = getCurrencySymbol(currency);
  const numericAmount = parseFloat(amount);
  
  if (isNaN(numericAmount)) return `${symbol}0`;
  
  return `${symbol}${numericAmount.toLocaleString()}`;
}

export default async function handler(req, res) {
  // Connect to the database
  try {
    await connectToDatabase();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to database' });
  }
  
  const { id } = req.query;
  
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid property ID' });
  }
  
  if (req.method === 'GET') {
    try {
      // Find property by ID
      const property = await Property.findById(id);
      
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      // Format property data for frontend
      const formattedProperty = {
        id: property._id.toString(),
        title: property.title,
        description: property.description,
        price: property.price,
        formattedPrice: formatCurrency(property.price, property.currency),
        location: property.location || 'Nigeria',
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        bedBath: `${property.bedrooms}/${property.bathrooms}`,
        size: property.squareFootage, // Add squareFootage as size for the frontend
        status: property.status,
        propertyType: property.propertyType,
        amenities: property.amenities || [],
        interiorFeatures: property.interiorFeatures || [],
        exteriorFeatures: property.exteriorFeatures || [],
        images: property.images || [],
        featured: property.featured,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt
      };
      
      return res.status(200).json({ property: formattedProperty });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch property' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
