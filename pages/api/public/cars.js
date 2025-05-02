import connectToDatabase from '../../../lib/mongodb';
import Car from '../../../models/Car';

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
        featured, 
        limit = 12, 
        page = 1, 
        minPrice, 
        maxPrice,
        make,
        model,
        year,
        status
      } = req.query;
      
      // Build query
      const query = {};
      
      // Filter by status
      if (status) {
        query.status = status;
      }
      
      // Featured cars
      if (featured === 'true') {
        query.featured = true;
      }
      
      // Price range
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice);
        if (maxPrice) query.price.$lte = parseInt(maxPrice);
      }
      
      // Make
      if (make) {
        query.make = { $regex: make, $options: 'i' };
      }
      
      // Model
      if (model) {
        query.model = { $regex: model, $options: 'i' };
      }
      
      // Year
      if (year) {
        query.year = parseInt(year);
      }
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Fetch cars with pagination
      const cars = await Car.find(query)
        .sort({ featured: -1, createdAt: -1 }) // Featured cars first, then newest
        .skip(skip)
        .limit(parseInt(limit));
      
      // Get total count for pagination
      const total = await Car.countDocuments(query);
      
      // Format cars for the frontend
      const formattedCars = cars.map(car => ({
        id: car._id.toString(),
        title: car.title,
        image: car.images[0] || '/placeholder-car.jpg', // Use first image or placeholder
        price: `₦${car.price.toLocaleString()}`,
        location: car.location || 'Nigeria',
        bedBath: `${car.make}/${car.model}`, // Reusing bedBath field for make/model
        status: car.status,
        make: car.make,
        model: car.model,
        year: car.year,
        featured: car.featured
      }));
      
      return res.status(200).json({ 
        properties: formattedCars, // Using 'properties' key to match the properties API
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching cars:', error);
      return res.status(500).json({ error: 'Error fetching cars' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
