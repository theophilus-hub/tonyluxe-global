'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Home, 
  Car, 
  DollarSign, 
  Tag, 
  CheckCircle, 
  Clock,
  TrendingUp
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // No longer need debug info

  useEffect(() => {
    // Debug info removed
    
    const fetchStats = async () => {
      try {
        // First, get the current session to ensure we have fresh auth data
        const sessionResponse = await fetch('/api/auth/session')
        const sessionData = await sessionResponse.json()
        
        if (!sessionData || !sessionData.user) {
          throw new Error('Authentication required')
        }
        
        // Use the new direct stats API endpoint that uses multiple auth methods
        const response = await fetch('/api/stats-direct', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            // Include session data in a custom header as a backup authentication method
            'X-Session-Data': JSON.stringify({
              role: sessionData.user?.role,
              name: sessionData.user?.name
            })
          }
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication failed. Please try logging in again.')
          } else {
            throw new Error(`Failed to fetch statistics: ${response.status}`)
          }
        }
        
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Error fetching statistics:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // Both admin and manager can fetch stats now
    if (session?.user?.role === 'admin' || session?.user?.role === 'manager') {
      fetchStats()
    } else {
      setLoading(false)
    }
  }, [session])

  if (loading) {
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
              Error loading statistics: {error}
            </p>
            {/* Debug info removed */}
          </div>
        </div>
      </div>
    )
  }

  // Check if user is admin to show the full dashboard
  const isAdmin = session?.user?.role === 'admin';
  const isManager = session?.user?.role === 'manager';
  
  // Debug info display removed

  // Show simplified dashboard for manager role only
  if (isManager && !isAdmin) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        {/* Debug info removed */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome, {session?.user?.name || 'Manager'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center mb-4">
              <Home className="h-8 w-8 mr-3" />
              <h3 className="text-xl font-medium">Properties Management</h3>
            </div>
            <p className="mb-6">Manage property listings, add new properties, update details, and more.</p>
            <a href="/admin/properties" className="inline-block bg-white text-blue-600 font-medium px-4 py-2 rounded hover:bg-blue-50 transition-colors">
              Manage Properties
            </a>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center mb-4">
              <Car className="h-8 w-8 mr-3" />
              <h3 className="text-xl font-medium">Cars Management</h3>
            </div>
            <p className="mb-6">Manage car listings, add new vehicles, update details, and more.</p>
            <a href="/admin/cars" className="inline-block bg-white text-purple-600 font-medium px-4 py-2 rounded hover:bg-purple-50 transition-colors">
              Manage Cars
            </a>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Quick Tips</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Use the navigation menu on the left to quickly access different sections.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Upload high-quality images to make listings more attractive.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Keep property and car descriptions detailed and accurate.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Mark premium listings as "Featured" to highlight them on the website.</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }
  
  if (!stats) {
    return null
  }

  const { properties, cars, overall } = stats

  // Stat cards data
  const statCards = [
    {
      title: 'Total Listings',
      value: overall.totalListings,
      icon: Tag,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Value',
      value: `₦${overall.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Properties',
      value: properties.total,
      icon: Home,
      color: 'bg-purple-500',
    },
    {
      title: 'Cars',
      value: cars.total,
      icon: Car,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Debug info removed */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.title}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {card.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>



      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Property Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Home className="h-5 w-5 mr-2 text-brand-primary" />
              Property Statistics
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-gray-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                      <Tag className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">For Sale</div>
                      <div className="text-lg font-semibold">{properties.forSale}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">Rented</div>
                      <div className="text-lg font-semibold">{properties.rented}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                      <Tag className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">For Rent</div>
                      <div className="text-lg font-semibold">{properties.forRent}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-2">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">Sold</div>
                      <div className="text-lg font-semibold">{properties.sold}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">Short Let</div>
                      <div className="text-lg font-semibold">{properties.shortLet || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-pink-100 rounded-md p-2">
                      <TrendingUp className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">Featured</div>
                      <div className="text-lg font-semibold">{properties.featured}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500">Recent Properties</h4>
              <ul className="mt-3 divide-y divide-gray-100">
                {properties.recent && properties.recent.map((property, index) => (
                  <li key={index} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{property.title}</p>
                          <p className="text-sm text-gray-500">
                            ₦{property.price.toLocaleString()} · {property.status}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Car Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Car className="h-5 w-5 mr-2 text-brand-primary" />
              Car Statistics
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="bg-gray-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                      <Tag className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">For Sale</div>
                      <div className="text-lg font-semibold">{cars.forSale}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-2">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">Sold</div>
                      <div className="text-lg font-semibold">{cars.sold}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-2">
                      <TrendingUp className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">Featured</div>
                      <div className="text-lg font-semibold">{cars.featured}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">Total Value</div>
                      <div className="text-lg font-semibold">₦{cars.totalValue?.toLocaleString() || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500">Recent Cars</h4>
              <ul className="mt-3 divide-y divide-gray-100">
                {cars.recent && cars.recent.map((car, index) => (
                  <li key={index} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{car.title}</p>
                          <p className="text-sm text-gray-500">
                            ₦{car.price.toLocaleString()} · {car.status}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(car.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}