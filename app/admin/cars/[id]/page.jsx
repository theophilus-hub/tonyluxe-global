'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Edit, 
  ArrowLeft, 
  Star, 
  StarOff,
  Trash2,
  Car
} from 'lucide-react'

export default function CarDetailPage({ params }) {
  const { id } = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Fetch car data
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch car')
        }
        
        const data = await response.json()
        console.log('Car data loaded:', data)
        if (data.car) {
          setCar(data.car)
        } else if (data) {
          setCar(data)
        } else {
          throw new Error('No car data found')
        }
      } catch (err) {
        console.error('Error fetching car:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id && status !== 'loading') {
      fetchCar()
    }
  }, [id, status])

  // Redirect if not a manager
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'manager') {
      router.push('/admin/dashboard')
    }
  }, [session, status, router])

  const handleDeleteClick = () => {
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete car')
      }

      // Redirect to cars list
      router.push('/admin/cars')
    } catch (err) {
      console.error('Error deleting car:', err)
      setError(err.message)
    }
  }

  const handleToggleFeatured = async () => {
    if (!car) return

    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...car,
          featured: !car.featured,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update car')
      }

      setCar({
        ...car,
        featured: !car.featured,
      })
      console.log('Car updated - featured:', !car.featured)
    } catch (err) {
      console.error('Error updating car:', err)
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
        <Link href="/admin/cars" className="text-brand-primary hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-1" /> Back to Cars
        </Link>
      </div>
    )
  }

  if (status === 'authenticated' && session?.user?.role === 'manager' && car) {
    return (
      <div>
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/cars')}
                className="mr-2 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{car.title}</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {car.make} {car.model} • {car.year}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleToggleFeatured}
              className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md ${
                car.featured 
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary`}
            >
              {car.featured ? (
                <>
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  Featured
                </>
              ) : (
                <>
                  <StarOff className="h-4 w-4 mr-2" />
                  Not Featured
                </>
              )}
            </button>
            
            <Link
              href={`/admin/cars/${id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            
            <button
              onClick={handleDeleteClick}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
        
        {/* Car details */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Image gallery */}
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                  {car.images && car.images.length > 0 ? (
                    <Image
                      src={car.images[activeImageIndex]}
                      alt={car.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Car className="h-16 w-16 text-gray-400" />
                      <p className="text-gray-500 ml-2">No image available</p>
                    </div>
                  )}
                </div>
                
                {car.images && car.images.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {car.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`relative h-12 w-12 rounded-md overflow-hidden cursor-pointer ${
                          index === activeImageIndex ? 'ring-2 ring-brand-primary' : 'border border-gray-200'
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={image}
                          alt={`${car.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-6 bg-white p-4 rounded-lg shadow-sm">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Car Details</h3>
                  
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Make</dt>
                        <dd className="mt-1 text-sm text-gray-900">{car.make}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Model</dt>
                        <dd className="mt-1 text-sm text-gray-900">{car.model}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Year</dt>
                        <dd className="mt-1 text-sm text-gray-900">{car.year}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Color</dt>
                        <dd className="mt-1 text-sm text-gray-900">{car.color}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Mileage</dt>
                        <dd className="mt-1 text-sm text-gray-900">{car.mileage ? car.mileage.toLocaleString() : '0'} km</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Fuel Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{car.fuelType}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Transmission</dt>
                        <dd className="mt-1 text-sm text-gray-900">{car.transmission}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            car.status === 'For Sale' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {car.status}
                          </span>
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Price</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-semibold">₦{car.price ? car.price.toLocaleString() : '0'}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Featured</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {car.featured ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              Featured
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Not Featured
                            </span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Description</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>{car.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setDeleteModalOpen(false)}>
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Car</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this car? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}
