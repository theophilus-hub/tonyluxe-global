/**
 * Utility functions for API requests with authentication
 */

/**
 * Make an authenticated API request
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - The fetch response
 */
export async function authenticatedFetch(url, options = {}) {
  try {
    // Get the current session data
    const sessionResponse = await fetch('/api/auth/session');
    const sessionData = await sessionResponse.json();
    
    // Prepare headers with authentication data
    const headers = {
      ...options.headers || {},
      'Content-Type': 'application/json',
      'X-Session-Data': JSON.stringify({
        role: sessionData?.user?.role || '',
        email: sessionData?.user?.email || '',
        name: sessionData?.user?.name || ''
      })
    };
    
    // Make the authenticated request
    return fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });
  } catch (error) {
    console.error('Error making authenticated request:', error);
    throw error;
  }
}
