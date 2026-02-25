import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import HostDashboard from './pages/HostDashboard';
import TouristDashboard from './pages/TouristDashboard';
import GuideDashboard from './pages/GuideDashboard';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
    const { currentUser } = useAuth();
    if (!currentUser) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/" replace />;
    }
    return children;
}

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/host" element={<ProtectedRoute allowedRoles={['Host']}><HostDashboard /></ProtectedRoute>} />
                        <Route path="/tourist" element={<ProtectedRoute allowedRoles={['Tourist']}><TouristDashboard /></ProtectedRoute>} />
                        <Route path="/guide" element={<ProtectedRoute allowedRoles={['Guide']}><GuideDashboard /></ProtectedRoute>} />
                    </Routes>
                </AnimatePresence>
            </div>
        </Router>
    );
}

export default App;
