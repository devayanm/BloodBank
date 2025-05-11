import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import bloodAnimation from '../assets/blood.json';
import organAnimation from '../assets/organ.json';
import styles from '../styles/LandingPage.module.css';

function LandingPage() {
    const [activeTab, setActiveTab] = useState('blood');
    const [stats, setStats] = useState({ donors: 0, donations: 0, livesSaved: 0 });

    useEffect(() => {
        // Stats animation
        const targetStats = { donors: 15000, donations: 5000, livesSaved: 20000 };
        const interval = setInterval(() => {
            setStats((prev) => ({
                donors: Math.min(prev.donors + 50, targetStats.donors),
                donations: Math.min(prev.donations + 20, targetStats.donations),
                livesSaved: Math.min(prev.livesSaved + 60, targetStats.livesSaved),
            }));
        }, 10);

        return () => clearInterval(interval);
    }, []);

    const handleTabSwitch = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
        }
    };

    return (
        <div className={styles.container}>
            {/* Background Shapes */}
            <div className={styles.shape1}></div>
            <div className={styles.shape2}></div>
            <div className={styles.shape3}></div>

            {/* Tab Section */}
            <div className={styles.tabSection}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'blood' ? styles.active : ''}`}
                    onClick={() => handleTabSwitch('blood')}
                >
                    Blood Donation
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'organ' ? styles.active : ''}`}
                    onClick={() => handleTabSwitch('organ')}
                >
                    Organ Donation
                </button>
            </div>

            {/* Hero Section */}
            <div className={`${styles.heroSection} ${activeTab === 'blood' ? styles.fadeIn : styles.fadeOut}`}>
                <div className={styles.heroContent}>
                    <h1>
                        {activeTab === 'blood'
                            ? 'Save a Life with Just a Drop of Blood'
                            : 'Give the Gift of Life through Organ Donation'}
                    </h1>
                    <p>
                        {activeTab === 'blood'
                            ? 'Donate blood and help save lives. Your small act of kindness can make a big difference.'
                            : 'Become an organ donor and give someone a second chance at life.'}
                    </p>
                    <div className={styles.ctaWrapper}>
                        {activeTab === 'blood' ? (
                            <>
                                <Link to="/find-blood" className={styles.ctaPrimary}>
                                    Find Blood
                                </Link>
                                <Link to="/donate-blood" className={styles.ctaSecondary}>
                                    Donate Now
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/find-organ" className={styles.ctaPrimary}>
                                    Find Organ
                                </Link>
                                <Link to="/donate-organ" className={styles.ctaSecondary}>
                                    Become a Donor
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.heroAnimation}>
                    <Lottie
                        options={{
                            loop: true,
                            autoplay: true,
                            animationData: activeTab === 'blood' ? bloodAnimation : organAnimation,
                        }}
                        height={300}
                        width={300}
                    />
                </div>
            </div>

            {/* Statistics Section */}
            <div className={styles.statsSection}>
                <div className={styles.stat}>
                    <h3>{stats.donors}+</h3>
                    <p>Registered Donors</p>
                </div>
                <div className={styles.stat}>
                    <h3>{stats.donations}+</h3>
                    <p>Successful Donations</p>
                </div>
                <div className={styles.stat}>
                    <h3>{stats.livesSaved}+</h3>
                    <p>Lives Saved</p>
                </div>
            </div>

            {/* How It Works Section */}
            <div className={styles.howItWorksSection}>
                <h2>How It Works</h2>
                <div className={styles.stepsContainer}>
                    <div className={styles.step}>
                        <span>1</span>
                        <p>Register as a donor</p>
                    </div>
                    <div className={styles.step}>
                        <span>2</span>
                        <p>Get matched with a recipient</p>
                    </div>
                    <div className={styles.step}>
                        <span>3</span>
                        <p>Complete the donation</p>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className={styles.searchSection}>
                <h2>Find Blood or Organs Near You</h2>
                <input type="text" className={styles.searchInput} placeholder="Enter blood type or organ..." />
                <button className={styles.searchButton}>Search</button>
            </div>
        </div>
    );
}

export default LandingPage;
