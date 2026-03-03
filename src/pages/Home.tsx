import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid';
import { getTrending, getPopular, getTopRated, searchContent, getDocumentaries, getGenres } from '../services/tmdb';
import type { Video, Category, VideoType } from '../models/types';
import { FiFilter, FiTrendingUp } from 'react-icons/fi';

type SortOption = 'trending' | 'top_rated' | 'popular';

export default function Home() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState<VideoType | 'ALL'>('ALL');
    const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
    const [sortBy, setSortBy] = useState<SortOption>('trending');
    const [genres, setGenres] = useState<Category[]>([]);
    const [heroVideo, setHeroVideo] = useState<Video | null>(null);

    // Load genres
    useEffect(() => {
        getGenres('movie').then(setGenres).catch(() => { });
    }, []);

    // Fetch content based on filters
    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        const fetchData = async () => {
            try {
                let result: Video[] = [];

                if (searchQuery) {
                    const data = await searchContent(searchQuery);
                    result = data.videos;
                } else if (typeFilter === 'DOCUMENTAIRE') {
                    const data = await getDocumentaries();
                    result = data.videos;
                } else {
                    const mediaType = typeFilter === 'SERIE' ? 'tv' : 'movie';

                    if (sortBy === 'trending') {
                        const data = await getTrending(mediaType);
                        result = data.videos;
                    } else if (sortBy === 'top_rated') {
                        const data = await getTopRated(mediaType);
                        result = data.videos;
                    } else {
                        const data = await getPopular(mediaType);
                        result = data.videos;
                    }

                    if (typeFilter === 'ALL') {
                        // Also fetch TV trending to mix
                        const tvData = await getTrending('tv');
                        const docData = await getDocumentaries();
                        result = [...result, ...tvData.videos.slice(0, 6), ...docData.videos.slice(0, 4)];
                    }
                }

                // Apply category filter
                if (categoryFilter !== 'ALL') {
                    result = result.filter((v) => v.category === categoryFilter);
                }

                if (!cancelled) {
                    setVideos(result);
                    if (!heroVideo && result.length > 0) {
                        setHeroVideo(result[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching content:', error);
                if (!cancelled) setVideos([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [typeFilter, sortBy, searchQuery, categoryFilter]);

    const pageTitle = searchQuery
        ? `Résultats pour "${searchQuery}"`
        : typeFilter === 'ALL'
            ? 'Catalogue'
            : typeFilter === 'FILM'
                ? 'Films'
                : typeFilter === 'SERIE'
                    ? 'Séries'
                    : 'Documentaires';

    return (
        <div className="home-page">
            {/* Hero Section */}
            {!searchQuery && heroVideo && (
                <section className="hero-section" style={{ backgroundImage: `linear-gradient(to top, var(--bg-primary), transparent 60%), url(${heroVideo.thumbnailUrl.replace('w500', 'original')})` }}>
                    <div className="hero-content">
                        <span className="hero-badge">{heroVideo.type}</span>
                        <h1 className="hero-title">{heroVideo.title}</h1>
                        <p className="hero-desc">{heroVideo.description.slice(0, 200)}...</p>
                        <div className="hero-meta">
                            <span>⭐ {heroVideo.rating}</span>
                            <span>{heroVideo.releaseYear}</span>
                            <span>{heroVideo.category}</span>
                        </div>
                    </div>
                </section>
            )}

            {/* Filters */}
            <section className="filters-section">
                <div className="filters-container">
                    <div className="filter-group">
                        <FiFilter />
                        <label>Type :</label>
                        <div className="filter-buttons">
                            {(['ALL', 'FILM', 'SERIE', 'DOCUMENTAIRE'] as const).map((t) => (
                                <button
                                    key={t}
                                    className={`filter-btn ${typeFilter === t ? 'active' : ''}`}
                                    onClick={() => setTypeFilter(t)}
                                    id={`filter-type-${t.toLowerCase()}`}
                                >
                                    {t === 'ALL' ? 'Tous' : t === 'FILM' ? 'Films' : t === 'SERIE' ? 'Séries' : 'Documentaires'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Catégorie :</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="filter-select"
                            id="filter-category"
                        >
                            <option value="ALL">Toutes</option>
                            {genres.map((g) => (
                                <option key={g.id} value={g.name}>{g.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <FiTrendingUp />
                        <label>Tri :</label>
                        <div className="filter-buttons">
                            {([
                                { key: 'trending' as SortOption, label: 'Tendances' },
                                { key: 'top_rated' as SortOption, label: 'Mieux notés' },
                                { key: 'popular' as SortOption, label: 'Populaires' },
                            ]).map((s) => (
                                <button
                                    key={s.key}
                                    className={`filter-btn ${sortBy === s.key ? 'active' : ''}`}
                                    onClick={() => setSortBy(s.key)}
                                    id={`sort-${s.key}`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <VideoGrid videos={videos} title={pageTitle} loading={loading} />
        </div>
    );
}
