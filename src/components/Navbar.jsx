import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{
            position: 'fixed', top: 0, width: '100%', zIndex: 100,
            padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(5,5,5,0.7)', backdropFilter: 'blur(15px)', borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Compass size={32} color="#00f0ff" />
                <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '2px' }} className="text-gradient">NEXUS</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <Link to="/" style={linkStyle(location.pathname === '/')}>Home</Link>

                {!currentUser && (
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)' }} whileTap={{ scale: 0.95 }}
                            style={{ padding: '8px 24px', background: 'transparent', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <User size={16} /> Sign In
                        </motion.button>
                    </Link>
                )}

                {currentUser && (
                    <>
                        {currentUser.role === 'Admin' && <Link to="/admin" style={linkStyle(location.pathname === '/admin')}>Admin Panel</Link>}
                        {currentUser.role === 'Host' && <Link to="/host" style={linkStyle(location.pathname === '/host')}>Host Portal</Link>}
                        {currentUser.role === 'Guide' && <Link to="/guide" style={linkStyle(location.pathname === '/guide')}>Guide Intel</Link>}
                        {currentUser.role === 'Tourist' && <Link to="/tourist" style={linkStyle(location.pathname === '/tourist')}>Explore</Link>}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '20px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(45deg, #00f0ff, #7000ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                                    {currentUser.name.charAt(0)}
                                </div>
                                <span style={{ fontSize: '0.9rem', color: '#aaa' }}>{currentUser.name}</span>
                            </div>

                            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ff3366', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}

function linkStyle(isActive) {
    return {
        textDecoration: 'none',
        color: isActive ? '#fff' : '#888',
        fontWeight: 600,
        fontSize: '1.1rem',
        transition: 'color 0.3s',
        borderBottom: isActive ? '2px solid #00f0ff' : '2px solid transparent',
        paddingBottom: '5px'
    };
}
