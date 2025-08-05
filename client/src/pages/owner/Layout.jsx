import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const { isOwner, navigate, authLoading, token } = useAppContext()

  useEffect(() => {
    // Only redirect if auth is not loading and there's no token or user is not an owner
    if (!authLoading && (!token || !isOwner)) {
      navigate('/')
    }
  }, [isOwner, authLoading, token, navigate])

  // Show loading while authentication is being verified
  if (authLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    )
  }

  // If not loading and not an owner, don't render the layout (redirect will happen)
  if (!authLoading && !isOwner) {
    return null
  }

  return (
    <div className='flex flex-col'>
      <NavbarOwner />
      <div className='flex'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
