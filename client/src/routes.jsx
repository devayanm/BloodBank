import { Route, Routes } from 'react-router-dom';
import Home from './pages/LandingPage';
import FindBlood from './pages/FindBlood';
import DonateBlood from './pages/DonateBlood';
import OrganBank from './pages/OrganBank';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Profile from './pages/Profile';

function AppRoutes({ activeTab }) {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            {activeTab === 'blood' ? (
                <>
                    <Route path="/find-blood" element={<FindBlood />} />
                    <Route path="/donate-blood" element={<DonateBlood />} />
                </>
            ) : (
                <>
                    <Route path="/find-organ" element={<OrganBank />} />
                </>
            )}
        </Routes>
    );
}

export default AppRoutes;
