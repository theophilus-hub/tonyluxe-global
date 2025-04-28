'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PropertyForm from '../../components/PropertyForm'

export default function EditPropertyPage({ params }) {
  const { id } = params
  const { data: session, status } = useSession()
  const router = useRouter()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch property')
        }
        
        const data = await response.json()
        setProperty(data.property)
      } catch (err) {
        console.error('Error fetching property:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id && status === 'authenticated' && session?.user?.role === 'manager') {
      fetchProperty()
    }
  }, [id, session, status])

  // Redirect if not a manager
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'manager') {
      router.push('/admin/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error: {error}
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push('/admin/properties')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
              >
                Back to Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'authenticated' && session?.user?.role === 'manager' && property) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update the property details and images.
          </p>
        </div>
        
        <PropertyForm property={property} />
      </div>
    )
  }

  return null
}
