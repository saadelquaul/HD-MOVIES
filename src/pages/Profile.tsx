import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useWatchlist } from '../hooks/useWatchlist';
import type { WatchHistoryItem, UserRating } from '../models/types';
import { FiUser, FiMail, FiFilm, FiClock, FiStar, FiHeart } from 'react-icons/fi';

export default function Profile() {
    const { user } = useAuth();
    const { watchlist } = useWatchlist();
    const [watchHistory] = useLocalStorage<WatchHistoryItem[]>('hd_watch_history', []);
    const [ratings] = useLocalStorage<UserRating[]>('hd_ratings', []);

    if (!user) return null;

    const userHistory = watchHistory.filter((h) => h.userId === user.id);
    const userRatings = ratings.filter((r) => r.userId === user.id);
    const avgRating = userRatings.length > 0
        ? (userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length).toFixed(1)
        : '—';

    const uniqueWatched = new Set(userHistory.map((h) => h.videoId)).size;

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-avatar">
                    <div className="avatar-circle">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                </div>

                <div className="profile-info">
                    <h1>{user.username}</h1>
                    <p className="profile-email"><FiMail /> {user.email}</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <FiFilm className="stat-icon" />
                    <div className="stat-value">{uniqueWatched}</div>
                    <div className="stat-label">Contenus visionnés</div>
                </div>
                <div className="stat-card">
                    <FiHeart className="stat-icon" />
                    <div className="stat-value">{watchlist.length}</div>
                    <div className="stat-label">Dans ma liste</div>
                </div>
                <div className="stat-card">
                    <FiStar className="stat-icon" />
                    <div className="stat-value">{userRatings.length}</div>
                    <div className="stat-label">Notes données</div>
                </div>
                <div className="stat-card">
                    <FiClock className="stat-icon" />
                    <div className="stat-value">{avgRating}</div>
                    <div className="stat-label">Note moyenne</div>
                </div>
            </div>

            <section className="profile-section">
                <h2><FiUser /> Informations du compte</h2>
                <div className="info-grid">
                    <div className="info-item">
                        <label>Nom d'utilisateur</label>
                        <p>{user.username}</p>
                    </div>
                    <div className="info-item">
                        <label>Email</label>
                        <p>{user.email}</p>
                    </div>
                    <div className="info-item">
                        <label>ID Utilisateur</label>
                        <p className="user-id">{user.id}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
