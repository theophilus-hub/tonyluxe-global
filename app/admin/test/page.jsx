'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function TestPage() {
  const { data: session, status } = useSession()
  const [testResults, setTestResults] = useState(null)
  const [statsResults, setStatsResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const runAuthTest = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Test the auth endpoint
      const authResponse = await fetch('/api/test-auth', {
        credentials: 'include',
      })
      const authData = await authResponse.json()
      setTestResults(authData)
      
      // Now try the stats endpoint
      const statsResponse = await fetch('/api/stats', {
        credentials: 'include',
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStatsResults({
          success: true,
          status: statsResponse.status,
          data: statsData
        })
      } else {
        setStatsResults({
          success: false,
          status: statsResponse.status,
          statusText: statsResponse.statusText,
          headers: Object.fromEntries([...statsResponse.headers])
        })
      }
    } catch (err) {
      console.error('Test error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">Session Status: {status}</h2>
        {session ? (
          <div>
            <p>User: {session.user?.name}</p>
            <p>Role: {session.user?.role}</p>
          </div>
        ) : (
          <p>No active session</p>
        )}
      </div>
      
      <button
        onClick={runAuthTest}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run Authentication Test'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>Error: {error}</p>
        </div>
      )}
      
      {testResults && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Auth Test Results</h2>
          <div className="p-4 bg-gray-50 rounded-lg border overflow-x-auto">
            <h3 className="font-medium mb-2">Authentication Status: {testResults.authenticated ? 'Authenticated ✅' : 'Not Authenticated ❌'}</h3>
            
            {testResults.tokenInfo && (
              <div className="mb-4">
                <h3 className="font-medium mb-1">Token Info:</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm">
                  {JSON.stringify(testResults.tokenInfo, null, 2)}
                </pre>
              </div>
            )}
            
            <div>
              <h3 className="font-medium mb-1">Request Info:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify(testResults.requestInfo, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
      
      {statsResults && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Stats API Test Results</h2>
          <div className="p-4 bg-gray-50 rounded-lg border overflow-x-auto">
            <h3 className="font-medium mb-2">
              Status: {statsResults.success ? 'Success ✅' : 'Failed ❌'} 
              ({statsResults.status} {statsResults.statusText || ''})
            </h3>
            
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(statsResults.success ? statsResults.data : statsResults, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
