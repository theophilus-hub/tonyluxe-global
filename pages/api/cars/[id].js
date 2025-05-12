import { getToken } from 'next-auth/jwt';
import connectToDatabase from '../../../lib/mongodb';
import Car from '../../../models/Car';
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
      
      // Check role - only manager can update cars
      if (role !== 'manager' && role !== 'admin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
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
      
      // Check role - only manager can delete cars
      if (roleForDelete !== 'manager' && roleForDelete !== 'admin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
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
