import { useState, useEffect } from 'react';
import { useWatchlist } from '../hooks/useWatchlist';
import { getVideoDetail } from '../services/tmdb';
import VideoGrid from '../components/VideoGrid';
import type { Video } from '../models/types';
import { FiHeart } from 'react-icons/fi';

export default function Watchlist() {
    const { watchlist } = useWatchlist();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        const fetchVideos = async () => {
            try {
                const videoPromises = watchlist.map(async (item) => {
                    try {
                        // Try movie first, then TV
                        try {
                            return await getVideoDetail(item.videoId, 'movie');
                        } catch {
                            return await getVideoDetail(item.videoId, 'tv');
                        }
                    } catch {
                        return null;
                    }
                });

                const results = await Promise.all(videoPromises);
                if (!cancelled) {
                    setVideos(results.filter((v): v is Video => v !== null));
                }
            } catch (error) {
                console.error('Error fetching watchlist videos:', error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (watchlist.length === 0) {
            setLoading(false);
            setVideos([]);
        } else {
            fetchVideos();
        }

        return () => { cancelled = true; };
    }, [watchlist]);

    return (
        <div className="watchlist-page">
            <div className="page-header">
                <h1><FiHeart /> Ma Liste</h1>
                <p>{watchlist.length} contenu{watchlist.length !== 1 ? 's' : ''} dans votre liste</p>
            </div>

            {watchlist.length === 0 ? (
                <div className="empty-state large">
                    <FiHeart className="empty-icon" />
                    <h2>Votre liste est vide</h2>
                    <p>Ajoutez des films, séries ou documentaires à votre liste pour les retrouver facilement.</p>
                </div>
            ) : (
                <VideoGrid videos={videos} loading={loading} />
            )}
        </div>
    );
}
