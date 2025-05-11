import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/OrganBank.module.css';
import SearchBar from '../components/SearchBar';
import OrganDonorForm from '../components/OrganDonorForm';

function OrganBank() {
    const donors = [
        { id: 1, name: 'John Doe', organ: 'Kidney', location: 'New York', urgency: 'High', verified: true, trust: 'Gold' },
        { id: 2, name: 'Jane Smith', organ: 'Liver', location: 'California', urgency: 'Medium', verified: false, trust: 'Silver' },
        { id: 3, name: 'Rahul Verma', organ: 'Heart', location: 'Delhi', urgency: 'High', verified: true, trust: 'Platinum' },
        { id: 4, name: 'Emily Chen', organ: 'Lung', location: 'Seattle', urgency: 'Low', verified: false, trust: 'Bronze' },
        { id: 5, name: 'Arjun Patel', organ: 'Kidney', location: 'Mumbai', urgency: 'High', verified: true, trust: 'Gold' },
    ];

    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [savedDonors, setSavedDonors] = useState([]);

    const organs = ['All', ...new Set(donors.map(d => d.organ))];

    const handleSearch = (input) => {
        setQuery(input);
    };

    const toggleSave = (id) => {
        setSavedDonors((prev) =>
            prev.includes(id) ? prev.filter(did => did !== id) : [...prev, id]
        );
    };

    const filtered = donors.filter(
        (d) =>
            (activeFilter === 'All' || d.organ === activeFilter) &&
            (d.name.toLowerCase().includes(query.toLowerCase()) ||
                d.organ.toLowerCase().includes(query.toLowerCase()) ||
                d.location.toLowerCase().includes(query.toLowerCase()))
    );

    const urgencyColors = {
        High: '#e53935',
        Medium: '#fb8c00',
        Low: '#43a047',
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>Find Organ Donors</h1>
                <p>Explore a trusted network of organ donors and lifesavers.</p>

                <SearchBar placeholder="Search by name, city, or organ type..." onSearch={handleSearch} />

                <div className={styles.stats}>
                    <span>Total Donors: <strong>{donors.length}</strong></span>
                    <span>Saved: <strong>{savedDonors.length}</strong></span>
                </div>

                {/* Filter Buttons */}
                <div className={styles.filterGroup}>
                    {organs.map((organ, idx) => (
                        <button
                            key={idx}
                            className={`${styles.filterButton} ${activeFilter === organ ? styles.active : ''}`}
                            onClick={() => setActiveFilter(organ)}
                        >
                            {organ}
                        </button>
                    ))}
                </div>

                {/* Donor Cards */}
                <div className={styles.results}>
                    {filtered.length === 0 && <p className={styles.noResults}>No matching donors found.</p>}
                    {filtered.map((result) => (
                        <motion.div
                            key={result.id}
                            className={styles.card}
                            whileHover={{ scale: 1.03 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: result.id * 0.05 }}
                        >
                            <div className={styles.cardHeader}>
                                <h3>{result.name}</h3>
                                {result.verified && <span className={styles.verified}>✔ Verified</span>}
                            </div>
                            <p>
                                <span className={styles.organBadge}>{result.organ}</span>
                                <span className={`${styles.trustBadge} ${styles[result.trust.toLowerCase()]}`}>{result.trust}</span>
                            </p>
                            <p className={styles.location}>📍 {result.location}</p>
                            <p className={styles.urgency} style={{ color: urgencyColors[result.urgency] }}>
                                Urgency: <strong>{result.urgency}</strong>
                            </p>
                            <button className={styles.saveBtn} onClick={() => toggleSave(result.id)}>
                                {savedDonors.includes(result.id) ? '💖 Saved' : '🤍 Save'}
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className={styles.divider}><span>Become a Donor</span></div>

                <div className={styles.donorForm}>
                    <OrganDonorForm />
                </div>

                {/* Testimonials */}
                <div className={styles.testimonials}>
                    <h2>What People Are Saying ❤️</h2>
                    <p>“This platform helped us find a life-saving liver donor in time. Forever grateful!”</p>
                    <p>– Priya M., Mumbai</p>
                </div>
            </div>
        </div>
    );
}

export default OrganBank;
