import { useState } from 'react';
import styles from '../styles/SearchBar.module.css';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ placeholder, onSearch }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <FaSearch className={styles.icon} />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className={styles.input}
            />
            <button type="submit" className={styles.button}>
                Search
            </button>
        </form>
    );
}

export default SearchBar;
