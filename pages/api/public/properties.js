import connectToDatabase from '../../../lib/mongodb';
import Property from '../../../models/Property';

export default async function handler(req, res) {
  // Connect to the database
  try {
    await connectToDatabase();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to database' });
  }
  
  if (req.method === 'GET') {
    try {
      const { 
        propertyType, 
        featured, 
        limit = 12, 
        page = 1, 
        minPrice, 
        maxPrice,
        bedrooms,
        location 
      } = req.query;
      
      // Build query
      const query = {};
      
      // Filter by property status based on propertyType
      if (propertyType) {
        if (propertyType === 'Buy') {
          query.status = 'For Sale';
        } else if (propertyType === 'Rent') {
          query.status = 'For Rent';
        } else if (propertyType === 'Airbnb' || propertyType === 'Short Let') {
          query.propertyType = 'Short Let';
        }
      }
      
      // Featured properties
      if (featured === 'true') {
        query.featured = true;
      }
      
      // Price range
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice);
        if (maxPrice) query.price.$lte = parseInt(maxPrice);
      }
      
      // Bedrooms
      if (bedrooms) {
        query.bedrooms = parseInt(bedrooms);
      }
      
      // Location
      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Fetch properties with pagination
      const properties = await Property.find(query)
        .sort({ featured: -1, createdAt: -1 }) // Featured properties first, then newest
        .skip(skip)
        .limit(parseInt(limit));
      
      // Get total count for pagination
      const total = await Property.countDocuments(query);
      
      // Format properties for the frontend
      const formattedProperties = properties.map(property => ({
        id: property._id.toString(),
        title: property.title,
        image: property.images[0] || '/placeholder-property.jpg', // Use first image or placeholder
        price: property.status === 'For Rent' 
          ? `₦${property.price.toLocaleString()}/yr` 
          : `₦${property.price.toLocaleString()}`,
        location: property.location,
        bedBath: `${property.bedrooms}/${property.bathrooms}`,
        status: property.status,
        propertyType: property.propertyType,
        featured: property.featured
      }));
      
      return res.status(200).json({ 
        properties: formattedProperties, 
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      return res.status(500).json({ error: 'Error fetching properties' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
