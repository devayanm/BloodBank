import { Route, Routes } from 'react-router-dom';
import Home from './pages/LandingPage';
import FindBlood from './pages/FindBlood';
import DonateBlood from './pages/DonateBlood';
import OrganBank from './pages/OrganBank';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes({ activeTab }) {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            {activeTab === 'blood' ? (
                <>
                    <Route
                        path="/find-blood"
                        element={
                            <ProtectedRoute>
                                <FindBlood />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/donate-blood"
                        element={
                            <ProtectedRoute>
                                <DonateBlood />
                            </ProtectedRoute>
                        }
                    />
                </>
            ) : (
                <>
                    <Route
                        path="/find-organ"
                        element={
                            <ProtectedRoute>
                                <OrganBank />
                            </ProtectedRoute>
                        }
                    />
                </>
            )}
        </Routes>
    );
}

export default AppRoutes;
