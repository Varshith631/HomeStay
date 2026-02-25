import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { User, Mail, Lock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Tourist');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { addUser, users } = useData();

    const handleSignup = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            setIsLoading(false);

            if (users.find(u => u.email === email)) {
                alert("Email already exists!");
                return;
            }

            const newUser = {
                id: `USR-${Date.now()}`,
                name,
                email,
                password,
                role,
                status: 'Pending'
            };

            addUser(newUser);
            setSuccess(true);
        }, 1200);
    };

    if (success) {
        return (
            <PageTransition>
                <div style={{ display: 'flex', width: '100%', minHeight: '80vh', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel" style={{ padding: '50px', textAlign: 'center', maxWidth: '400px' }}
                    >
                        <CheckCircle2 size={60} color="#00ffcc" style={{ marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Registration Complete</h2>
                        <p style={{ color: '#aaa', marginBottom: '30px' }}>Your account has been created and is awaiting Admin approval. You will be able to log in once your node is verified.</p>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <button style={{ padding: '15px 30px', background: 'linear-gradient(90deg, #00f0ff, #7000ff)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                Return to Login
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div style={{ display: 'flex', width: '100%', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>

                {/* Animated Background Elements */}
                <motion.div
                    animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                    style={{ position: 'absolute', width: '800px', height: '800px', border: '1px solid rgba(0, 240, 255, 0.1)', borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }}
                />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(112,0,255,0.05) 0%, rgba(0,0,0,0) 70%)', zIndex: -2, pointerEvents: 'none', filter: 'blur(40px)' }} />

                <motion.div
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
                    className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '50px 40px', position: 'relative', overflow: 'hidden' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                            style={{ width: '60px', height: '60px', background: 'rgba(112, 0, 255, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(112, 0, 255, 0.3)' }}
                        >
                            <ShieldCheck size={32} color="#7000ff" />
                        </motion.div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>Join Nexus</h2>
                        <p style={{ color: '#aaa' }}>Request an access node on the network</p>
                    </div>

                    <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }}><User size={20} /></div>
                            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#00f0ff'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }}><Mail size={20} /></div>
                            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#00f0ff'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }}><Lock size={20} /></div>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#00f0ff'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ color: '#aaa', fontSize: '0.9rem', marginLeft: '5px' }}>Requested Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ ...inputStyle, paddingLeft: '16px', appearance: 'none', cursor: 'pointer' }}>
                                <option value="Tourist">Tourist (Explorer)</option>
                                <option value="Host">Host (Property Manager)</option>
                                <option value="Guide">Guide (Local Expert)</option>
                            </select>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isLoading}
                            style={{ width: '100%', padding: '18px', background: 'linear-gradient(90deg, #7000ff, #00f0ff)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '1.1rem', fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}
                        >
                            {isLoading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%' }} />
                            ) : (
                                <>Submit Request <ArrowRight size={20} /></>
                            )}
                        </motion.button>
                    </form>

                    <div style={{ marginTop: '25px', textAlign: 'center' }}>
                        <p style={{ color: '#aaa' }}>Already have a node? <Link to="/login" className="text-gradient" style={{ textDecoration: 'none', fontWeight: 600 }}>Log In</Link></p>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}

const inputStyle = {
    width: '100%', padding: '16px 16px 16px 45px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border 0.3s'
};
