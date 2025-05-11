import { compare } from 'bcryptjs';

export default async function handler(req, res) {
  try {
    // Get credentials from environment variables and log them for debugging
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '$2b$10$C25celpJegyHCLYzzm0vcOdUCJ2Jq9QtBWKz3TIuEJQWc0y4o0Mgm';
    const managerUsername = process.env.MANAGER_USERNAME || 'manager';
    const managerPasswordHash = process.env.MANAGER_PASSWORD_HASH || '$2b$10$7LWzBlNsnkAL5S3SOvvFtuGI08N6eJ9MPdKKspi6b0yosmmTz8Hjq';
    
    console.log('Environment variables loaded:');
    console.log('ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH ? 'Present (not shown)' : 'Not set');
    console.log('MANAGER_PASSWORD_HASH:', process.env.MANAGER_PASSWORD_HASH ? 'Present (not shown)' : 'Not set');
    
    // Test password for admin with the new password
    const adminTestPassword = 'tonyluxeadmin@123';
    const isAdminPasswordValid = await compare(adminTestPassword, adminPasswordHash);
    
    // Test password for manager with the new password
    const managerTestPassword = 'tonyluxemanager@123';
    const isManagerPasswordValid = await compare(managerTestPassword, managerPasswordHash);
    
    // Return test results
    return res.status(200).json({
      environment: process.env.NODE_ENV,
      adminCredentials: {
        username: adminUsername,
        passwordHash: adminPasswordHash.substring(0, 10) + '...',
        testPasswordValid: isAdminPasswordValid
      },
      managerCredentials: {
        username: managerUsername,
        passwordHash: managerPasswordHash.substring(0, 10) + '...',
        testPasswordValid: isManagerPasswordValid
      }
    });
  } catch (error) {
    console.error('Credential test error:', error);
    return res.status(500).json({
      error: 'Credential test failed',
      message: error.message
    });
  }
}