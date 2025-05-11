import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import styles from '../styles/Header.module.css';

function getUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

function Header({ activeTab, onTabChange }) {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);
    const [user, setUser] = useState(getUser());

    // Listen for login/logout changes (optional: for more robust state management, use Context)
    useEffect(() => {
        const syncUser = () => setUser(getUser());
        window.addEventListener('storage', syncUser);
        return () => window.removeEventListener('storage', syncUser);
    }, []);

    const handleTabSwitch = () => {
        const newTab = activeTab === 'blood' ? 'organ' : 'blood';
        onTabChange(newTab);
        navigate(newTab === 'blood' ? '/find-blood' : '/find-organ');
    };

    const handlePageNavigation = (page) => {
        navigate(`/${page}`);
    };

    // Close profile menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowProfileMenu(false);
        navigate('/login');
    };

    // Get initial of the user's name
    const userInitial = user?.name ? user.name[0].toUpperCase() : '';

    return (
        <header className={styles.header}>
            {/* Left Section - Logo */}
            <Link to="/" className={styles.logo}>
                🩸 BloodBank
            </Link>

            {/* Center Section - Toggle + Pages */}
            <div className={styles.centerSection}>
                {/* Switch Toggle */}
                <div className={styles.switchContainer} role="tablist">
                    <span
                        className={`${styles.label} ${activeTab === 'blood' ? styles.activeLabel : ''}`}
                        role="tab"
                        aria-selected={activeTab === 'blood'}
                        onClick={() => handleTabSwitch('blood')}
                    >
                        Blood Bank
                    </span>
                    <div
                        className={`${styles.switch} ${activeTab === 'organ' ? styles.active : ''}`}
                        onClick={handleTabSwitch}
                        role="switch"
                        aria-checked={activeTab === 'organ'}
                        tabIndex={0}
                    >
                        <div className={styles.switchThumb} />
                    </div>
                    <span
                        className={`${styles.label} ${activeTab === 'organ' ? styles.activeLabel : ''}`}
                        role="tab"
                        aria-selected={activeTab === 'organ'}
                        onClick={() => handleTabSwitch('organ')}
                    >
                        Organ Donation
                    </span>
                </div>

                {/* Pages under selected tab */}
                <div className={styles.pages}>
                    {activeTab === 'blood' ? (
                        <>
                            <div
                                className={styles.page}
                                onClick={() => handlePageNavigation('find-blood')}
                            >
                                Find Blood
                            </div>
                            <div
                                className={styles.page}
                                onClick={() => handlePageNavigation('donate-blood')}
                            >
                                Donate Blood
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className={styles.page}
                                onClick={() => handlePageNavigation('find-organ')}
                            >
                                Find Organ
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Right Section - Profile & Auth */}
            <div className={styles.rightSection}>
                {/* Notification Icon */}
                {user && (
                    <div className={styles.iconBtn} aria-label="Notifications">
                        <Bell size={22} strokeWidth={2} />
                    </div>
                )}

                {/* Profile Dropdown or Login/Signup */}
                {user ? (
                    <div
                        className={styles.profileWrapper}
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        ref={profileMenuRef}
                        tabIndex={0}
                        role="button"
                        aria-haspopup="true"
                        aria-expanded={showProfileMenu}
                    >
                        <div className={styles.profileCircle}>
                            {userInitial}
                        </div>
                        {showProfileMenu && (
                            <div className={styles.profileMenu}>
                                <Link to="/profile" className={styles.menuItem}>Profile</Link>
                                <Link to="/settings" className={styles.menuItem}>Settings</Link>
                                <div
                                    className={styles.menuItem}
                                    onClick={handleLogout}
                                    style={{ cursor: 'pointer', color: '#e74c3c' }}
                                >
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.authLinks}>
                        <Link to="/login" className={styles.authLink}>Login</Link>
                        <Link to="/signup" className={styles.authLink}>Sign Up</Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
