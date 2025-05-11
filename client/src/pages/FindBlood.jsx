import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/FindBlood.module.css';
import SearchBar from '../components/SearchBar';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { getNearbyDonors } from '../utils/api';

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
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);

    // Get user location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    setUserLocation({ lat: 40.7128, lng: -74.006 }); // Default to New York
                }
            );
        } else {
            setUserLocation({ lat: 40.7128, lng: -74.006 });
        }
    }, []);

    // Fetch donors when userLocation changes
    useEffect(() => {
        if (!userLocation) return;
        setLoading(true);
        setError(null);
        getNearbyDonors({
            lat: userLocation.lat,
            lng: userLocation.lng,
        })
            .then((data) => {
                // Map backend data to frontend format
                const userLatLng = L.latLng(userLocation.lat, userLocation.lng);
                const mappedResults = data.map((donor) => {
                    const donorLat = donor.location.coordinates[1];
                    const donorLng = donor.location.coordinates[0];
                    const donorLatLng = L.latLng(donorLat, donorLng);
                    const distanceInMeters = userLatLng.distanceTo(donorLatLng);
                    const distanceInKm = (distanceInMeters / 1000).toFixed(2);
                    return {
                        id: donor._id,
                        name: donor.user.name,
                        bloodType: donor.user.bloodType,
                        location: donor.address,
                        lat: donorLat,
                        lng: donorLng,
                        phone: donor.user.phone || '',
                        available: donor.availabilityStatus === 'Available' || donor.availabilityStatus === 'Emergency',
                        status: donor.availabilityStatus,
                        distance: distanceInKm,
                    };
                });
                setResults(mappedResults);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [userLocation]);

    // Filtering logic
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

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>Find Blood Donors</h1>
                <p>Connect with verified blood donors near you and save lives.</p>

                <div className={styles.floatingSearchBar}>
                    <SearchBar placeholder="Search by city or blood type..." onSearch={handleSearch} />
                </div>

                <div className={styles.filters}>
                    <div className={styles.multiSelect}>
                        {bloodTypes.map((type) => (
                            <div
                                key={type}
                                className={`${styles.bloodType} ${filters.bloodType.includes(type) ? styles.active : ''}`}
                                onClick={() => handleBloodTypeChange(type)}
                            >
                                {type}
                            </div>
                        ))}
                    </div>
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

                {loading ? (
                    <div className={styles.loader}>Loading...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : filteredResults.length > 0 ? (
                    <div className={styles.results}>
                        {filteredResults.map((result) => (
                            <div
                                key={result.id}
                                className={`${styles.card} ${result.distance < 3 ? styles.bestMatch : ''}`}
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
                                    {result.phone && (
                                        <>
                                            <a href={`tel:${result.phone}`} className={styles.callButton}>
                                                📞 Call
                                            </a>
                                            <a href={`sms:${result.phone}`} className={styles.messageButton}>
                                                💬 Message
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noResults}>No donors found.</div>
                )}

                <MapContainer
                    center={userLocation ? [userLocation.lat, userLocation.lng] : [40.7128, -74.006]}
                    zoom={4}
                    className={styles.map}
                >
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
