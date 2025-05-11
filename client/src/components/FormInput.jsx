import React from 'react';
import styles from '../styles/FormInput.module.css';

const FormInput = ({ label, error, type = 'text', placeholder, ...rest }) => {
    return (
        <div className={styles.inputWrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                className={`${styles.input} ${error ? styles.error : ''}`}
                {...rest}
            />
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default FormInput;
