import connectToDatabase from '../../../../lib/mongodb';
import Car from '../../../../models/Car';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  // Connect to the database
  try {
    await connectToDatabase();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to database' });
  }
  
  const { id } = req.query;
  
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid car ID' });
  }
  
  if (req.method === 'GET') {
    try {
      // Find car by ID
      const car = await Car.findById(id);
      
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
      
      // Format car data for frontend
      const formattedCar = {
        id: car._id.toString(),
        title: car.title,
        description: car.description,
        price: car.price,
        formattedPrice: `₦${car.price.toLocaleString()}`,
        location: car.location || 'Nigeria',
        make: car.make,
        model: car.model,
        year: car.year,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        color: car.color,
        condition: car.condition || 'Used',
        status: car.status,
        images: car.images || [],
        featured: car.featured,
        createdAt: car.createdAt,
        updatedAt: car.updatedAt
      };
      
      return res.status(200).json({ car: formattedCar });
    } catch (error) {
      console.error('Error fetching car:', error);
      return res.status(500).json({ error: 'Failed to fetch car' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
