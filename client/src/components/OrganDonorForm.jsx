import React, { useState } from "react";
import { registerOrganDonor } from "../utils/api";
import styles from '../styles/OrganDonorForm.module.css';

const organs = ["Kidney", "Liver", "Heart", "Lung", "Pancreas", "Intestine", "Other"];
const urgencies = ["High", "Medium", "Low"];
const trusts = ["Bronze", "Silver", "Gold", "Platinum"];

export default function OrganDonorForm({ token }) {
    const [form, setForm] = useState({
        organ: "",
        urgency: "Medium",
        trust: "Bronze",
        contact: "",
        address: "",
        notes: "",
        location: { type: "Point", coordinates: ["", ""] }, // [lng, lat]
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        if (name === "lng" || name === "lat") {
            setForm((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    coordinates: name === "lng"
                        ? [value, prev.location.coordinates[1]]
                        : [prev.location.coordinates[0], value],
                },
            }));
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
                    location: {
                        ...prev.location,
                        coordinates: [
                            position.coords.longitude.toString(),
                            position.coords.latitude.toString(),
                        ],
                    },
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
            const data = {
                ...form,
                location: {
                    ...form.location,
                    coordinates: [
                        parseFloat(form.location.coordinates[0]),
                        parseFloat(form.location.coordinates[1]),
                    ],
                },
            };
            await registerOrganDonor(data, token);
            setMessage("Organ donor registration successful!");
            setForm({
                organ: "",
                urgency: "Medium",
                trust: "Bronze",
                contact: "",
                address: "",
                notes: "",
                location: { type: "Point", coordinates: ["", ""] },
            });
        } catch (err) {
            setMessage(err.message);
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h3 className={styles.heading}>Register as Organ Donor</h3>
            {message && <p className={styles.message}>{message}</p>}
            <label className={styles.label}>
                Organ:
                <select name="organ" value={form.organ} onChange={handleChange} required className={styles.input}>
                    <option value="">Select Organ</option>
                    {organs.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
            </label>
            <label className={styles.label}>
                Urgency:
                <select name="urgency" value={form.urgency} onChange={handleChange} className={styles.input}>
                    {urgencies.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
            </label>
            <label className={styles.label}>
                Trust Level:
                <select name="trust" value={form.trust} onChange={handleChange} className={styles.input}>
                    {trusts.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
            </label>
            <label className={styles.label}>
                Contact (phone/email):
                <input name="contact" value={form.contact} onChange={handleChange} required className={styles.input} />
            </label>
            <label className={styles.label}>
                Address:
                <input name="address" value={form.address} onChange={handleChange} required className={styles.input} />
            </label>
            <button
                type="button"
                className={styles.locationButton}
                onClick={getCurrentLocation}
                style={{ marginBottom: "1rem", width: "100%" }}
            >
                Use My Current Location
            </button>
            <label className={styles.label}>
                Longitude:
                <input name="lng" type="number" value={form.location.coordinates[0]} onChange={handleChange} required className={styles.input} />
            </label>
            <label className={styles.label}>
                Latitude:
                <input name="lat" type="number" value={form.location.coordinates[1]} onChange={handleChange} required className={styles.input} />
            </label>
            <label className={styles.label}>
                Notes:
                <textarea name="notes" value={form.notes} onChange={handleChange} className={styles.input} />
            </label>
            <button type="submit" disabled={loading} className={styles.button}>
                {loading ? "Registering..." : "Register as Organ Donor"}
            </button>
        </form>
    );
}
