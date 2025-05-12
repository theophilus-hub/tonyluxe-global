import { getToken } from 'next-auth/jwt';
import connectToDatabase from '../../../lib/mongodb';
import Property from '../../../models/Property';
import { deleteImage } from '../../../lib/cloudinary';
import { parse } from 'cookie';

export default async function handler(req, res) {
  // Set CORS headers to allow the frontend to access this API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Session-Data');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
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
      // Authentication check for PUT requests
      let isAuthenticated = false;
      let role = null;
      
      // 1. Check for custom session header from the frontend
      if (req.headers['x-session-data']) {
        try {
          const sessionData = JSON.parse(req.headers['x-session-data']);
          if (sessionData && sessionData.role && 
              (sessionData.role === 'admin' || sessionData.role === 'manager')) {
            isAuthenticated = true;
            role = sessionData.role;
            console.log('Authenticated via X-Session-Data header');
          }
        } catch (e) {
          // Continue to other auth methods
          console.log('Failed to parse X-Session-Data header:', e.message);
        }
      }
      
      // 2. Check for session cookie
      if (!isAuthenticated && req.headers.cookie) {
        const cookies = parse(req.headers.cookie);
        const hasSessionCookie = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token'];
        
        if (hasSessionCookie && req.headers['x-session-data']) {
          try {
            const sessionData = JSON.parse(req.headers['x-session-data']);
            if (sessionData && sessionData.role && 
                (sessionData.role === 'admin' || sessionData.role === 'manager')) {
              isAuthenticated = true;
              role = sessionData.role;
              console.log('Authenticated via session cookie and X-Session-Data header');
            }
          } catch (e) {
            console.log('Failed to parse X-Session-Data with cookie:', e.message);
          }
        }
      }
      
      // 3. Try the original token method as fallback
      if (!isAuthenticated) {
        try {
          const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
          console.log('Auth token:', token ? 'Valid' : 'Invalid', 'Role:', token?.role);
          
          if (token && token.role && (token.role === 'admin' || token.role === 'manager')) {
            isAuthenticated = true;
            role = token.role;
            console.log('Authenticated via JWT token');
          }
        } catch (e) {
          console.log('JWT token verification failed:', e.message);
        }
      }
      
      // 4. For development only: Allow access in development mode with a special query param
      if (process.env.NODE_ENV === 'development' && req.query.dev_bypass === 'true') {
        isAuthenticated = true;
        role = 'manager';
        console.log('Development bypass authentication enabled');
      }
      
      // Check authentication result
      if (!isAuthenticated) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // Check role - only manager can update properties
      if (role !== 'manager' && role !== 'admin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
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
      // Authentication check for DELETE requests
      let isAuthenticatedForDelete = false;
      let roleForDelete = null;
      
      // 1. Check for custom session header from the frontend
      if (req.headers['x-session-data']) {
        try {
          const sessionData = JSON.parse(req.headers['x-session-data']);
          if (sessionData && sessionData.role && 
              (sessionData.role === 'admin' || sessionData.role === 'manager')) {
            isAuthenticatedForDelete = true;
            roleForDelete = sessionData.role;
            console.log('Authenticated via X-Session-Data header');
          }
        } catch (e) {
          // Continue to other auth methods
          console.log('Failed to parse X-Session-Data header:', e.message);
        }
      }
      
      // 2. Check for session cookie
      if (!isAuthenticatedForDelete && req.headers.cookie) {
        const cookies = parse(req.headers.cookie);
        const hasSessionCookie = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token'];
        
        if (hasSessionCookie && req.headers['x-session-data']) {
          try {
            const sessionData = JSON.parse(req.headers['x-session-data']);
            if (sessionData && sessionData.role && 
                (sessionData.role === 'admin' || sessionData.role === 'manager')) {
              isAuthenticatedForDelete = true;
              roleForDelete = sessionData.role;
              console.log('Authenticated via session cookie and X-Session-Data header');
            }
          } catch (e) {
            console.log('Failed to parse X-Session-Data with cookie:', e.message);
          }
        }
      }
      
      // 3. Try the original token method as fallback
      if (!isAuthenticatedForDelete) {
        try {
          const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
          console.log('Auth token:', token ? 'Valid' : 'Invalid', 'Role:', token?.role);
          
          if (token && token.role && (token.role === 'admin' || token.role === 'manager')) {
            isAuthenticatedForDelete = true;
            roleForDelete = token.role;
            console.log('Authenticated via JWT token');
          }
        } catch (e) {
          console.log('JWT token verification failed:', e.message);
        }
      }
      
      // 4. For development only: Allow access in development mode with a special query param
      if (process.env.NODE_ENV === 'development' && req.query.dev_bypass === 'true') {
        isAuthenticatedForDelete = true;
        roleForDelete = 'manager';
        console.log('Development bypass authentication enabled');
      }
      
      // Check authentication result
      if (!isAuthenticatedForDelete) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // Check role - only manager can delete properties
      if (roleForDelete !== 'manager' && roleForDelete !== 'admin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
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
