import { getToken } from 'next-auth/jwt';
import connectToDatabase from '../../../lib/mongodb';
import Car from '../../../models/Car';

export default async function handler(req, res) {
  // Check authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Connect to the database
  await connectToDatabase();
  
  switch (req.method) {
    case 'GET':
      try {
        // Allow public access for GET requests
        const { featured, limit = 10, page = 1, status, search } = req.query;
        
        // Build query
        const query = {};
        if (featured === 'true') query.featured = true;
        if (status) query.status = status;
        
        // Add search functionality
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { make: { $regex: search, $options: 'i' } },
            { model: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ];
        }
        
        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Fetch cars with pagination
        const cars = await Car.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
        
        // Get total count for pagination
        const total = await Car.countDocuments(query);
        
        return res.status(200).json({ 
          cars, 
          pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
          }
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
      
    case 'POST':
      // Only manager can create cars
      if (!token || token.role !== 'manager') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      try {
        // Check if a car with the same title already exists
        const existingCar = await Car.findOne({ title: req.body.title });
        if (existingCar) {
          return res.status(400).json({ error: 'A car with this title already exists' });
        }
        
        const car = await Car.create(req.body);
        return res.status(201).json({ car });
      } catch (error) {
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
          return res.status(400).json({ error: 'A car with this title already exists' });
        }
        return res.status(400).json({ error: error.message });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
