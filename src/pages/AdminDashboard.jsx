import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { Shield, Activity, Users, Database, Check, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function AdminDashboard() {
    const { attractions, updateAttractionStatus, emails, users, updateUserStatus } = useData();

    // Use unique users derived from emails/mock data or hardcode for demo
    const mockSystemUsers = users.length;

    const pendingAttractions = attractions.filter(a => a.status === 'Pending');
    const pendingUsers = users.filter(u => u.status === 'Pending');

    return (
        <PageTransition>
            <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '40px' }}>Nexus <span className="text-gradient">Core System</span></h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '50px' }}>
                    {[
                        { label: 'Active Nodes', val: mockSystemUsers, icon: <Users size={28} color="#00f0ff" /> },
                        { label: 'Network Health', val: '99.9%', icon: <Activity size={28} color="#00ffcc" /> },
                        { label: 'Security Layer', val: 'Level 5', icon: <Shield size={28} color="#7000ff" /> },
                        { label: 'Data Packets', val: attractions.length + emails.length, icon: <Database size={28} color="#ff00f0" /> }
                    ].map((s, i) => (
                        <motion.div key={i} className="glass-panel" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, transform: 'scale(3)' }}>{s.icon}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <span style={{ color: '#aaa', fontSize: '1.1rem' }}>{s.label}</span>
                                {s.icon}
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{s.val}</div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    <div className="glass-panel" style={{ padding: '35px' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Pending Approvals (Guide Submissions)</h2>

                        {pendingAttractions.length === 0 ? (
                            <p style={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>No pending tasks.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <AnimatePresence>
                                    {pendingAttractions.map((attr) => (
                                        <motion.div
                                            key={attr.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,153,0,0.1)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid #ff9900' }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '4px' }}>{attr.name}</div>
                                                <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Category: {attr.category}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <motion.button whileHover={{ scale: 1.1 }} onClick={() => updateAttractionStatus(attr.id, 'Approved')} style={{ background: 'rgba(0,255,204,0.1)', border: '1px solid #00ffcc', color: '#00ffcc', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}><Check size={20} /></motion.button>
                                                <motion.button whileHover={{ scale: 1.1 }} onClick={() => updateAttractionStatus(attr.id, 'Rejected')} style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid #ff3366', color: '#ff3366', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}><X size={20} /></motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    <div className="glass-panel" style={{ padding: '35px' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Comms Intercept (System Logs)</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Prepend an automatic log for flavor */}
                            <div style={{ padding: '25px', background: 'rgba(0,240,255,0.05)', borderRadius: '16px', borderLeft: '4px solid #00f0ff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>SysAuth Module</span>
                                    <span style={{ color: '#666', fontSize: '0.9rem', fontFamily: 'monospace' }}>Just now</span>
                                </div>
                                <div className="text-gradient" style={{ marginBottom: '10px', fontSize: '1.2rem', fontWeight: 600 }}>Active Sessions Initialized</div>
                                <div style={{ fontSize: '1rem', color: '#aaa' }}>Data Context synchronizing mock network states.</div>
                            </div>

                            {emails.map((e) => (
                                <div key={e.id} style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', borderLeft: '4px solid #ff00f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Dest: {e.to}</span>
                                        <span style={{ color: '#666', fontSize: '0.9rem', fontFamily: 'monospace' }}>{e.date}</span>
                                    </div>
                                    <div style={{ marginBottom: '10px', fontSize: '1.2rem', fontWeight: 600, color: 'white' }}>{e.subject}</div>
                                    <div style={{ fontSize: '1rem', color: '#aaa' }}>Origin: {e.from}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pending Users Registration Panel */}
                <div className="glass-panel" style={{ padding: '35px', marginTop: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Pending Node Registrations</h2>

                    {pendingUsers.length === 0 ? (
                        <p style={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>No pending user requests.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            <AnimatePresence>
                                {pendingUsers.map((u) => (
                                    <motion.div
                                        key={u.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                        style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', borderTop: '4px solid #7000ff' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #00f0ff, #7000ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{u.name.charAt(0)}</div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{u.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#00f0ff' }}>{u.role}</div>
                                            </div>
                                        </div>
                                        <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>{u.email}</div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => updateUserStatus(u.id, 'Approved')} style={{ flex: 1, background: 'rgba(0,255,204,0.1)', border: '1px solid #00ffcc', color: '#00ffcc', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Approve</button>
                                            <button onClick={() => updateUserStatus(u.id, 'Rejected')} style={{ flex: 1, background: 'rgba(255,51,102,0.1)', border: '1px solid #ff3366', color: '#ff3366', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Reject</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
