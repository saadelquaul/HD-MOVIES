import { Link } from 'react-router-dom';
import { FiStar, FiCalendar } from 'react-icons/fi';
import type { Video } from '../models/types';

interface VideoCardProps {
    video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
    const mediaType = video.type === 'FILM' || video.type === 'DOCUMENTAIRE' ? 'movie' : 'tv';

    const typeBadgeClass =
        video.type === 'FILM'
            ? 'badge-film'
            : video.type === 'SERIE'
                ? 'badge-serie'
                : 'badge-doc';

    return (
        <Link to={`/video/${mediaType}/${video.id}`} className="video-card" id={`video-card-${video.id}`}>
            <div className="video-card-poster">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    loading="lazy"
                />
                <div className="video-card-overlay">
                    <span className="play-icon">▶</span>
                </div>
                <span className={`type-badge ${typeBadgeClass}`}>{video.type}</span>
            </div>
            <div className="video-card-info">
                <h3 className="video-card-title">{video.title}</h3>
                <div className="video-card-meta">
                    <span className="video-rating">
                        <FiStar className="star-icon" /> {video.rating}
                    </span>
                    <span className="video-year">
                        <FiCalendar /> {video.releaseYear || '—'}
                    </span>
                </div>
                <span className="video-category">{video.category}</span>
            </div>
        </Link>
    );
}
