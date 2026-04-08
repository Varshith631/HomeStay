import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function OAuth2Redirect() {
    const [searchParams] = useSearchParams();
    const { fetchMe } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            fetchMe(token).then((user) => {
                if (user) {
                    const role = user.role.toLowerCase();
                    if (role === 'admin') navigate('/admin');
                    else if (role === 'host') navigate('/host');
                    else if (role === 'guide') navigate('/guide');
                    else navigate('/tourist');
                } else {
                    navigate('/login?error=auth_failed');
                }
            });
        } else {
            navigate('/login?error=no_token');
        }
    }, [searchParams, fetchMe, navigate]);

    return (
        <div style={{ display: 'flex', minHeight: '80vh', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: '40px', height: '40px', border: '3px solid rgba(0, 240, 255, 0.3)', borderTop: '3px solid #00f0ff', borderRadius: '50%' }} />
            <span style={{ marginLeft: 20, color: '#fff' }}>Authenticating via Google...</span>
        </div>
    );
}
