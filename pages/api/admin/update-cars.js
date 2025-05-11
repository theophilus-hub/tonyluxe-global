import connectToDatabase from '../../../lib/mongodb';
import Car from '../../../models/Car';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  // Check authentication
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  });
  
  // Only admin can run this migration
  if (!token || token.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Connect to database
    await connectToDatabase();
    
    // Find cars without condition field
    const carsToUpdate = await Car.find({ condition: { $exists: false } });
    
    // Update cars with default condition "Used"
    const updateResult = await Car.updateMany(
      { condition: { $exists: false } },
      { $set: { condition: 'Used' } }
    );
    
    return res.status(200).json({ 
      success: true, 
      message: `Updated ${updateResult.modifiedCount} cars with condition field`,
      totalFound: carsToUpdate.length
    });
  } catch (error) {
    console.error('Error updating cars:', error);
    return res.status(500).json({ error: 'Failed to update cars' });
  }
}
