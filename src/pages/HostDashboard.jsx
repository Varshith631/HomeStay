import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { Home, Calendar, Users, BarChart3, Check, X, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HostDashboard() {
    const { authFetch } = useAuth();
    
    // Real Data States
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const [actingOn, setActingOn] = useState(null); // ID of booking currently being managed
    
    // Add Property Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProperty, setNewProperty] = useState({ name: '', location: '', price: '', image: '', rating: 5.0 });

    const fetchHostData = async () => {
        try {
            // Fetch Native DB Properties
            const propsRes = await authFetch('/api/listings/me');
            if (propsRes.ok) {
                setProperties(await propsRes.json());
            }

            // Fetch Native DB Bookings
            const bookingsRes = await authFetch('/api/bookings/host');
            if (bookingsRes.ok) {
                const bData = await bookingsRes.json();
                setBookings(bData);
                
                // Real Revenue Math
                const rev = bData.filter(b => b.status === "CONFIRMED").reduce((sum, b) => sum + b.totalPrice, 0);
                setTotalRevenue(rev);
            }
        } catch (error) {
            console.error("Failed to fetch host data:", error);
        }
    };

    useEffect(() => {
        fetchHostData();
    }, [authFetch]);

    const handleStatusChange = async (id, newStatus) => {
        setActingOn(id);
        try {
            const res = await authFetch(`/api/bookings/${id}/status?status=${newStatus}`, { method: 'PUT' });
            if (res.ok) {
                setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
            } else {
                alert("Server failed to update status");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setActingOn(null);
        }
    };

    const handleAddProperty = async (e) => {
        e.preventDefault();
        
        try {
            // Push actual data to Spring Boot MySQL database via auth proxy
            const res = await authFetch('/api/listings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newProperty.name,
                    location: newProperty.location,
                    pricePerNight: parseFloat(newProperty.price),
                    imageUrl: newProperty.image,
                    description: "Premium property manually listed by Host"
                })
            });

            if (res.ok) {
                setIsAddModalOpen(false);
                setNewProperty({ name: '', location: '', price: '', image: '', rating: 5.0 });
                fetchHostData(); // Refresh DB
                alert("Successfully saved to Database!");
            } else {
                alert("Server rejected the new property!");
            }
        } catch(error) {
            alert("Database connection failed");
        }
    };

    return (
        <PageTransition>
            <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '3.5rem', margin: 0 }}>Host <span className="text-gradient">Command Center</span></h1>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAddModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(90deg, #00f0ff, #7000ff)', border: 'none', color: '#fff', padding: '15px 25px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 10px 25px rgba(0, 240, 255, 0.3)' }}
                    >
                        <Plus size={22} /> Upload Property
                    </motion.button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '50px' }}>
                    {[
                        { label: 'Properties', value: properties.length.toString(), icon: <Home size={28} color="#00f0ff" /> },
                        { label: 'Total Bookings', value: bookings.length.toString(), icon: <Calendar size={28} color="#7000ff" /> },
                        { label: 'Upcoming Guests', value: bookings.filter(b => b.status === "CONFIRMED").length.toString(), icon: <Users size={28} color="#ff00f0" /> },
                        { label: 'Revenue', value: `$${totalRevenue}`, icon: <BarChart3 size={28} color="#00ffcc" /> }
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-panel" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ padding: '18px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>{stat.icon}</div>
                            <div>
                                <p style={{ color: '#aaa', fontSize: '1.1rem', marginBottom: '5px' }}>{stat.label}</p>
                                <p style={{ fontSize: '2.2rem', fontWeight: 800 }}>{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <h2 style={{ fontSize: '2.2rem', marginBottom: '25px' }}>Reservation Management</h2>
                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <th style={{ padding: '25px', color: '#888', fontWeight: 600 }}>TICKET ID</th>
                                <th style={{ padding: '25px', color: '#888', fontWeight: 600 }}>GUEST</th>
                                <th style={{ padding: '25px', color: '#888', fontWeight: 600 }}>PROPERTY</th>
                                <th style={{ padding: '25px', color: '#888', fontWeight: 600 }}>TIMELINE</th>
                                <th style={{ padding: '25px', color: '#888', fontWeight: 600 }}>STATUS</th>
                                <th style={{ padding: '25px', color: '#888', fontWeight: 600 }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {bookings.map((b, i) => (
                                    <motion.tr
                                        key={b.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: actingOn === b.id ? 'rgba(0,240,255,0.05)' : 'transparent' }}
                                    >
                                        <td style={{ padding: '25px', fontFamily: 'monospace', color: '#aaa' }}>#{b.id}</td>
                                        <td style={{ padding: '25px', fontWeight: 600, fontSize: '1.1rem' }}>{b.touristName}</td>
                                        <td style={{ padding: '25px' }}>{b.listingTitle}</td>
                                        <td style={{ padding: '25px', color: '#ccc' }}>{b.checkInDate} to {b.checkOutDate}</td>
                                        <td style={{ padding: '25px' }}>
                                            <motion.span
                                                layout
                                                style={{
                                                    padding: '8px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 600,
                                                    background: b.status === 'CONFIRMED' ? 'rgba(0,255,204,0.1)' : b.status === 'REJECTED' ? 'rgba(255,51,102,0.1)' : 'rgba(255,153,0,0.1)',
                                                    color: b.status === 'CONFIRMED' ? '#00ffcc' : b.status === 'REJECTED' ? '#ff3366' : '#ff9900'
                                                }}>
                                                {b.status}
                                            </motion.span>
                                        </td>
                                        <td style={{ padding: '25px' }}>
                                            {actingOn === b.id ? (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleStatusChange(b.id, 'CONFIRMED')} style={{ background: 'rgba(0,255,204,0.1)', border: '1px solid #00ffcc', color: '#00ffcc', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><Check size={18} /></motion.button>
                                                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleStatusChange(b.id, 'REJECTED')} style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid #ff3366', color: '#ff3366', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><X size={18} /></motion.button>
                                                    <button onClick={() => setActingOn(null)} style={{ background: 'transparent', border: '1px solid #444', color: '#888', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setActingOn(b.id)}
                                                    style={{ background: 'transparent', border: '1px solid #00f0ff', color: '#00f0ff', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                                                >
                                                    Manage
                                                </button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                                {bookings.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#777', fontSize: '1.1rem' }}>No reservation history. Your pipeline is empty.</td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Property Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 30 }} 
                            animate={{ scale: 1, y: 0 }} 
                            exit={{ scale: 0.9, y: 30 }} 
                            className="glass-panel" 
                            style={{ width: '500px', padding: '40px', position: 'relative' }}
                        >
                            <button onClick={() => setIsAddModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
                            
                            <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>New <span className="text-gradient">Property</span></h2>
                            
                            <form onSubmit={handleAddProperty} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#aaa', marginBottom: '8px' }}>Property Name</label>
                                    <input required value={newProperty.name} onChange={e => setNewProperty({...newProperty, name: e.target.value})} type="text" placeholder="e.g. Neon Horizon Villa" style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', color: '#aaa', marginBottom: '8px' }}>Location</label>
                                        <input required value={newProperty.location} onChange={e => setNewProperty({...newProperty, location: e.target.value})} type="text" placeholder="City, Sector" style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', boxSizing: 'border-box' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', color: '#aaa', marginBottom: '8px' }}>Nightly Price ($)</label>
                                        <input required value={newProperty.price} onChange={e => setNewProperty({...newProperty, price: e.target.value})} type="number" placeholder="150" style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', boxSizing: 'border-box' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#aaa', marginBottom: '8px' }}>Image URL</label>
                                    <input required value={newProperty.image} onChange={e => setNewProperty({...newProperty, image: e.target.value})} type="url" placeholder="https://example.com/image.jpg" style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', boxSizing: 'border-box' }} />
                                </div>
                                
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={{ marginTop: '10px', background: '#00f0ff', color: '#000', padding: '15px', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer' }}>
                                    Publish Property
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
}
