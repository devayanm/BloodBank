import React, { useState } from "react";
import { registerDonor } from "../utils/api";
import styles from '../styles/DonorForm.module.css';

const initialState = {
    address: "",
    coordinates: ["", ""], // [lng, lat]
    availabilityStatus: "Available",
    lastDonationDate: "",
    preferredDonationTypes: [],
    healthDeclaration: {
        recentTravel: false,
        currentMedications: "",
        chronicConditions: "",
    },
};

const donationTypes = ["Whole Blood", "Plasma", "Platelets"];
const statusOptions = ["Available", "Unavailable", "Emergency"];

export default function DonorForm({ token }) {
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        if (name.startsWith("healthDeclaration.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                healthDeclaration: {
                    ...prev.healthDeclaration,
                    [key]: type === "checkbox" ? checked : value,
                },
            }));
        } else if (name === "preferredDonationTypes") {
            setForm((prev) => {
                const arr = prev.preferredDonationTypes.includes(value)
                    ? prev.preferredDonationTypes.filter((v) => v !== value)
                    : [...prev.preferredDonationTypes, value];
                return { ...prev, preferredDonationTypes: arr };
            });
        } else if (name === "coordinates.lng" || name === "coordinates.lat") {
            const idx = name === "coordinates.lng" ? 0 : 1;
            const coords = [...form.coordinates];
            coords[idx] = value;
            setForm((prev) => ({ ...prev, coordinates: coords }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    }

    function getCurrentLocation() {
        if (!navigator.geolocation) {
            setMessage("Geolocation is not supported by your browser.");
            return;
        }
        setMessage("Getting your location...");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setForm((prev) => ({
                    ...prev,
                    coordinates: [
                        position.coords.longitude.toString(),
                        position.coords.latitude.toString(),
                    ],
                }));
                setMessage("Location filled!");
            },
            (error) => {
                setMessage("Unable to retrieve your location.");
            }
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            // Prepare healthDeclaration as arrays
            const data = {
                ...form,
                coordinates: [
                    parseFloat(form.coordinates[0]),
                    parseFloat(form.coordinates[1]),
                ],
                healthDeclaration: {
                    ...form.healthDeclaration,
                    currentMedications: form.healthDeclaration.currentMedications
                        ? form.healthDeclaration.currentMedications.split(",").map((s) => s.trim())
                        : [],
                    chronicConditions: form.healthDeclaration.chronicConditions
                        ? form.healthDeclaration.chronicConditions.split(",").map((s) => s.trim())
                        : [],
                },
            };
            await registerDonor(data, token);
            setMessage("Donor registration successful!");
            setForm(initialState);
        } catch (err) {
            setMessage(err.message);
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2 className={styles.heading}>Register as a Donor</h2>
            {message && <p className={styles.message}>{message}</p>}
            <div>
                <label className={styles.label}>
                    Address:
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        type="text"
                    />
                </label>
            </div>
            <button
                type="button"
                className={styles.locationButton}
                onClick={getCurrentLocation}
                style={{ marginBottom: "1rem", width: "100%" }}
            >
                Use My Current Location
            </button>
            <div>
                <label className={styles.label}>
                    Longitude:
                    <input
                        name="coordinates.lng"
                        type="number"
                        step="any"
                        value={form.coordinates[0]}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    Latitude:
                    <input
                        name="coordinates.lat"
                        type="number"
                        step="any"
                        value={form.coordinates[1]}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </label>
            </div>
            <div>
                <label className={styles.label}>
                    Availability Status:
                    <select
                        name="availabilityStatus"
                        value={form.availabilityStatus}
                        onChange={handleChange}
                        className={styles.input}
                    >
                        {statusOptions.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label className={styles.label}>
                    Last Donation Date:
                    <input
                        name="lastDonationDate"
                        type="date"
                        value={form.lastDonationDate}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </label>
            </div>
            <div className={styles.label}>
                Preferred Donation Types:
                {donationTypes.map((type) => (
                    <label key={type} style={{ marginLeft: 8, fontWeight: 400 }}>
                        <input
                            type="checkbox"
                            name="preferredDonationTypes"
                            value={type}
                            checked={form.preferredDonationTypes.includes(type)}
                            onChange={handleChange}
                            className={styles.checkbox}
                        />
                        {type}
                    </label>
                ))}
            </div>
            <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Health Declaration</legend>
                <label className={styles.label}>
                    Recent Travel:
                    <input
                        type="checkbox"
                        name="healthDeclaration.recentTravel"
                        checked={form.healthDeclaration.recentTravel}
                        onChange={handleChange}
                        className={styles.checkbox}
                    />
                </label>
                <label className={styles.label}>
                    Current Medications (comma separated):
                    <input
                        name="healthDeclaration.currentMedications"
                        value={form.healthDeclaration.currentMedications}
                        onChange={handleChange}
                        placeholder="e.g. Aspirin, Ibuprofen"
                        className={styles.input}
                        type="text"
                    />
                </label>
                <label className={styles.label}>
                    Chronic Conditions (comma separated):
                    <input
                        name="healthDeclaration.chronicConditions"
                        value={form.healthDeclaration.chronicConditions}
                        onChange={handleChange}
                        placeholder="e.g. Diabetes, Hypertension"
                        className={styles.input}
                        type="text"
                    />
                </label>
            </fieldset>
            <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? "Registering..." : "Register as Donor"}
            </button>
        </form>
    );
}
