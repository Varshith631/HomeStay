import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { Map, Zap, CheckCircle2, TrendingUp, Plus, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function GuideDashboard() {
    const { attractions, addAttraction } = useData();
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (!name || !category) return;

        const newAttr = {
            id: `a${Date.now()}`,
            name,
            category,
            popularity: Math.floor(Math.random() * 40) + 50, // Initial random popularity
            status: 'Pending' // Requires admin approval
        };

        addAttraction(newAttr);
        setIsAdding(false);
        setName('');
        setCategory('');
    };

    return (
        <PageTransition>
            <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '40px' }}>Guide <span className="text-gradient">Intelligence</span></h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                    <div className="glass-panel" style={{ padding: '35px', alignSelf: 'start' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><TrendingUp color="#00f0ff" /> Live Trends</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {['Nature Excursions', 'Tech Museums', 'Zero-G Sports'].map((cat, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.1rem' }}>{cat}</span>
                                    <span className="text-gradient" style={{ fontWeight: 800, fontSize: '1.2rem' }}>+{(Math.random() * 20 + 10).toFixed(1)}%</span>
                                </div>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {!isAdding ? (
                                <motion.button
                                    key="btn"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={() => setIsAdding(true)}
                                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' }} whileTap={{ scale: 0.98 }}
                                    style={{ width: '100%', marginTop: '40px', padding: '20px', background: 'linear-gradient(90deg, rgba(0,240,255,0.2), rgba(112,0,255,0.2))', color: 'white', border: '1px solid rgba(0,240,255,0.5)', borderRadius: '16px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                                >
                                    <Plus size={20} /> Broadcast New Insight
                                </motion.button>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    onSubmit={handleAddSubmit}
                                    style={{ marginTop: '30px', background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0,240,255,0.3)' }}
                                >
                                    <h3 style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        New Attraction
                                        <button type="button" onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer' }}><X size={20} /></button>
                                    </h3>
                                    <input
                                        type="text" placeholder="Attraction Name" value={name} onChange={e => setName(e.target.value)} required
                                        style={{ width: '100%', padding: '12px', marginBottom: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                    />
                                    <input
                                        type="text" placeholder="Category (e.g., Nature, Tech)" value={category} onChange={e => setCategory(e.target.value)} required
                                        style={{ width: '100%', padding: '12px', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                    />
                                    <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #00f0ff, #7000ff)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                        Submit for Review
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <h2 style={{ fontSize: '2.2rem' }}>Your Curated Recommendations</h2>
                        <AnimatePresence>
                            {attractions.map((attr, i) => (
                                <motion.div
                                    key={attr.id}
                                    layout
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-panel"
                                    style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: attr.status === 'Pending' ? '4px solid #ff9900' : '4px solid #00f0ff' }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                            <h3 style={{ fontSize: '1.6rem' }}>{attr.name}</h3>
                                            {attr.status === 'Pending' && <span style={{ padding: '4px 10px', background: 'rgba(255,153,0,0.2)', color: '#ff9900', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Pending Approval</span>}
                                        </div>
                                        <div style={{ display: 'flex', gap: '15px', color: '#aaa', alignItems: 'center' }}>
                                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '10px', color: 'white' }}>{attr.category}</span>
                                            <span>Engagement Index: <strong style={{ color: attr.status === 'Pending' ? '#ff9900' : '#00f0ff' }}>{attr.popularity}</strong></span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '12px', cursor: 'pointer', color: '#00f0ff' }}><Map size={22} /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
