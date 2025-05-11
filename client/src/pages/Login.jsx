import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '../components/FormInput';
import styles from '../styles/Login.module.css';
import { login } from '../utils/api';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- Add this import

const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

const Login = () => {
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // <-- Use the hook

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setError('');
        try {
            const res = await login(data);
            if (res.token) {
                localStorage.setItem('token', res.token);
                // Save user info as well
                localStorage.setItem('user', JSON.stringify({
                    name: res.name,
                    email: res.email,
                    role: res.role
                }));
            }
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} autoComplete="off">
                <h2 className={styles.title}>Login</h2>

                <FormInput
                    label="Email"
                    {...register('email')}
                    error={errors.email?.message}
                />

                <div className={styles.passwordWrapper}>
                    <FormInput
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        error={errors.password?.message}
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className={styles.togglePassword}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {error && <p className={styles.serverError}>{error}</p>}

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
