import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '../components/FormInput';
import styles from '../styles/Signup.module.css';
import { register as registerUser } from '../utils/api';
import { useNavigate } from 'react-router-dom'; // <-- Import this

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    bloodType: yup.string().required('Blood type is required'),
});

const Signup = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // <-- Use the hook

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setError('');
        setSuccess('');
        try {
            const response = await registerUser(data);
            setSuccess('Signup successful! Please check your email to verify your account.');
            // Redirect to login after a short delay (e.g., 1.5 seconds)
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Signup failed');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} autoComplete="off">
                <h2 className={styles.title}>Sign Up</h2>

                <FormInput label="Name" {...register('name')} error={errors.name?.message} />
                <FormInput label="Email" {...register('email')} error={errors.email?.message} />

                <div className={styles.passwordField}>
                    <FormInput
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        {...register('password')}
                        error={errors.password?.message}
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            // Eye-off SVG
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94C16.13 19.16 14.13 20 12 20C7 20 2.73 16.11 1 12C1.73 10.29 2.89 8.82 4.36 7.76M9.9 9.9C10.28 9.53 10.85 9.25 12 9.25C13.15 9.25 13.72 9.53 14.1 9.9C14.47 10.28 14.75 10.85 14.75 12C14.75 13.15 14.47 13.72 14.1 14.1C13.72 14.47 13.15 14.75 12 14.75C10.85 14.75 10.28 14.47 9.9 14.1M9.9 9.9L4.22 4.22M14.1 14.1L19.78 19.78" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        ) : (
                            // Eye SVG
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M1 12C2.73 7.89 7 4 12 4C17 4 21.27 7.89 23 12C21.27 16.11 17 20 12 20C7 20 2.73 16.11 1 12Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
                    </button>
                </div>

                <FormInput label="Blood Type" {...register('bloodType')} error={errors.bloodType?.message} />

                {error && <p className={styles.serverError}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}

                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default Signup;
