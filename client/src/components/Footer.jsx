import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import styles from '../styles/Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Column 1 */}
                <div className={styles.col}>
                    <h3 className={styles.logo}>LifeConnect</h3>
                    <p className={styles.slogan}>Saving lives, one drop at a time.</p>
                </div>

                {/* Column 2 */}
                <div className={styles.col}>
                    <h4>Quick Links</h4>
                    <nav className={styles.links}>
                        <Link to="/" className={styles.link}>Home</Link>
                        <Link to="/find-blood" className={styles.link}>Find Blood</Link>
                        <Link to="/donate-blood" className={styles.link}>Donate Blood</Link>
                        <Link to="/about" className={styles.link}>About</Link>
                        <Link to="/contact" className={styles.link}>Contact</Link>
                    </nav>
                </div>

                {/* Column 3 */}
                <div className={styles.col}>
                    <h4>Follow Us</h4>
                    <div className={styles.socialIcons}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.iconBtn}><FiFacebook /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className={styles.iconBtn}><FiTwitter /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.iconBtn}><FiInstagram /></a>
                    </div>
                </div>
            </div>

            <button
                className={styles.backToTop}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
            >
                ↑ Back to top
            </button>

            <div className={styles.bottomBar}>
                &copy; {new Date().getFullYear()} <span className={styles.brand}>LifeConnect</span>. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
