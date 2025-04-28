import { getToken } from 'next-auth/jwt';
import connectToDatabase from '../../../lib/mongodb';
import Car from '../../../models/Car';
import { deleteImage } from '../../../lib/cloudinary';

export default async function handler(req, res) {
  // Check authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Connect to the database
  await connectToDatabase();
  
  // Get car ID from the URL
  const { id } = req.query;
  
  switch (req.method) {
    case 'GET':
      try {
        // Allow public access for GET requests
        const car = await Car.findById(id);
        
        if (!car) {
          return res.status(404).json({ error: 'Car not found' });
        }
        
        return res.status(200).json({ car });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
      
    case 'PUT':
      // Only manager can update cars
      if (!token || token.role !== 'manager') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      try {
        const car = await Car.findByIdAndUpdate(
          id,
          { ...req.body, updatedAt: Date.now() },
          { new: true, runValidators: true }
        );
        
        if (!car) {
          return res.status(404).json({ error: 'Car not found' });
        }
        
        return res.status(200).json({ car });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
      
    case 'DELETE':
      // Only manager can delete cars
      if (!token || token.role !== 'manager') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      try {
        // Find the car first to get its images
        const car = await Car.findById(id);
        
        if (!car) {
          return res.status(404).json({ error: 'Car not found' });
        }
        
        // Delete images from Cloudinary if they have public_ids
        for (const imageUrl of car.images) {
          try {
            // Extract public_id from Cloudinary URL
            const urlParts = imageUrl.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = `tonyluxe/${publicIdWithExtension.split('.')[0]}`;
            
            await deleteImage(publicId);
          } catch (error) {
            console.error('Error deleting image:', error);
            // Continue with other images even if one fails
          }
        }
        
        // Delete the car from the database
        await Car.findByIdAndDelete(id);
        
        return res.status(200).json({ message: 'Car deleted successfully' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
