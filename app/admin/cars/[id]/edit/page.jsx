'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import CarForm from '../../components/CarForm'

export default function EditCarPage({ params }) {
  const { id } = params
  const { data: session, status } = useSession()
  const router = useRouter()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch car data
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch car')
        }
        
        const data = await response.json()
        setCar(data.car)
      } catch (err) {
        console.error('Error fetching car:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id && status === 'authenticated' && session?.user?.role === 'manager') {
      fetchCar()
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
                onClick={() => router.push('/admin/cars')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
              >
                Back to Cars
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'authenticated' && session?.user?.role === 'manager' && car) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Car</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update the car details and images.
          </p>
        </div>
        
        <CarForm car={car} />
      </div>
    )
  }

  return null
}
