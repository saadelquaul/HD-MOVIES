import { FiFilm, FiGithub } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <FiFilm className="brand-icon" />
                    <span>HD-MOVIES</span>
                </div>
                <p className="footer-text">
                    Plateforme de streaming vidéo — Projet Frontend React.js
                </p>
                <div className="footer-links">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                        <FiGithub /> GitHub
                    </a>
                </div>
                <p className="footer-copy">&copy; {new Date().getFullYear()} HD-MOVIES. Tous droits réservés.</p>
            </div>
        </footer>
    );
}
