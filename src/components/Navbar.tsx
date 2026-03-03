import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiFilm, FiLogOut, FiUser, FiHeart } from 'react-icons/fi';
import SearchBar from './SearchBar';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <FiFilm className="brand-icon" />
                    <span>HD-MOVIES</span>
                </Link>

                {isAuthenticated && (
                    <>
                        <div className="navbar-search">
                            <SearchBar />
                        </div>

                        <div className="navbar-links">
                            <Link to="/" className="nav-link">Accueil</Link>
                            <Link to="/watchlist" className="nav-link">
                                <FiHeart /> Ma Liste
                            </Link>
                            <Link to="/profile" className="nav-link">
                                <FiUser /> {user?.username}
                            </Link>
                            <button onClick={handleLogout} className="nav-btn logout-btn">
                                <FiLogOut /> Déconnexion
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}
