import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AvailabilityCalendar = ({ carId, onDateSelect, selectedPickup, selectedReturn }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookedDates, setBookedDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredDate, setHoveredDate] = useState(null);

    const fetchBookedDates = useCallback(async () => {
        try {
            setLoading(true);
            const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
            
            console.log('Fetching availability for car:', carId);
            console.log('Date range:', startOfMonth.toISOString().split('T')[0], 'to', endOfMonth.toISOString().split('T')[0]);
            
            const { data } = await axios.get(`/api/bookings/availability/${carId}`, {
                params: {
                    startDate: startOfMonth.toISOString().split('T')[0],
                    endDate: endOfMonth.toISOString().split('T')[0]
                }
            });

            console.log('Availability response:', data);

            if (data.success) {
                setBookedDates(data.bookedDates || []);
            }
        } catch (error) {
            console.error('Error fetching booked dates:', error);
            setBookedDates([]);
        } finally {
            setLoading(false);
        }
    }, [carId, currentMonth]);

    useEffect(() => {
        if (carId) {
            fetchBookedDates();
        }
    }, [carId, fetchBookedDates]);    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const isDateBooked = (date) => {
        if (!date) return false;
        return bookedDates.some(bookedRange => {
            const start = new Date(bookedRange.startDate);
            const end = new Date(bookedRange.endDate);
            return date >= start && date <= end;
        });
    };

    const getBookingStatus = (date) => {
        if (!date) return null;
        const booking = bookedDates.find(bookedRange => {
            const start = new Date(bookedRange.startDate);
            const end = new Date(bookedRange.endDate);
            return date >= start && date <= end;
        });
        return booking?.status || null;
    };

    const isDatePast = (date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isDateSelected = (date) => {
        if (!date || !selectedPickup) return false;
        const dateStr = date.toISOString().split('T')[0];

        if (selectedReturn) {
            const pickup = new Date(selectedPickup);
            const returnDate = new Date(selectedReturn);
            return date >= pickup && date <= returnDate;
        }

        return dateStr === selectedPickup;
    };

    const isDateInRange = (date) => {
        if (!date || !selectedPickup || !hoveredDate) return false;
        if (selectedReturn) return false; // Don't show hover range if return date is already selected

        const pickup = new Date(selectedPickup);
        const hover = new Date(hoveredDate);

        const start = pickup < hover ? pickup : hover;
        const end = pickup < hover ? hover : pickup;

        return date > start && date < end;
    };

    const handleDateClick = (date) => {
        if (!date || isDatePast(date) || isDateBooked(date)) return;

        const dateStr = date.toISOString().split('T')[0];
        onDateSelect(dateStr);
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        const today = new Date();

        // Don't allow going to months before current month
        if (newMonth.getFullYear() > today.getFullYear() ||
            (newMonth.getFullYear() === today.getFullYear() && newMonth.getMonth() >= today.getMonth())) {
            setCurrentMonth(newMonth);
        }
    };

    const getDateStatus = (date) => {
        if (!date) return 'empty';
        if (isDatePast(date)) return 'past';
        if (isDateBooked(date)) {
            const bookingStatus = getBookingStatus(date);
            return bookingStatus === 'pending' ? 'pending' : 'booked';
        }
        if (isDateSelected(date)) return 'selected';
        if (isDateInRange(date)) return 'in-range';
        return 'available';
    };

    const getDateClasses = (status) => {
        const baseClasses = 'w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200';

        switch (status) {
            case 'empty':
                return baseClasses + ' invisible';
            case 'past':
                return baseClasses + ' text-gray-300 cursor-not-allowed';
            case 'booked':
                return baseClasses + ' bg-red-100 text-red-600 cursor-not-allowed relative';
            case 'pending':
                return baseClasses + ' bg-orange-100 text-orange-600 cursor-not-allowed relative';
            case 'selected':
                return baseClasses + ' bg-primary text-white font-medium cursor-pointer';
            case 'in-range':
                return baseClasses + ' bg-primary/20 text-primary cursor-pointer';
            case 'available':
                return baseClasses + ' hover:bg-gray-100 cursor-pointer text-gray-700';
            default:
                return baseClasses;
        }
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const days = getDaysInMonth(currentMonth);

    return (
        <motion.div
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Availability Calendar</h3>
                <div className="flex items-center">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={currentMonth.getMonth() === new Date().getMonth() &&
                            currentMonth.getFullYear() === new Date().getFullYear()}
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="min-w-[140px] text-center">
                        <span className="font-medium text-gray-800">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                    </div>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                    <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
                        {day}
                    </div>
                ))}

                {loading ? (
                    // Loading skeleton
                    Array.from({ length: 42 }, (_, i) => (
                        <div key={i} className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))
                ) : (
                    days.map((date, index) => {
                        const status = getDateStatus(date);
                        return (
                            <div
                                key={index}
                                className={getDateClasses(status)}
                                onClick={() => handleDateClick(date)}
                                onMouseEnter={() => setHoveredDate(date?.toISOString().split('T')[0])}
                                onMouseLeave={() => setHoveredDate(null)}
                            >
                                {date && (
                                    <>
                                        {date.getDate()}
                                        {status === 'booked' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                                            </div>
                                        )}
                                        {status === 'pending' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded"></div>
                        <span className="text-gray-600">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-100 rounded"></div>
                        <span className="text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-100 rounded relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                            </div>
                        </div>
                        <span className="text-gray-600">Pending</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-100 rounded relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            </div>
                        </div>
                        <span className="text-gray-600">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-200 rounded"></div>
                        <span className="text-gray-600">Past dates</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AvailabilityCalendar;
