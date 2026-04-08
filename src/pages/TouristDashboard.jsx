import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { Search, MapPin, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TouristDashboard() {
    const [homestays, setHomestays] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const { currentUser, authFetch } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch real listings using authenticated fetch
                const resListings = await authFetch('/api/listings/public');
                if (resListings.ok) {
                    const data = await resListings.json();
                    setHomestays(data);
                }

                // Fetch real recommendations (attractions) using authenticated fetch
                const resAttractions = await authFetch('/api/recommendations/public');
                if (resAttractions.ok) {
                    const data = await resAttractions.json();
                    setAttractions(data);
                }

                // Fetch my own bookings to see statuses
                const resBookings = await authFetch('/api/bookings/me');
                if (resBookings.ok) {
                    const bData = await resBookings.json();
                    setMyBookings(bData);
                }
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, [authFetch]);

    const handleBook = async (homestay) => {
        const payload = {
            listingId: homestay.id,
            checkInDate: '2026-05-01', // Example date
            checkOutDate: '2026-05-07', // Example date
            totalPrice: homestay.pricePerNight * 6
        };

        try {
            const res = await authFetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const newBooking = await res.json();
                setMyBookings(prev => [...prev, newBooking]); // Instantly push to state
            } else {
                alert("Failed to create booking");
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <PageTransition>
            <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '10px' }}>Explore <span className="text-gradient">Destinations</span></h1>
                <p style={{ color: '#aaa', fontSize: '1.2rem', marginBottom: '40px' }}>Discover extraordinary stays and immersive experiences.</p>

                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '15px', marginBottom: '60px' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', padding: '15px 25px', borderRadius: '16px', gap: '15px' }}>
                        <Search size={24} color="#00f0ff" />
                        <input type="text" placeholder="Where do you want to go?" style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1.2rem' }} />
                    </div>
                    <button style={{ padding: '0 40px', background: 'linear-gradient(90deg, #00f0ff, #7000ff)', border: 'none', borderRadius: '16px', color: 'white', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}>Search</button>
                </motion.div>

                <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}><Star color="#ff00f0" fill="#ff00f0" /> Featured Homestays</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px', marginBottom: '80px' }}>
                    {homestays.map((home, i) => (
                        <motion.div key={home.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="glass-panel hover-glow" style={{ padding: '25px', position: 'relative' }}>
                            <div style={{ height: '220px', background: '#111', backgroundImage: `url(${home.imageUrl || home.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '16px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', padding: '5px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                                    <Star size={14} color="#ff00f0" /> {home.rating}
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{home.title}</h3>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', marginBottom: '20px' }}><MapPin size={18} color="#00f0ff" /> {home.location}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                                <span className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: 800 }}>${home.pricePerNight}<span style={{ fontSize: '1rem', color: '#aaa', fontWeight: 400 }}>/night</span></span>
                                {(() => {
                                    const existing = myBookings.find(b => b.listingId === home.id);
                                    if (existing) {
                                        return (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: existing.status === 'CONFIRMED' ? '#00ffcc' : existing.status === 'REJECTED' ? '#ff3366' : '#ff9900', fontWeight: 600 }}>
                                                <CheckCircle2 size={20} /> {existing.status === 'CONFIRMED' ? 'Accepted' : existing.status === 'REJECTED' ? 'Rejected' : 'Requested'}
                                            </motion.div>
                                        );
                                    }
                                    return (
                                        <button
                                            onClick={() => handleBook(home)}
                                            style={{ background: 'white', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            Request Book
                                        </button>
                                    );
                                })()}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}><Sparkles color="#00f0ff" /> Local Attractions Insights</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px', paddingBottom: '40px' }}>
                    <AnimatePresence>
                        {attractions.map((attr, i) => (
                            <motion.div
                                key={attr.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel hover-glow"
                                style={{ padding: '30px', borderLeft: '4px solid #00f0ff' }}
                            >
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{attr.title}</h3>
                                <span style={{ display: 'inline-block', padding: '5px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '0.9rem', marginBottom: '20px' }}>{attr.location}</span>
                                <p style={{ color: '#aaa', marginBottom: '10px', fontSize: '0.9rem' }}>{attr.content}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </PageTransition>
    );
}
