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
        
        // Log the raw property data from MongoDB
        console.log('Raw property from MongoDB:', property);
        console.log('Raw interior features:', property.interiorFeatures);
        console.log('Raw exterior features:', property.exteriorFeatures);
        console.log('Interior features type:', typeof property.interiorFeatures);
        console.log('Interior features is array:', Array.isArray(property.interiorFeatures));
        
        // Convert property to plain object to ensure all fields are included
        const propertyObj = property.toObject();
        
        // Log the property after conversion to plain object
        console.log('Property after toObject():', propertyObj);
        console.log('Interior features after toObject():', propertyObj.interiorFeatures);
        console.log('Exterior features after toObject():', propertyObj.exteriorFeatures);
        
        // Ensure interior and exterior features are proper JavaScript arrays
        // This is critical for proper serialization to the client
        if (Array.isArray(propertyObj.interiorFeatures)) {
          // Create a new array with the values to ensure it's a plain JavaScript array
          propertyObj.interiorFeatures = [...propertyObj.interiorFeatures];
          console.log('Interior features converted to plain JavaScript array');
        } else {
          propertyObj.interiorFeatures = [];
          console.log('Interior features was not an array, converted to empty array');
        }
        
        if (Array.isArray(propertyObj.exteriorFeatures)) {
          // Create a new array with the values to ensure it's a plain JavaScript array
          propertyObj.exteriorFeatures = [...propertyObj.exteriorFeatures];
          console.log('Exterior features converted to plain JavaScript array');
        } else {
          propertyObj.exteriorFeatures = [];
          console.log('Exterior features was not an array, converted to empty array');
        }
        
        console.log('GET property API final response:', {
          id: propertyObj._id,
          interiorFeatures: propertyObj.interiorFeatures,
          exteriorFeatures: propertyObj.exteriorFeatures
        });
        
        return res.status(200).json({ property: propertyObj });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
      
    case 'PUT':
      // Only manager can update properties
      if (!token || token.role !== 'manager') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      try {
        console.log('Property update request body:', req.body);
        console.log('Interior features in request:', req.body.interiorFeatures);
        console.log('Exterior features in request:', req.body.exteriorFeatures);
        
        // Ensure interior and exterior features are arrays
        const updateData = {
          ...req.body,
          interiorFeatures: Array.isArray(req.body.interiorFeatures) ? req.body.interiorFeatures : [],
          exteriorFeatures: Array.isArray(req.body.exteriorFeatures) ? req.body.exteriorFeatures : [],
          updatedAt: Date.now()
        };
        
        console.log('Processed update data:', {
          interiorFeatures: updateData.interiorFeatures,
          exteriorFeatures: updateData.exteriorFeatures
        });
        
        // Log the raw request body for debugging
        console.log('Raw request body:', req.body);
        console.log('Request body type:', typeof req.body);
        console.log('Interior features type:', typeof req.body.interiorFeatures);
        console.log('Interior features is array:', Array.isArray(req.body.interiorFeatures));
        
        const property = await Property.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );
        
        console.log('Updated property:', property);
        console.log('Interior features after update:', property.interiorFeatures);
        console.log('Exterior features after update:', property.exteriorFeatures);
        
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
