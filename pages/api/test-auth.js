import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  try {
    // Get the raw token without any options
    const token = await getToken({ req });
    
    // Get request details
    const requestInfo = {
      headers: {
        // Only include headers that might be relevant for debugging
        cookie: req.headers.cookie ? 'Present (not shown for security)' : 'Not present',
        authorization: req.headers.authorization ? 'Present (not shown for security)' : 'Not present',
        'user-agent': req.headers['user-agent'],
        host: req.headers.host,
        origin: req.headers.origin,
        referer: req.headers.referer
      },
      method: req.method,
      url: req.url,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    };
    
    // Return authentication status and request details
    return res.status(200).json({
      authenticated: !!token,
      tokenInfo: token ? {
        role: token.role,
        name: token.name,
        exp: token.exp,
        iat: token.iat,
        // Don't include sensitive data
      } : null,
      requestInfo
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return res.status(500).json({
      error: 'Authentication test failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
