import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { Home, Calendar, Users, BarChart3, Check, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function HostDashboard() {
    const { bookings, updateBookingStatus, homestays } = useData();
    const [actingOn, setActingOn] = useState(null); // ID of booking currently being managed

    const handleStatusChange = (id, newStatus) => {
        updateBookingStatus(id, newStatus);
        setActingOn(null);
    };

    return (
        <PageTransition>
            <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '40px' }}>Host <span className="text-gradient">Command Center</span></h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '50px' }}>
                    {[
                        { label: 'Properties', value: homestays.length, icon: <Home size={28} color="#00f0ff" /> },
                        { label: 'Total Bookings', value: bookings.length, icon: <Calendar size={28} color="#7000ff" /> },
                        { label: 'Upcoming Guests', value: bookings.filter(b => b.status === 'Confirmed').length, icon: <Users size={28} color="#ff00f0" /> },
                        { label: 'Revenue', value: '$12,450', icon: <BarChart3 size={28} color="#00ffcc" /> }
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
                                        <td style={{ padding: '25px' }}>{homestays.find(h => h.id === b.homestayId)?.name || 'Unknown'}</td>
                                        <td style={{ padding: '25px', color: '#ccc' }}>{b.dates}</td>
                                        <td style={{ padding: '25px' }}>
                                            <motion.span
                                                layout
                                                style={{
                                                    padding: '8px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 600,
                                                    background: b.status === 'Confirmed' ? 'rgba(0,255,204,0.1)' : b.status === 'Rejected' ? 'rgba(255,51,102,0.1)' : 'rgba(255,153,0,0.1)',
                                                    color: b.status === 'Confirmed' ? '#00ffcc' : b.status === 'Rejected' ? '#ff3366' : '#ff9900'
                                                }}>
                                                {b.status}
                                            </motion.span>
                                        </td>
                                        <td style={{ padding: '25px' }}>
                                            {actingOn === b.id ? (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleStatusChange(b.id, 'Confirmed')} style={{ background: 'rgba(0,255,204,0.1)', border: '1px solid #00ffcc', color: '#00ffcc', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><Check size={18} /></motion.button>
                                                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleStatusChange(b.id, 'Rejected')} style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid #ff3366', color: '#ff3366', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><X size={18} /></motion.button>
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
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </PageTransition>
    );
}
