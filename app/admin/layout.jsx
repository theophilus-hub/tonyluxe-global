'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut, signIn } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AuthProvider } from './providers'
import { 
  LayoutDashboard, 
  Home, 
  Car, 
  LogOut, 
  Menu, 
  X,
  User,
  ChevronLeft,
  ChevronRight,
  LogIn
} from 'lucide-react'

function AdminLayoutContent({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Special case for login page - don't redirect or check authentication
  const isLoginPage = pathname === '/admin/login'
  
  // Check if user is authenticated (but not on login page)
  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login')
    }
  }, [status, router, isLoginPage])

  // If on login page, just render the children without authentication check
  if (isLoginPage) {
    return children
  }
  
  // If still loading, show loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  // If not authenticated and not on login page, don't render anything (will redirect)
  if (status === 'unauthenticated') {
    return null
  }

  const isAdmin = session?.user?.role === 'admin'
  const isManager = session?.user?.role === 'manager'

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, show: status === 'authenticated' },
    { name: 'Properties', href: '/admin/properties', icon: Home, show: isManager },
    { name: 'Cars', href: '/admin/cars', icon: Car, show: isManager },
  ]

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity z-20 lg:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out z-30
        ${sidebarOpen ? 'w-64' : 'w-20'}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b bg-white">
          <div className={`flex items-center ${sidebarOpen ? 'justify-between w-full' : 'justify-center'}`}>
            {sidebarOpen && (
              <div className="flex-1 flex justify-start">
                <Image
                  src="/tony.png"
                  alt="TonyLuxe Logo"
                  width={150}
                  height={50}
                  className="object-contain h-10"
                  priority
                />
              </div>
            )}
            <button 
              onClick={toggleSidebar} 
              className="p-1 rounded-full bg-brand-primary text-white hover:bg-brand-primary-dark transition-colors"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 px-2 space-y-1">
            {navigation.filter(item => item.show).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${pathname === item.href
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  ${!sidebarOpen && 'justify-center'}
                `}
                title={!sidebarOpen ? item.name : ''}
              >
                <item.icon
                  className={`
                    ${sidebarOpen ? 'mr-3' : ''} flex-shrink-0 h-6 w-6
                    ${pathname === item.href
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                />
                {sidebarOpen && item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          {status === 'authenticated' ? (
            <div className={`flex ${!sidebarOpen && 'justify-center'}`}>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors
                  ${!sidebarOpen && 'justify-center w-full p-2'}
                `}
                title={!sidebarOpen ? 'Sign out' : ''}
              >
                <LogOut size={18} className={sidebarOpen ? 'mr-2' : ''} />
                {sidebarOpen && 'Sign out'}
              </button>
            </div>
          ) : (
            <div className={`flex ${!sidebarOpen && 'justify-center'}`}>
              <button
                onClick={() => signIn()}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors
                  ${!sidebarOpen && 'justify-center w-full p-2'}
                `}
                title={!sidebarOpen ? 'Sign in' : ''}
              >
                <LogIn size={18} className={sidebarOpen ? 'mr-2' : ''} />
                {sidebarOpen && 'Sign in'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="sticky top-0 z-10 flex h-16 bg-white shadow lg:hidden">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu size={24} />
          </button>
          
          <div className="flex-1 px-4 flex items-center justify-center">
            <Image
              src="/tony.png"
              alt="TonyLuxe Logo"
              width={150}
              height={50}
              className="object-contain h-10"
              priority
            />
          </div>
        </div>

        <main className="flex-1 pb-8">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  )
}
