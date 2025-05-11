import { useState } from 'react';
import styles from '../styles/OrganDonorForm.module.css';

const organOptions = [
    'Kidney',
    'Liver',
    'Heart',
    'Lung',
    'Pancreas',
    'Intestine',
    'Cornea',
];

function OrganDonorForm() {
    const [form, setForm] = useState({
        name: '',
        organ: '',
        location: '',
        contact: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Organ Donor Data:', form);
        alert('Thank you for registering as an organ donor!');
        setForm({ name: '', organ: '', location: '', contact: '' });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>Become a Donor</h2>

            <div className={styles.fieldGroup}>
                <label>Full Name</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Rahul Verma"
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Organ Type</label>
                <select name="organ" value={form.organ} onChange={handleChange} required>
                    <option value="" disabled>Select Organ</option>
                    {organOptions.map((organ, idx) => (
                        <option key={idx} value={organ}>{organ}</option>
                    ))}
                </select>
            </div>

            <div className={styles.fieldGroup}>
                <label>Location</label>
                <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Contact Info</label>
                <input
                    type="text"
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="Phone or Email"
                    required
                    pattern="^(\+?\d{10,13}|[^\s@]+@[^\s@]+\.[^\s@]+)$"
                    title="Enter a valid phone number or email"
                />
            </div>

            <button type="submit">Register as Donor</button>
        </form>
    );
}

export default OrganDonorForm;
