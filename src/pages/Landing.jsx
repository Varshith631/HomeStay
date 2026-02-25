import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { ArrowRight, Map, Home, Star, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
    const { currentUser } = useAuth();

    // Determine the action button destination based on auth role
    const getDestination = () => {
        if (!currentUser) return '/login';
        if (currentUser.role === 'Admin') return '/admin';
        if (currentUser.role === 'Host') return '/host';
        if (currentUser.role === 'Guide') return '/guide';
        return '/tourist';
    };

    return (
        <PageTransition>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }}
                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(112,0,255,0.15) 0%, rgba(0,0,0,0) 60%)', zIndex: -1, filter: 'blur(50px)' }}
                />

                <motion.h1
                    initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    style={{ fontSize: '5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px', maxWidth: '900px' }}
                >
                    Discover The Future of <span className="text-gradient">Exploration</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                    style={{ fontSize: '1.3rem', color: '#aaa', maxWidth: '700px', marginBottom: '50px' }}
                >
                    Connect with exclusive homestays and uncover hidden gems curated by local experts. The next generation of travel experiences begins here.
                </motion.p>

                <motion.div initial={{ y: 30, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
                    <Link to={getDestination()} style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 240, 255, 0.5)' }} whileTap={{ scale: 0.95 }}
                            style={{ padding: '18px 40px', fontSize: '1.2rem', fontWeight: 600, background: 'linear-gradient(90deg, #00f0ff, #7000ff)', border: 'none', borderRadius: '40px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}
                        >
                            {currentUser ? `Go to Dashboard` : `Start Exploring`} <ArrowRight size={24} />
                        </motion.button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px', width: '100%', maxWidth: '1100px', marginTop: '100px' }}
                >
                    {[
                        { icon: <Map size={36} color="#00f0ff" />, title: 'Local Guides' },
                        { icon: <Home size={36} color="#7000ff" />, title: 'Curated Stays' },
                        { icon: <Star size={36} color="#ff00f0" />, title: 'Personalized' },
                        { icon: <Shield size={36} color="#00ffcc" />, title: 'Secure Booking' }
                    ].map((feature, idx) => (
                        <div key={idx} className="glass-panel hover-glow" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                            {feature.icon}
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 600 }}>{feature.title}</h3>
                        </div>
                    ))}
                </motion.div>
            </div>
        </PageTransition>
    );
}
