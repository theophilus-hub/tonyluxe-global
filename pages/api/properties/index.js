import { getToken } from 'next-auth/jwt';
import connectToDatabase from '../../../lib/mongodb';
import Property from '../../../models/Property';
import { parse } from 'cookie';

export default async function handler(req, res) {
  // Set CORS headers to allow the frontend to access this API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Session-Data');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
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
            { location: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ];
        }
        
        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Fetch properties with pagination
        const properties = await Property.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
        
        // Get total count for pagination
        const total = await Property.countDocuments(query);
        
        return res.status(200).json({ 
          properties, 
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
      // Authentication check for POST requests
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
      
      // Check role - only manager can create properties
      if (role !== 'manager' && role !== 'admin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      try {
        // Check if a property with the same title already exists
        const existingProperty = await Property.findOne({ title: req.body.title });
        if (existingProperty) {
          return res.status(400).json({ error: 'A property with this title already exists' });
        }
        
        console.log('Property creation request body:', req.body);
        console.log('Interior features in request:', req.body.interiorFeatures);
        console.log('Exterior features in request:', req.body.exteriorFeatures);
        
        // Ensure interior and exterior features are arrays
        const createData = {
          ...req.body,
          interiorFeatures: Array.isArray(req.body.interiorFeatures) ? req.body.interiorFeatures : [],
          exteriorFeatures: Array.isArray(req.body.exteriorFeatures) ? req.body.exteriorFeatures : []
        };
        
        console.log('Processed create data:', {
          interiorFeatures: createData.interiorFeatures,
          exteriorFeatures: createData.exteriorFeatures
        });
        
        const property = await Property.create(createData);
        
        console.log('Created property:', property);
        console.log('Interior features after creation:', property.interiorFeatures);
        console.log('Exterior features after creation:', property.exteriorFeatures);
        
        return res.status(201).json({ property });
      } catch (error) {
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
          return res.status(400).json({ error: 'A property with this title already exists' });
        }
        return res.status(400).json({ error: error.message });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
