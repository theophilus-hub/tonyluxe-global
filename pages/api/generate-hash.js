import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  // Only allow this in development mode for security
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'This endpoint is only available in development mode' });
  }
  
  try {
    // Get the password from query parameter
    const { password } = req.query;
    
    if (!password) {
      return res.status(400).json({ 
        error: 'Password is required',
        usage: 'Add ?password=yourpassword to the URL' 
      });
    }
    
    // Generate a hash for the password
    const passwordHash = await hash(password, 10);
    
    // Return the hash and instructions
    return res.status(200).json({
      success: true,
      password,
      passwordHash,
      instructions: `
        Add this to your .env.local file:
        MANAGER_PASSWORD_HASH="${passwordHash}"
      `
    });
  } catch (error) {
    console.error('Generate hash error:', error);
    return res.status(500).json({
      error: 'Failed to generate password hash',
      message: error.message
    });
  }
}
