import { getToken } from 'next-auth/jwt';
import connectToDatabase from '../../../lib/mongodb';
import Property from '../../../models/Property';
import { deleteImage } from '../../../lib/cloudinary';

export default async function handler(req, res) {
  // Check authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Connect to the database
  await connectToDatabase();
  
  // Get property ID from the URL
  const { id } = req.query;
  
  switch (req.method) {
    case 'GET':
      try {
        // Allow public access for GET requests
        const property = await Property.findById(id);
        
        if (!property) {
          return res.status(404).json({ error: 'Property not found' });
        }
        
        return res.status(200).json({ property });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
      
    case 'PUT':
      // Only manager can update properties
      if (!token || token.role !== 'manager') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      try {
        const property = await Property.findByIdAndUpdate(
          id,
          { ...req.body, updatedAt: Date.now() },
          { new: true, runValidators: true }
        );
        
        if (!property) {
          return res.status(404).json({ error: 'Property not found' });
        }
        
        return res.status(200).json({ property });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
      
    case 'DELETE':
      // Only manager can delete properties
      if (!token || token.role !== 'manager') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      try {
        // Find the property first to get its images
        const property = await Property.findById(id);
        
        if (!property) {
          return res.status(404).json({ error: 'Property not found' });
        }
        
        // Delete images from Cloudinary if they have public_ids
        // This assumes the image URLs are stored with their public_ids
        for (const imageUrl of property.images) {
          try {
            // Extract public_id from Cloudinary URL
            // Format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/tonyluxe/public_id
            const urlParts = imageUrl.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = `tonyluxe/${publicIdWithExtension.split('.')[0]}`;
            
            await deleteImage(publicId);
          } catch (error) {
            console.error('Error deleting image:', error);
            // Continue with other images even if one fails
          }
        }
        
        // Delete the property from the database
        await Property.findByIdAndDelete(id);
        
        return res.status(200).json({ message: 'Property deleted successfully' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
