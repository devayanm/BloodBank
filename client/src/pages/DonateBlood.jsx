import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { toast } from 'react-toastify';
import DonorForm from '../components/DonorForm';
import styles from '../styles/DonateBlood.module.css';

const leaderboardData = [
    { name: 'John Doe', donations: 12, bloodType: 'A+', badge: '🥇' },
    { name: 'Emma Watson', donations: 10, bloodType: 'O+', badge: '🥈' },
    { name: 'Michael Scott', donations: 9, bloodType: 'B+', badge: '🥉' },
    { name: 'Tony Stark', donations: 8, bloodType: 'AB+', badge: '⭐' },
    { name: 'Bruce Wayne', donations: 7, bloodType: 'A-', badge: '⭐' },
];

const initialBloodStock = {
    'A+': 120,
    'O+': 100,
    'B+': 90,
    'AB+': 50,
    'A-': 45,
    'O-': 30,
};

const donationHistory = [
    { name: 'John Doe', bloodType: 'A+', time: '2 hours ago' },
    { name: 'Emma Watson', bloodType: 'O+', time: '5 hours ago' },
    { name: 'Michael Scott', bloodType: 'B+', time: '1 day ago' },
];

const nearbyCamps = [
    { name: 'City Hospital', position: [51.505, -0.09], address: 'Main Street' },
    { name: 'Health Center', position: [51.515, -0.1], address: '2nd Avenue' },
    { name: 'Red Cross', position: [51.495, -0.08], address: 'Central Park' },
];

function DonateBlood() {
    const [showForm, setShowForm] = useState(false);
    const [totalDonors, setTotalDonors] = useState(1243);
    const [selectedBloodType, setSelectedBloodType] = useState('All');
    const [progress, setProgress] = useState(0);
    const [countdown, setCountdown] = useState(3600); // 1 hour
    const [bloodStock, setBloodStock] = useState(initialBloodStock);

    useEffect(() => {
        setProgress(Math.min((totalDonors / 5000) * 100, 100));
    }, [totalDonors]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 3600));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Simulate blood stock auto-refresh every minute
        const stockInterval = setInterval(() => {
            setBloodStock((prevStock) => {
                // Simulating stock update: random decrease of blood stock
                const updatedStock = { ...prevStock };
                for (let type in updatedStock) {
                    updatedStock[type] = Math.max(updatedStock[type] - Math.floor(Math.random() * 5), 0);
                }
                return updatedStock;
            });
        }, 60000);
        return () => clearInterval(stockInterval);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            toast.info('⏰ Donation camp starting soon! Visit now!');
        }
    }, [countdown]);

    const handleFormSubmit = () => {
        setTotalDonors((prev) => prev + 1);
        toast.success('✅ Successfully registered as a donor!');
        setShowForm(false);
    };

    // Filter Leaderboard by Blood Type
    const filteredLeaderboard = leaderboardData.filter(
        (donor) =>
            selectedBloodType === 'All' || donor.bloodType === selectedBloodType
    );

    const formatCountdown = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <h1>🩸 Donate Blood & Save Lives!</h1>
            <p>Your donation can save up to 3 lives. Register now!</p>

            {/* Stats Section */}
            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <h2>{totalDonors}</h2>
                    <p>Total Donors</p>
                </div>
                <div className={styles.statItem}>
                    <h2>{formatCountdown(countdown)}</h2>
                    <p>Next Camp Starts In</p>
                </div>
                <div className={styles.statItem}>
                    <h2>3</h2>
                    <p>Potential Lives Saved</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className={styles.progressBar}>
                <div
                    className={styles.progress}
                    style={{ width: `${progress}%` }}
                >
                    {Math.round(progress)}%
                </div>
            </div>

            {/* Blood Stock */}
            <div className={styles.bloodStock}>
                <h2>Blood Stock Availability</h2>
                <div className={styles.stockGrid}>
                    {Object.entries(bloodStock).map(([type, amount]) => (
                        <div key={type} className={`${styles.stockCard} ${amount < 40 ? styles.low : ''}`}>
                            <div className={styles.bloodType}>{type}</div>
                            <div className={styles.unitCount}>{amount} units</div>
                            {amount < 40 && <div className={styles.alert}>⚠️ Low</div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Buttons */}
            <div className={styles.buttonGroup}>
                <motion.button
                    className={styles.ctaButton}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowForm(true)}
                >
                    🩸 Register as a Donor
                </motion.button>
                {/* <motion.button
                    className={styles.ctaButton}
                    whileHover={{ scale: 1.05 }}
                >
                    🏥 Find Blood Banks
                </motion.button> */}
                {/* <motion.button
                    className={styles.ctaButton}
                    whileHover={{ scale: 1.05 }}
                >
                    🎪 Find Donation Camps
                </motion.button> */}
                <motion.button
                    className={styles.ctaButton}
                    whileHover={{ scale: 1.05 }}
                >
                    💉 Sell / Buy Blood
                </motion.button>
            </div>

            {/* Floating Form */}
            {showForm && (
                <motion.div
                    className={styles.floatingForm}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <button className={styles.closeButton} onClick={() => setShowForm(false)}>
                        ✖
                    </button>
                    <DonorForm onSubmit={handleFormSubmit} />
                </motion.div>
            )}

            {/* Leaderboard Section */}
            <div className={styles.leaderboard}>
                <div className={styles.leaderboardHeader}>
                    <h2>🏆 Top Donors</h2>
                    <select
                        value={selectedBloodType}
                        onChange={(e) => setSelectedBloodType(e.target.value)}
                        className={styles.leaderboardSelect}
                    >
                        <option value="All">All Blood Types</option>
                        {Object.keys(bloodStock).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <motion.ul
                    className={styles.leaderboardList}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                >
                    {filteredLeaderboard.map((donor, index) => (
                        <motion.li
                            key={index}
                            className={styles.leaderboardItem}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <span className={styles.rank}>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                            </span>
                            <img
                                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${donor.name}`}
                                alt="avatar"
                                className={styles.avatar}
                            />
                            <div className={styles.donorInfo}>
                                <strong>{donor.name}</strong>
                                <p>{donor.bloodType} • {donor.donations} donations</p>
                            </div>
                            <span className={styles.donorBadge}>{donor.badge}</span>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>

            {/* Map Section */}
            <div className={styles.mapSection}>
                <h2>📍 Nearby Camps</h2>
                <MapContainer center={[51.505, -0.09]} zoom={13}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {nearbyCamps.map((camp) => (
                        <Marker key={camp.name} position={camp.position}>
                            <Popup>{camp.name} - {camp.address}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default DonateBlood;
