'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import PropertyForm from '../components/PropertyForm'

export default function NewPropertyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect if not a manager
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'manager') {
      router.push('/admin/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  if (status === 'authenticated' && session?.user?.role === 'manager') {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new property listing with all details and images.
          </p>
        </div>
        
        <PropertyForm />
      </div>
    )
  }

  return null
}
