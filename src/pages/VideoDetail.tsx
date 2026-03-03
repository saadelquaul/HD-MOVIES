import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVideoDetail, getSimilar } from '../services/tmdb';
import { useWatchlist } from '../hooks/useWatchlist';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../hooks/useAuth';
import VideoGrid from '../components/VideoGrid';
import type { Video, UserRating, WatchHistoryItem } from '../models/types';
import { FiHeart, FiClock, FiCalendar, FiStar, FiUser, FiUsers, FiArrowLeft } from 'react-icons/fi';

export default function VideoDetail() {
    const { mediaType, id } = useParams<{ mediaType: string; id: string }>();
    const [video, setVideo] = useState<Video | null>(null);
    const [similar, setSimilar] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const { isInWatchlist, toggleWatchlist } = useWatchlist();
    const { user } = useAuth();
    const [ratings, setRatings] = useLocalStorage<UserRating[]>('hd_ratings', []);
    const [watchHistory, setWatchHistory] = useLocalStorage<WatchHistoryItem[]>('hd_watch_history', []);
    const [hoverRating, setHoverRating] = useState(0);

    const videoId = parseInt(id || '0');
    const mt = (mediaType === 'tv' ? 'tv' : 'movie') as 'movie' | 'tv';

    const userRating = ratings.find((r) => r.userId === user?.id && r.videoId === videoId)?.rating || 0;

    const handleRate = (value: number) => {
        if (!user) return;
        setRatings((prev) => {
            const filtered = prev.filter((r) => !(r.userId === user.id && r.videoId === videoId));
            return [...filtered, { userId: user.id, videoId, rating: value }];
        });
    };

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        const fetchData = async () => {
            try {
                const [videoData, similarData] = await Promise.all([
                    getVideoDetail(videoId, mt),
                    getSimilar(videoId, mt),
                ]);
                if (!cancelled) {
                    setVideo(videoData);
                    setSimilar(similarData);

                    // Record watch history
                    if (user) {
                        const entry: WatchHistoryItem = {
                            id: `${user.id}_${videoId}_${Date.now()}`,
                            userId: user.id,
                            videoId,
                            watchedAt: new Date().toISOString(),
                            progressTime: 0,
                            completed: false,
                        };
                        setWatchHistory((prev) => {
                            const existing = prev.filter((h) => !(h.userId === user.id && h.videoId === videoId));
                            return [...existing, entry];
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching video detail:', error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [videoId, mt]);

    if (loading) {
        return (
            <div className="detail-page">
                <div className="detail-loading">
                    <div className="spinner" />
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="detail-page">
                <div className="detail-error">
                    <p>Contenu introuvable.</p>
                    <Link to="/">Retour à l'accueil</Link>
                </div>
            </div>
        );
    }

    const inWatchlist = isInWatchlist(video.id);

    return (
        <div className="detail-page">
            {/* Backdrop */}
            <div
                className="detail-backdrop"
                style={{ backgroundImage: `url(${video.thumbnailUrl.replace('w500', 'original')})` }}
            />

            <div className="detail-content">
                <Link to="/" className="back-link">
                    <FiArrowLeft /> Retour au catalogue
                </Link>

                <div className="detail-main">
                    <div className="detail-poster">
                        <img src={video.thumbnailUrl} alt={video.title} />
                    </div>

                    <div className="detail-info">
                        <span className={`type-badge badge-${video.type.toLowerCase()}`}>{video.type}</span>
                        <h1 className="detail-title">{video.title}</h1>

                        <div className="detail-meta">
                            <span><FiCalendar /> {video.releaseYear}</span>
                            {video.duration > 0 && <span><FiClock /> {video.duration} min</span>}
                            <span><FiStar className="star-filled" /> {video.rating}/10</span>
                            <span className="detail-category">{video.category}</span>
                        </div>

                        <p className="detail-description">{video.description}</p>

                        {video.director && (
                            <div className="detail-crew">
                                <FiUser /> <strong>Réalisateur :</strong> {video.director}
                            </div>
                        )}

                        {video.cast.length > 0 && (
                            <div className="detail-crew">
                                <FiUsers /> <strong>Casting :</strong> {video.cast.join(', ')}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="detail-actions">
                            <button
                                className={`action-btn watchlist-btn ${inWatchlist ? 'in-list' : ''}`}
                                onClick={() => toggleWatchlist(video.id)}
                                id="toggle-watchlist"
                            >
                                <FiHeart /> {inWatchlist ? 'Retirer de Ma Liste' : 'Ajouter à Ma Liste'}
                            </button>
                        </div>

                        {/* Rating */}
                        <div className="rating-section">
                            <h3>Votre note :</h3>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                    <button
                                        key={star}
                                        className={`star-btn ${star <= (hoverRating || userRating) ? 'active' : ''}`}
                                        onClick={() => handleRate(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        id={`rate-${star}`}
                                    >
                                        ★
                                    </button>
                                ))}
                                <span className="rating-display">
                                    {hoverRating || userRating || 0}/10
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* YouTube Trailer */}
                {video.trailerUrl && (
                    <section className="trailer-section">
                        <h2>Bande-annonce</h2>
                        <div className="trailer-wrapper">
                            <iframe
                                src={video.trailerUrl}
                                title={`${video.title} - Trailer`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="trailer-iframe"
                                id="trailer-player"
                            />
                        </div>
                    </section>
                )}

                {/* Similar Content */}
                {similar.length > 0 && (
                    <VideoGrid videos={similar} title="Contenus similaires" />
                )}
            </div>
        </div>
    );
}
