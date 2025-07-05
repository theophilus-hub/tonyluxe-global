'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  X, 
  Plus,
  Loader2
} from 'lucide-react'
import Image from 'next/image'
import { authenticatedFetch } from '../../../../lib/apiUtils'

export default function PropertyForm({ property = null }) {
  const router = useRouter()
  const isEditing = !!property
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'NGN',
    location: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    propertyType: 'Apartment',
    status: 'For Sale',
    featured: false,
    interiorFeatures: [],
    exteriorFeatures: [],
    images: []
  })
  
  const [newInteriorFeature, setNewInteriorFeature] = useState('')
  const [newExteriorFeature, setNewExteriorFeature] = useState('')
  
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Property types and status options
  const propertyTypes = [
    'Apartment',
    'House',
    'Villa',
    'Condo (Condominium)',
    'Duplex',
    'Penthouse',
    'Studio',
    'Bungalow',
    'Townhouse',
    'Land',
    'Commercial Property',
    'Office Space',
    'Retail',
    'Hotel/Guest House',
    'Warehouse',
    'Industrial Property',
    'Farm',
    'Short Let'
  ]
  
  // Regular status options for most property types
  const regularStatusOptions = ['For Sale', 'For Rent', 'Sold', 'Rented']
  
  // Status options specifically for Short Let properties
  const shortLetStatusOptions = ['Available', 'Taken']
  
  // Determine which status options to use based on property type
  const statusOptions = formData.propertyType === 'Short Let' ? shortLetStatusOptions : regularStatusOptions
  
  // Currency options
  const currencyOptions = [
    { value: 'NGN', label: 'Nigerian Naira (₦)', symbol: '₦' },
    { value: 'USD', label: 'US Dollar ($)', symbol: '$' }
  ]
  
  // Get currency symbol for display
  const getCurrencySymbol = (currency) => {
    const currencyOption = currencyOptions.find(option => option.value === currency)
    return currencyOption ? currencyOption.symbol : '₦'
  }
  
  // Initialize form with property data if editing
  useEffect(() => {
    if (isEditing && property) {
      console.log('Initializing form with property data:', property);
      console.log('Interior features from property (raw):', property.interiorFeatures);
      console.log('Exterior features from property (raw):', property.exteriorFeatures);
      console.log('Interior features type:', typeof property.interiorFeatures);
      console.log('Interior features is array:', Array.isArray(property.interiorFeatures));
      console.log('Interior features stringified:', JSON.stringify(property.interiorFeatures));
      
      // Ensure interior and exterior features are arrays
      let interiorFeatures = [];
      let exteriorFeatures = [];
      
      // Handle different possible formats of interior features
      if (Array.isArray(property.interiorFeatures)) {
        interiorFeatures = [...property.interiorFeatures];
        console.log('Interior features is an array, copying directly');
      } else if (typeof property.interiorFeatures === 'string') {
        // Handle case where features might be a comma-separated string
        interiorFeatures = property.interiorFeatures.split(',').map(f => f.trim()).filter(f => f);
        console.log('Interior features is a string, split into array:', interiorFeatures);
      } else if (property.interiorFeatures && typeof property.interiorFeatures === 'object') {
        // Handle case where it might be an object with numeric keys (from JSON parsing)
        try {
          interiorFeatures = Object.values(property.interiorFeatures);
          console.log('Interior features is an object, converted to array:', interiorFeatures);
        } catch (error) {
          console.error('Error converting interior features object to array:', error);
        }
      }
      
      // Handle different possible formats of exterior features
      if (Array.isArray(property.exteriorFeatures)) {
        exteriorFeatures = [...property.exteriorFeatures];
        console.log('Exterior features is an array, copying directly');
      } else if (typeof property.exteriorFeatures === 'string') {
        // Handle case where features might be a comma-separated string
        exteriorFeatures = property.exteriorFeatures.split(',').map(f => f.trim()).filter(f => f);
        console.log('Exterior features is a string, split into array:', exteriorFeatures);
      } else if (property.exteriorFeatures && typeof property.exteriorFeatures === 'object') {
        // Handle case where it might be an object with numeric keys (from JSON parsing)
        try {
          exteriorFeatures = Object.values(property.exteriorFeatures);
          console.log('Exterior features is an object, converted to array:', exteriorFeatures);
        } catch (error) {
          console.error('Error converting exterior features object to array:', error);
        }
      }
      
      console.log('Processed interior features:', interiorFeatures);
      console.log('Processed exterior features:', exteriorFeatures);
      console.log('Processed interior features type:', typeof interiorFeatures);
      console.log('Processed interior features is array:', Array.isArray(interiorFeatures));
      console.log('Processed interior features stringified:', JSON.stringify(interiorFeatures));
      
      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price || '',
        currency: property.currency || 'NGN',
        location: property.location || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        squareFootage: property.squareFootage || '',
        propertyType: property.propertyType || 'Apartment',
        status: property.status || 'For Sale',
        featured: property.featured || false,
        interiorFeatures: interiorFeatures,
        exteriorFeatures: exteriorFeatures,
        images: property.images || []
      })
      
      console.log('Form data initialized with:', {
        interiorFeatures,
        exteriorFeatures
      });
      
      // Set existing images as preview URLs
      setImagePreviewUrls(property.images || [])
    }
  }, [isEditing, property])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Create updated form data
    const updatedFormData = {
      ...formData,
      [name]: value
    }
    
    // Handle input for new features
    if (name === 'newInteriorFeature') {
      setNewInteriorFeature(value)
      return
    } else if (name === 'newExteriorFeature') {
      setNewExteriorFeature(value)
      return
    }
    
    // If property type is changing, we may need to update the status
    if (name === 'propertyType') {
      // If changing to Short Let, set status to 'Available' (default for Short Let)
      if (value === 'Short Let') {
        updatedFormData.status = 'Available'
      } 
      // If changing from Short Let to another type, set status to 'For Sale' (default for regular properties)
      else if (formData.propertyType === 'Short Let') {
        updatedFormData.status = 'For Sale'
      }
    }
    
    setFormData(updatedFormData)
  }
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked
    })
  }
  
  const handleImageChange = (e) => {
    e.preventDefault()
    
    const files = Array.from(e.target.files)
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      
      if (!isValidType) {
        setError('Only JPEG, PNG, and WebP images are allowed')
      } else if (!isValidSize) {
        setError('Images must be less than 5MB')
      }
      
      return isValidType && isValidSize
    })
    
    if (validFiles.length === 0) return
    
    setImageFiles(prevFiles => [...prevFiles, ...validFiles])
    
    // Create preview URLs for the images
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviewUrls(prevUrls => [...prevUrls, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }
  
  const removeImage = (index) => {
    // If it's an existing image (from the server)
    if (index < formData.images.length) {
      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== index)
      })
    }
    
    // Remove from preview URLs
    setImagePreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index))
    
    // Remove from image files if it's a new upload
    if (index >= formData.images.length) {
      const adjustedIndex = index - formData.images.length
      setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== adjustedIndex))
    }
  }
  
  const uploadImages = async () => {
    if (imageFiles.length === 0) return []
    
    const formData = new FormData()
    imageFiles.forEach(file => {
      formData.append('images', file)
    })
    
    try {
      // Create a FormData object for the file upload
      const uploadOptions = {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for multipart/form-data
        headers: {}
      };
      
      // Get the current session data
      const sessionResponse = await fetch('/api/auth/session');
      const sessionData = await sessionResponse.json();
      
      // Add session data to headers
      uploadOptions.headers['X-Session-Data'] = JSON.stringify({
        role: sessionData?.user?.role || '',
        email: sessionData?.user?.email || '',
        name: sessionData?.user?.name || ''
      });
      
      // Make the authenticated request
      const response = await fetch('/api/upload', {
        ...uploadOptions,
        credentials: 'include' // Include credentials for cross-origin requests
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload images')
      }
      
      const data = await response.json()
      return data.images.map(image => image.url)
    } catch (error) {
      console.error('Error uploading images:', error)
      throw error
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Validate form data
      const requiredFields = [
        'title', 'description', 'price', 'location', 
        'bedrooms', 'bathrooms', 'squareFootage', 
        'propertyType', 'status'
      ]
      
      const missingFields = requiredFields.filter(field => !formData[field])
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      }
      
      // Make sure there's at least one image
      if (imagePreviewUrls.length === 0) {
        throw new Error('Please add at least one image')
      }
      
      // Upload new images if any
      let uploadedImageUrls = []
      if (imageFiles.length > 0) {
        setUploadProgress(10)
        uploadedImageUrls = await uploadImages()
        setUploadProgress(70)
      }
      
      // Combine existing and new image URLs
      const allImageUrls = [...formData.images, ...uploadedImageUrls]
      
      // Log interior and exterior features before submission
      console.log('Interior features before submission:', formData.interiorFeatures)
      console.log('Exterior features before submission:', formData.exteriorFeatures)
      
      // Prepare data for API
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        squareFootage: parseInt(formData.squareFootage),
        interiorFeatures: formData.interiorFeatures,
        exteriorFeatures: formData.exteriorFeatures,
        images: allImageUrls
      }
      
      console.log('Sending property data to API:', propertyData);
      console.log('Interior features in API request:', propertyData.interiorFeatures);
      console.log('Exterior features in API request:', propertyData.exteriorFeatures);
      
      // Create or update property
      const url = isEditing 
        ? `/api/properties/${property._id}` 
        : '/api/properties'
      
      const method = isEditing ? 'PUT' : 'POST'
      
      setUploadProgress(80)
      
      // Use the authenticatedFetch utility for the API request
      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(propertyData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save property')
      }
      
      setUploadProgress(100)
      
      // Redirect to properties list
      router.push('/admin/properties')
      router.refresh()
    } catch (err) {
      console.error('Error saving property:', err)
      setError(err.message)
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }
  
  // Functions to handle adding and removing features
  const addInteriorFeature = () => {
    if (newInteriorFeature.trim() === '') return
    
    setFormData({
      ...formData,
      interiorFeatures: [...formData.interiorFeatures, newInteriorFeature.trim()]
    })
    setNewInteriorFeature('')
  }
  
  const removeInteriorFeature = (index) => {
    setFormData({
      ...formData,
      interiorFeatures: formData.interiorFeatures.filter((_, i) => i !== index)
    })
  }
  
  const addExteriorFeature = () => {
    if (newExteriorFeature.trim() === '') return
    
    setFormData({
      ...formData,
      exteriorFeatures: [...formData.exteriorFeatures, newExteriorFeature.trim()]
    })
    setNewExteriorFeature('')
  }
  
  const removeExteriorFeature = (index) => {
    setFormData({
      ...formData,
      exteriorFeatures: formData.exteriorFeatures.filter((_, i) => i !== index)
    })
  }
  
  // Handle key press for adding features
  const handleKeyPress = (e, featureType) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (featureType === 'interior') {
        addInteriorFeature()
      } else if (featureType === 'exterior') {
        addExteriorFeature()
      }
    }
  }
  
  // Property types and status options are defined at the top of the component
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {isEditing ? 'Edit Property' : 'Add New Property'}
          </h3>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Title */}
            <div className="sm:col-span-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full text-base py-2 px-3 border-gray-300 rounded-md"
                  placeholder="Enter property title"
                  required
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full text-base py-2 px-3 border-gray-300 rounded-md"
                  placeholder="Enter detailed property description"
                  required
                />
              </div>
            </div>
            
            {/* Currency Selection */}
            <div className="sm:col-span-2">
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Currency *
              </label>
              <div className="mt-2">
                <select
                  name="currency"
                  id="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full text-base py-2 px-3 border-gray-300 rounded-md"
                  required
                >
                  {currencyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price ({getCurrencySymbol(formData.currency)}) *
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500">{getCurrencySymbol(formData.currency)}</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full text-base py-2 pl-8 pr-3 border-gray-300 rounded-md"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            {/* Location */}
            <div className="sm:col-span-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full text-base py-2 px-3 border-gray-300 rounded-md"
                  placeholder="Enter property location"
                  required
                />
              </div>
            </div>
            
            {/* Bedrooms */}
            <div className="sm:col-span-2">
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                Bedrooms *
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="bedrooms"
                  id="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full text-base py-2 px-3 border-gray-300 rounded-md"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            {/* Bathrooms */}
            <div className="sm:col-span-2">
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                Bathrooms *
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="bathrooms"
                  id="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full text-base py-2 px-3 border-gray-300 rounded-md"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            {/* Square Footage */}
            <div className="sm:col-span-2">
              <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700">
                Square Footage (sqft) *
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="squareFootage"
                  id="squareFootage"
                  value={formData.squareFootage}
                  onChange={handleChange}
                  min="0"
                  className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full text-base py-2 px-3 border-gray-300 rounded-md"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            {/* Property Type */}
            <div className="sm:col-span-3">
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                Property Type *
              </label>
              <div className="mt-2">
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full text-base py-2 px-3 border-gray-300 rounded-md"
                  required
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Status */}
            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status *
              </label>
              <div className="mt-2">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full text-base py-2 px-3 border-gray-300 rounded-md"
                  required
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Featured */}
            <div className="sm:col-span-6">
              <div className="flex items-start">
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="featured" className="font-medium text-gray-700">
                    Featured Property
                  </label>
                  <p className="text-gray-500">
                    Featured properties will be highlighted on the homepage
                  </p>
                </div>
              </div>
            </div>
            
            {/* Interior Features */}
            <div className="sm:col-span-3">
              <label htmlFor="newInteriorFeature" className="block text-sm font-medium text-gray-700">
                Interior Features
              </label>
              <div className="mt-2">
                <div className="flex">
                  <input
                    type="text"
                    id="newInteriorFeature"
                    name="newInteriorFeature"
                    value={newInteriorFeature}
                    onChange={handleChange}
                    onKeyPress={(e) => handleKeyPress(e, 'interior')}
                    className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full text-base py-2 px-3 border-gray-300 rounded-l-md"
                    placeholder="E.g., Modern kitchen"
                  />
                  <button
                    type="button"
                    onClick={addInteriorFeature}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.interiorFeatures.map((feature, index) => (
                    <div key={index} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeInteriorFeature(index)}
                        className="ml-2 inline-flex text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Remove</span>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">Add features one by one</p>
            </div>
            
            {/* Exterior Features */}
            <div className="sm:col-span-3">
              <label htmlFor="newExteriorFeature" className="block text-sm font-medium text-gray-700">
                Exterior Features
              </label>
              <div className="mt-2">
                <div className="flex">
                  <input
                    type="text"
                    id="newExteriorFeature"
                    name="newExteriorFeature"
                    value={newExteriorFeature}
                    onChange={handleChange}
                    onKeyPress={(e) => handleKeyPress(e, 'exterior')}
                    className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full text-base py-2 px-3 border-gray-300 rounded-l-md"
                    placeholder="E.g., Swimming pool"
                  />
                  <button
                    type="button"
                    onClick={addExteriorFeature}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.exteriorFeatures.map((feature, index) => (
                    <div key={index} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeExteriorFeature(index)}
                        className="ml-2 inline-flex text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Remove</span>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">Add features one by one</p>
            </div>
            
            {/* Images */}
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Property Images *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary"
                    >
                      <span>Upload images</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </div>
              </div>
              
              {/* Image previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <div className="group aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden">
                        <Image
                          src={url}
                          alt={`Property image ${index + 1}`}
                          width={200}
                          height={200}
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add more images button */}
                  <div className="relative">
                    <label
                      htmlFor="add-more-images"
                      className="flex items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <div className="space-y-1 text-center p-4">
                        <Plus className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="text-sm text-gray-500">Add more</div>
                      </div>
                      <input
                        id="add-more-images"
                        name="images"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="px-6 py-4 bg-gray-50 text-right sm:px-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEditing ? 'Update Property' : 'Create Property'}</>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
