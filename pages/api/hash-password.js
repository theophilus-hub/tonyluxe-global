import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  try {
    // Hardcode the password we want to hash
    const password = 'tonyluxemanager@123';
    
    // Generate a hash for the password
    const passwordHash = await hash(password, 10);
    
    // Return the hash
    return res.status(200).json({
      password,
      passwordHash,
      envVariable: `MANAGER_PASSWORD_HASH="${passwordHash}"`
    });
  } catch (error) {
    console.error('Hash generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate password hash',
      message: error.message
    });
  }
}
