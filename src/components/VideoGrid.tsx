import VideoCard from './VideoCard';
import type { Video } from '../models/types';

interface VideoGridProps {
    videos: Video[];
    title?: string;
    loading?: boolean;
}

export default function VideoGrid({ videos, title, loading }: VideoGridProps) {
    if (loading) {
        return (
            <section className="video-grid-section">
                {title && <h2 className="section-title">{title}</h2>}
                <div className="video-grid">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="video-card skeleton">
                            <div className="skeleton-poster" />
                            <div className="skeleton-info">
                                <div className="skeleton-line wide" />
                                <div className="skeleton-line narrow" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (videos.length === 0) {
        return (
            <section className="video-grid-section">
                {title && <h2 className="section-title">{title}</h2>}
                <div className="empty-state">
                    <p>Aucun contenu trouvé.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="video-grid-section">
            {title && <h2 className="section-title">{title}</h2>}
            <div className="video-grid">
                {videos.map((video) => (
                    <VideoCard key={`${video.type}-${video.id}`} video={video} />
                ))}
            </div>
        </section>
    );
}
