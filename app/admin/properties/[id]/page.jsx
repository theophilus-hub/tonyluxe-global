'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Star, 
  StarOff,
  MapPin,
  Home,
  Bath,
  BedDouble,
  SquareCode
} from 'lucide-react'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (status !== 'loading') {
      fetchProperty()
    }
  }, [status, id])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/properties/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch property')
      }
      
      const data = await response.json()
      console.log('Property data loaded:', data)
      if (data.property) {
        setProperty(data.property)
      } else if (data) {
        setProperty(data)
      } else {
        throw new Error('No property data found')
      }
    } catch (err) {
      console.error('Error fetching property:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete property')
      }
      
      router.push('/admin/properties')
    } catch (err) {
      console.error('Error deleting property:', err)
      setError(err.message)
    } finally {
      setDeleteModalOpen(false)
    }
  }

  const handleToggleFeatured = async () => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...property,
          featured: !property.featured,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update property')
      }
      
      setProperty({
        ...property,
        featured: !property.featured,
      })
    } catch (err) {
      console.error('Error updating property:', err)
      setError(err.message)
    }
  }

  const nextImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
      )
    }
  }

  const prevImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Link href="/admin/properties" className="text-brand-primary hover:underline">
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
          <p className="text-gray-700 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <Link href="/admin/properties" className="text-brand-primary hover:underline">
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <Link href="/admin/properties" className="text-gray-500 hover:text-gray-700 mr-4">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Property Details</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleToggleFeatured}
            className={`p-2 rounded-full ${
              property.featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'
            } hover:bg-opacity-80`}
            title={property.featured ? 'Remove from featured' : 'Add to featured'}
          >
            {property.featured ? <Star size={18} /> : <StarOff size={18} />}
          </button>
          <Link
            href={`/admin/properties/${id}/edit`}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
            title="Edit property"
          >
            <Edit size={18} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
            title="Delete property"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <>
            <Image
              src={property.images[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
            />
            {property.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button
                  onClick={prevImage}
                  className="bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100 transform rotate-180"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{property.title}</h2>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={18} className="mr-1" />
            <span>{property.location}</span>
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
              <BedDouble size={18} className="text-brand-primary mr-2" />
              <span>
                <span className="font-semibold">{property.bedrooms}</span> Bedrooms
              </span>
            </div>
            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
              <Bath size={18} className="text-brand-primary mr-2" />
              <span>
                <span className="font-semibold">{property.bathrooms}</span> Bathrooms
              </span>
            </div>
            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
              <SquareCode size={18} className="text-brand-primary mr-2" />
              <span>
                <span className="font-semibold">{property.squareFootage}</span> sq ft
              </span>
            </div>
            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
              <Home size={18} className="text-brand-primary mr-2" />
              <span>{property.propertyType}</span>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Price</h3>
            <p className="text-2xl font-bold text-brand-primary">
              ${property.price ? property.price.toLocaleString() : '0'}
            </p>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Status</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              property.status === 'For Sale' ? 'bg-green-100 text-green-800' :
              property.status === 'Sold' ? 'bg-red-100 text-red-800' :
              property.status === 'For Rent' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {property.status}
            </span>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
          </div>
          {property.features && property.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {property.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-brand-primary rounded-full mr-2"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Property</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the property "{property.title}"? This action cannot be undone.
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
