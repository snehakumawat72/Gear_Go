import React, { useEffect, useState, useCallback } from 'react'
import { assets, dummyDashboardData } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const Dashboard = () => {

  const { axios, isOwner, currency, authLoading } = useAppContext()

  const [data, setData] = useState({
    totalCars: 0,
    totalGears: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })

  const [loading, setLoading] = useState(true)

  const dashboardCards = [
    {
      title: "Total Cars",
      value: data.totalCars,
      icon: assets.carIconColored,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100"
    },
    {
      title: "Total Gears",
      value: data.totalGears,
      icon: assets.gear_colored || assets.gear_icon,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100"
    },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100"
    },
    {
      title: "Pending",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100"
    },
    {
      title: "Confirmed",
      value: data.completedBookings,
      icon: assets.listIconColored,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-100"
    },
  ]

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/owner/dashboard')
      if (data.success) {
        setData(data.dashboardData)
        // console.log("Dashboard Data: ", data);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [axios])

  useEffect(() => {
    if (isOwner && !authLoading) {
      fetchDashboardData()
    }
  }, [isOwner, authLoading, fetchDashboardData])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className='px-4 pt-10 md:px-10 flex-1 bg-gray-50 min-h-screen'>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Title title="Owner Dashboard" subTitle="Monitor your rental business performance and manage your inventory" />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 my-8'
          variants={itemVariants}
        >
          {dashboardCards.map((card, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden rounded-xl ${card.bgColor} p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-white/50`}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 mb-1'>{card.title}</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {loading ? (
                      <span className="animate-pulse bg-gray-300 h-6 w-12 rounded"></span>
                    ) : (
                      card.value
                    )}
                  </p>
                </div>
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${card.iconBg}`}>
                  <img src={card.icon} alt="" className='h-6 w-6' />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`}></div>
            </motion.div>
          ))}
        </motion.div>

        <div className='grid lg:grid-cols-3 gap-8 mb-8'>
          {/* Recent Bookings */}
          <motion.div
            className='lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'
            variants={itemVariants}
          >
            <div className='p-6 bg-gradient-to-r from-primary to-primary-dull'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-xl font-semibold text-white'>Recent Bookings</h2>
                  <p className='text-white/80 mt-1'>Latest customer bookings and their status</p>
                </div>
                <div className='bg-white/20 p-3 rounded-lg'>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
            </div>

            <div className='p-6'>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4">
                      <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : data.recentBookings.length > 0 ? (
                <div className="space-y-4">

                  {data.recentBookings.map((booking, index) => {

                    const item = booking?.car || booking?.gear;
                    const isCar = Boolean(booking?.car);
                    const user = booking?.user || booking?.customer;
                    // console.log("user ", user);
                    // console.log("bookings " , booking);

                    if (!item) return null;

                    return (
                      <motion.div
                        key={index}
                        className='flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className='flex items-center gap-4'>
                          <div className='relative'>
                            <div className='w-12 h-12 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center'>
                              <img
                                src={item?.image || assets.user_profile}
                                alt=''
                                className='h-10 w-10 object-cover rounded-full'
                                onError={(e) => {
                                  e.target.src = assets.user_profile;
                                }}
                              />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isCar ? 'bg-blue-500' : 'bg-green-500'}`}>
                              {isCar ? (
                                <svg className="w-2 h-2 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                                </svg>
                              ) : (
                                <svg className="w-2 h-2 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {/* {console.log("item " , item)}
                              {isCar
                                ? `${user.name} ${item.model}`
                                : item.name || "Unnamed Gear"} */}
                            </p>
                                {booking.customerDetails.name}
                            <p className='text-sm text-gray-500'>
                              {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center gap-3'>
                          <div className="text-right">
                            <p className='font-semibold text-gray-900'>{currency}{booking.price}</p>
                            <p className="text-xs text-gray-500">{isCar ? 'Car Rental' : 'Gear Rental'}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No bookings yet</p>
                  <p className="text-sm text-gray-400 mt-1">Bookings will appear here once customers start renting your items</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Revenue Card */}
          <motion.div
            className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'
            variants={itemVariants}
          >
            <div className='p-6 bg-gradient-to-br from-emerald-500 to-emerald-600'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-xl font-semibold text-white'>Monthly Revenue</h2>
                  <p className='text-white/80 mt-1'>Current month earnings</p>
                </div>
                <div className='bg-white/20 p-3 rounded-lg'>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className='p-6'>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-300 rounded w-24 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <p className='text-4xl font-bold text-emerald-600 mb-2'>
                      {currency}{data.monthlyRevenue}
                    </p>
                    {/* <div className="flex items-center justify-center text-sm text-emerald-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                      <span>+12.5% from last month</span>
                    </div> */}
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Car Rentals</span>
                      <span className="text-sm font-medium">{currency}{Math.round(data.monthlyRevenue * 0.7)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Gear Rentals</span>
                      <span className="text-sm font-medium">{currency}{Math.round(data.monthlyRevenue * 0.3)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          {[
            {
              title: "Add New Car",
              description: "List a new vehicle for rent",
              link: "/owner/add-car",
              icon: "M12 4v16m8-8H4",
              color: "from-blue-500 to-blue-600"
            },
            {
              title: "Add New Gear",
              description: "Add camping or outdoor gear",
              link: "/owner/add-gear",
              icon: "M12 4v16m8-8H4",
              color: "from-green-500 to-green-600"
            },
            {
              title: "Manage Bookings",
              description: "View and handle reservations",
              link: "/owner/manage-bookings",
              icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              color: "from-purple-500 to-purple-600"
            },
            {
              title: "Manage Cars",
              description: "Track performance metrics",
              link: "/owner/manage-cars",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              color: "from-yellow-500 to-yellow-600"
            }
          ].map((action, index) => (
            <motion.a
              key={index}
              href={action.link}
              className={`block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard