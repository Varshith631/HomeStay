import React, { createContext, useContext, useState, useEffect } from 'react';
import initialHomestays from '../data/homestays.json';
import initialAttractions from '../data/attractions.json';
import initialBookings from '../data/bookings.json';
import initialEmails from '../data/emails.json';
import initialUsers from '../data/users.json'; // Add users mock loading

const DataContext = createContext();

export function DataProvider({ children }) {
    const loadData = (key, initial) => {
        const saved = localStorage.getItem(`nexus_data_${key}`);
        return saved ? JSON.parse(saved) : initial;
    };

    const [homestays, setHomestays] = useState(() => loadData('homestays', initialHomestays));

    const normalizedInitialAttractions = initialAttractions.map(attr => ({
        ...attr,
        status: attr.status || 'Approved'
    }));
    const [attractions, setAttractions] = useState(() => loadData('attractions', normalizedInitialAttractions));

    const [bookings, setBookings] = useState(() => loadData('bookings', initialBookings));
    const [emails, setEmails] = useState(() => loadData('emails', initialEmails));

    // Handle User Data
    const normalizedInitialUsers = initialUsers.map(user => ({
        ...user,
        status: user.status || 'Approved'
    }));
    const [users, setUsers] = useState(() => loadData('users', normalizedInitialUsers));

    useEffect(() => { localStorage.setItem('nexus_data_homestays', JSON.stringify(homestays)); }, [homestays]);
    useEffect(() => { localStorage.setItem('nexus_data_attractions', JSON.stringify(attractions)); }, [attractions]);
    useEffect(() => { localStorage.setItem('nexus_data_bookings', JSON.stringify(bookings)); }, [bookings]);
    useEffect(() => { localStorage.setItem('nexus_data_emails', JSON.stringify(emails)); }, [emails]);
    useEffect(() => { localStorage.setItem('nexus_data_users', JSON.stringify(users)); }, [users]); // save users

    const updateBookingStatus = (bookingId, newStatus) => {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    };
    const addBooking = (newBooking) => setBookings(prev => [...prev, newBooking]);
    const addAttraction = (newAttraction) => setAttractions(prev => [...prev, newAttraction]);
    const updateAttractionStatus = (attractionId, newStatus) => {
        setAttractions(prev => prev.map(a => a.id === attractionId ? { ...a, status: newStatus } : a));
    };

    // User Actions
    const addUser = (newUser) => setUsers(prev => [...prev, newUser]);
    const updateUserStatus = (userId, newStatus) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    };

    return (
        <DataContext.Provider value={{
            homestays,
            attractions, setAttractions, addAttraction, updateAttractionStatus,
            bookings, setBookings, updateBookingStatus, addBooking,
            emails, setEmails,
            users, addUser, updateUserStatus
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}
