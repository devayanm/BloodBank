import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Profile.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getProfile, updateProfile, changePassword } from '../utils/api';

const bloodTypes = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    bloodType: yup.string().required('Blood type is required'),
});

const Profile = () => {
    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // Password change state
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const token = localStorage.getItem('token');

    // Fetch user profile on mount
    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getProfile(token);
                setUser(data);
                console.log('User data:', data);
                reset({
                    name: data.name || '',
                    bloodType: data.bloodType || '',
                });
            } catch (err) {
                setError(err.message);
            }
        }
        if (token) fetchProfile();
        // eslint-disable-next-line
    }, [token]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: user?.name || '',
            bloodType: user?.bloodType || '',
        },
    });

    // Handle avatar upload (UI only)
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setAvatar(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Handle profile update (API)
    const onSubmit = async (data) => {
        setSuccess('');
        setError('');
        try {
            const updated = await updateProfile(data, token);
            setUser(updated);
            localStorage.setItem('user', JSON.stringify(updated));
            setSuccess('Profile updated successfully!');
            setEditMode(false);
        } catch (err) {
            setError(err.message || 'Failed to update profile.');
        }
    };

    // Handle password change (API)
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordSuccess('');
        setPasswordError('');
        setPasswordLoading(true);

        const oldPassword = e.target.oldPassword.value;
        const newPassword = e.target.newPassword.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters.');
            setPasswordLoading(false);
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            setPasswordLoading(false);
            return;
        }

        try {
            await changePassword({ oldPassword, newPassword }, token);
            setPasswordSuccess('Password changed successfully!');
            e.target.reset();
            setShowPasswordFields(false);
        } catch (err) {
            setPasswordError(err.message || 'Failed to change password.');
        }
        setPasswordLoading(false);
    };

    if (!user) {
        return (
            <div className={styles.profileContainer}>
                <div className={styles.profileCard}>
                    <div>Loading profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                        {avatar ? (
                            <img src={avatar} alt="Avatar" className={styles.avatarImg} />
                        ) : (
                            <div className={styles.avatarInitial}>
                                {user?.name ? user.name[0].toUpperCase() : ''}
                            </div>
                        )}
                        <button
                            className={styles.avatarBtn}
                            onClick={() => fileInputRef.current.click()}
                            title="Change avatar"
                            aria-label="Change avatar"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M12 20h9" stroke="#357abd" strokeWidth="2" strokeLinecap="round" />
                                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" stroke="#357abd" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <div className={styles.userName}>{user?.name}</div>
                    <div className={styles.userEmail}>{user?.email}</div>
                    <div className={styles.userRole}>{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}</div>
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Profile Information</h2>
                        {!editMode && (
                            <button className={styles.editBtn} onClick={() => setEditMode(true)}>
                                Edit
                            </button>
                        )}
                    </div>
                    {editMode ? (
                        <form onSubmit={handleSubmit(onSubmit)} className={styles.editForm}>
                            <div className={styles.formGroup}>
                                <label>Name</label>
                                <input {...register('name')} />
                                {errors.name && <span className={styles.error}>{errors.name.message}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Blood Type</label>
                                <select {...register('bloodType')}>
                                    <option value="">Select</option>
                                    {bloodTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {errors.bloodType && <span className={styles.error}>{errors.bloodType.message}</span>}
                            </div>
                            <div className={styles.formActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => { setEditMode(false); reset({ name: user.name, bloodType: user.bloodType }); }}>Cancel</button>
                                <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                            {success && <div className={styles.success}>{success}</div>}
                            {error && <div className={styles.error}>{error}</div>}
                        </form>
                    ) : (
                        <div className={styles.infoList}>
                            <div>
                                <span className={styles.infoLabel}>Name:</span> {user?.name}
                            </div>
                            <div>
                                <span className={styles.infoLabel}>Email:</span> {user?.email}
                            </div>
                            <div>
                                <span className={styles.infoLabel}>Blood Type:</span> {user?.bloodType || '--'}
                            </div>
                            <div>
                                <span className={styles.infoLabel}>Role:</span> {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '--'}
                            </div>
                        </div>
                    )}

                    {/* Password Change */}
                    <div className={styles.sectionHeader} style={{ marginTop: '2em' }}>
                        <h2>Password</h2>
                        {!showPasswordFields && (
                            <button className={styles.editBtn} onClick={() => setShowPasswordFields(true)}>
                                Change Password
                            </button>
                        )}
                    </div>
                    {showPasswordFields && (
                        <form className={styles.editForm} onSubmit={handlePasswordChange}>
                            <div className={styles.formGroup}>
                                <label>Old Password</label>
                                <input type="password" name="oldPassword" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>New Password</label>
                                <input type="password" name="newPassword" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Confirm Password</label>
                                <input type="password" name="confirmPassword" required />
                            </div>
                            <div className={styles.formActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setShowPasswordFields(false)}>Cancel</button>
                                <button type="submit" className={styles.saveBtn} disabled={passwordLoading}>
                                    {passwordLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                            {passwordSuccess && <div className={styles.success}>{passwordSuccess}</div>}
                            {passwordError && <div className={styles.error}>{passwordError}</div>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
