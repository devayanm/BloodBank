import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/FindBlood.module.css';
import SearchBar from '../components/SearchBar';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function FindBlood() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        bloodType: [],
        location: '',
        availability: '',
    });
    const [userLocation, setUserLocation] = useState(null); // To store the user's current location

    useEffect(() => {
        // Get user's geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error("Error getting geolocation: ", error);
                    setUserLocation({ lat: 40.7128, lng: -74.006 }); // Default to New York if geolocation fails
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setUserLocation({ lat: 40.7128, lng: -74.006 }); // Default to New York if geolocation fails
        }

        setLoading(true);
        setTimeout(() => {
            setResults([
                { id: 1, name: 'John Doe', bloodType: 'O+', location: 'New York', lat: 40.7128, lng: -74.006, phone: '123-456-7890', available: true, distance: 2.5 },
                { id: 2, name: 'Jane Smith', bloodType: 'A-', location: 'California', lat: 36.7783, lng: -119.4179, phone: '987-654-3210', available: false, distance: 5.0 },
                { id: 3, name: 'Emily Davis', bloodType: 'B+', location: 'Chicago', lat: 41.8781, lng: -87.6298, phone: '345-678-1234', available: true, distance: 1.2 },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleSearch = (query) => {
        setFilters((prev) => ({ ...prev, location: query }));
    };

    const handleBloodTypeChange = (type) => {
        setFilters((prev) => {
            const newBloodType = prev.bloodType.includes(type)
                ? prev.bloodType.filter((bt) => bt !== type)
                : [...prev.bloodType, type];
            return { ...prev, bloodType: newBloodType };
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredResults = useMemo(() => {
        return results.filter((result) => {
            const matchesBloodType =
                filters.bloodType.length === 0 || filters.bloodType.includes(result.bloodType);
            const matchesLocation =
                !filters.location ||
                result.location.toLowerCase().includes(filters.location.toLowerCase());
            const matchesAvailability =
                !filters.availability ||
                (filters.availability === 'available' && result.available) ||
                (filters.availability === 'busy' && !result.available);

            return matchesBloodType && matchesLocation && matchesAvailability;
        });
    }, [results, filters]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* ===== Header ===== */}
                <h1>Find Blood Donors</h1>
                <p>Connect with verified blood donors near you and save lives.</p>

                {/* ===== Search Bar ===== */}
                <div className={styles.floatingSearchBar}>
                    <SearchBar placeholder="Search by city or blood type..." onSearch={handleSearch} />
                </div>

                {/* ===== Filters ===== */}
                <div className={styles.filters}>
                    {/* Multi-Select Blood Types */}
                    <div className={styles.multiSelect}>
                        {bloodTypes.map((type) => (
                            <div
                                key={type}
                                className={`${styles.bloodType} ${filters.bloodType.includes(type) ? styles.active : ''
                                    }`}
                                onClick={() => handleBloodTypeChange(type)}
                            >
                                {type}
                            </div>
                        ))}
                    </div>

                    {/* Availability Filter */}
                    <select
                        name="availability"
                        value={filters.availability}
                        onChange={handleFilterChange}
                        className={styles.dropdown}
                    >
                        <option value="">All Availability</option>
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                    </select>
                </div>

                {/* ===== Results ===== */}
                {loading ? (
                    <div className={styles.loader}>Loading...</div>
                ) : filteredResults.length > 0 ? (
                    <div className={styles.results}>
                        {filteredResults.map((result) => (
                            <div
                                key={result.id}
                                className={`${styles.card} ${result.distance < 3 ? styles.bestMatch : ''
                                    }`}
                            >
                                <h3>{result.name}</h3>
                                <p>
                                    Blood Type: <strong>{result.bloodType}</strong>
                                </p>
                                <p>Location: {result.location}</p>
                                <p>Distance: {result.distance} km</p>
                                <p>
                                    Status:{' '}
                                    {result.available ? (
                                        <span className={styles.available}>Available</span>
                                    ) : (
                                        <span className={styles.busy}>Busy</span>
                                    )}
                                </p>
                                <div className={styles.actions}>
                                    <a href={`tel:${result.phone}`} className={styles.callButton}>
                                        📞 Call
                                    </a>
                                    <a href={`sms:${result.phone}`} className={styles.messageButton}>
                                        💬 Message
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noResults}>No donors found.</div>
                )}

                {/* ===== Map ===== */}
                <MapContainer center={userLocation ? [userLocation.lat, userLocation.lng] : [40.7128, -74.006]} zoom={4} className={styles.map}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {filteredResults.map((result) => (
                        <Marker key={result.id} position={[result.lat, result.lng]}>
                            <Popup>
                                <strong>{result.name}</strong>
                                <p>Blood Type: {result.bloodType}</p>
                                <p>{result.location}</p>
                                <p>Distance: {result.distance} km</p>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default FindBlood;
