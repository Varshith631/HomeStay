import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate network delay for feel
        setTimeout(() => {
            const result = login(email, password);
            setIsLoading(false);

            if (result.success) {
                // Redirect based on role
                const role = result.user.role.toLowerCase();
                if (role === 'admin') navigate('/admin');
                else if (role === 'host') navigate('/host');
                else if (role === 'guide') navigate('/guide');
                else navigate('/tourist');
            } else {
                setError(result.message);
            }
        }, 1200);
    };

    return (
        <PageTransition>
            <div style={{ display: 'flex', width: '100%', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>

                {/* Animated Background Elements */}
                <motion.div
                    animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                    style={{ position: 'absolute', width: '800px', height: '800px', border: '1px solid rgba(0, 240, 255, 0.1)', borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }}
                />
                <motion.div
                    animate={{ rotate: -360 }} transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
                    style={{ position: 'absolute', width: '1200px', height: '1200px', border: '1px dashed rgba(112, 0, 255, 0.1)', borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }}
                />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(0,240,255,0.05) 0%, rgba(0,0,0,0) 70%)', zIndex: -2, pointerEvents: 'none', filter: 'blur(40px)' }} />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="glass-panel"
                    style={{ width: '100%', maxWidth: '480px', padding: '50px 40px', position: 'relative', overflow: 'hidden' }}
                >
                    {/* Edge highlight line */}
                    <motion.div
                        initial={{ left: '-100%' }} animate={{ left: '100%' }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{ position: 'absolute', top: 0, width: '50%', height: '2px', background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)', zIndex: 10 }}
                    />

                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                            style={{ width: '60px', height: '60px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(0, 240, 255, 0.3)' }}
                        >
                            <ShieldCheck size={32} color="#00f0ff" />
                        </motion.div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>System Access</h2>
                        <p style={{ color: '#aaa' }}>Authenticate to access your dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }}>
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '16px 16px 16px 45px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border 0.3s' }}
                                onFocus={(e) => e.target.style.borderColor = '#00f0ff'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }}>
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '16px 16px 16px 45px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border 0.3s' }}
                                onFocus={(e) => e.target.style.borderColor = '#00f0ff'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ color: '#ff3366', fontSize: '0.9rem', textAlign: 'center', padding: '10px', background: 'rgba(255,51,102,0.1)', borderRadius: '8px' }}>
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            style={{ width: '100%', padding: '18px', background: 'linear-gradient(90deg, #00f0ff, #7000ff)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '1.1rem', fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', position: 'relative', overflow: 'hidden' }}
                        >
                            {isLoading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%' }} />
                            ) : (
                                <>Log In <ArrowRight size={20} /></>
                            )}
                        </motion.button>
                    </form>

                    <div style={{ marginTop: '25px', textAlign: 'center' }}>
                        <p style={{ color: '#aaa' }}>Don't have a node yet? <Link to="/signup" className="text-gradient" style={{ textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link></p>
                    </div>

                    <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
                        <p>Mock Credentials:</p>
                        <p style={{ marginTop: '5px' }}>Tourist: tourist@nexus.com / Host: host@nexus.com</p>
                        <p>Guide: guide@nexus.com / Admin: admin@nexus.com</p>
                        <p>Password (All): password123</p>
                    </div>

                </motion.div>
            </div>
        </PageTransition>
    );
}
