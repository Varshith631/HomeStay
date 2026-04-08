import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpStep, setOtpStep] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, verifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(email, password);
        setIsLoading(false);

        if (result.success) {
            if (result.otpRequired) {
                setOtpStep(true);
            } else {
                const role = result.user.role.toLowerCase();
                if (role === 'admin') navigate('/admin');
                else if (role === 'host') navigate('/host');
                else if (role === 'guide') navigate('/guide');
                else navigate('/tourist');
            }
        } else {
            setError(result.message);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await verifyOtp(email, otpCode);
        setIsLoading(false);

        if (result.success) {
            const role = result.user.role.toLowerCase();
            if (role === 'admin') navigate('/admin');
            else if (role === 'host') navigate('/host');
            else if (role === 'guide') navigate('/guide');
            else navigate('/tourist');
        } else {
            setError(result.message);
        }
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

                    {otpStep ? (
                        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div style={{ textAlign: 'center', color: '#00f0ff', marginBottom: '10px' }}>
                                A 6-digit confirmation code was sent to your email. (Check the terminal console)
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }}>
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '16px 16px 16px 45px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border 0.3s', textAlign: 'center', letterSpacing: '4px' }}
                                    onFocus={(e) => e.target.style.borderColor = '#00f0ff'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    maxLength={6}
                                />
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ color: '#ff3366', fontSize: '0.9rem', textAlign: 'center', padding: '10px', background: 'rgba(255,51,102,0.1)', borderRadius: '8px' }}>
                                    {error}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isLoading}
                                style={{ width: '100%', padding: '18px', background: 'linear-gradient(90deg, #00f0ff, #7000ff)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '1.1rem', fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                            >
                                {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%' }} /> : <>Verify & Access <ArrowRight size={20} /></>}
                            </motion.button>
                        </form>
                    ) : (
                        <>
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

                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>OR</span>
                            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                        </div>
                        
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL || ''}/oauth2/authorization/google`}
                            style={{ width: '100%', padding: '16px', background: 'white', border: 'none', borderRadius: '12px', color: '#333', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </motion.button>
                    </div>

                            <div style={{ marginTop: '25px', textAlign: 'center' }}>
                                <p style={{ color: '#aaa' }}>Don't have a node yet? <Link to="/signup" className="text-gradient" style={{ textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link></p>
                            </div>
                        </>
                    )}

                </motion.div>
            </div>
        </PageTransition>
    );
}
