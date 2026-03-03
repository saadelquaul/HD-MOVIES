import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { useDebounce } from '../hooks/useDebounce';
import { searchContent } from '../services/tmdb';
import type { Video } from '../models/types';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Video[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debouncedQuery = useDebounce(query, 400);
    const navigate = useNavigate();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (debouncedQuery.trim().length < 2) {
            setSuggestions([]);
            return;
        }
        let cancelled = false;
        searchContent(debouncedQuery, 1).then(({ videos }) => {
            if (!cancelled) {
                setSuggestions(videos.slice(0, 6));
                setShowSuggestions(true);
            }
        }).catch(() => {
            if (!cancelled) setSuggestions([]);
        });
        return () => { cancelled = true; };
    }, [debouncedQuery]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (video: Video) => {
        const mediaType = video.type === 'FILM' ? 'movie' : 'tv';
        navigate(`/video/${mediaType}/${video.id}`);
        setQuery('');
        setShowSuggestions(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/?search=${encodeURIComponent(query.trim())}`);
            setShowSuggestions(false);
        }
    };

    return (
        <div className="search-bar-wrapper" ref={wrapperRef}>
            <form className="search-bar" onSubmit={handleSubmit}>
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Rechercher un film, série, documentaire..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    className="search-input"
                    id="search-input"
                />
                {query && (
                    <button type="button" className="search-clear" onClick={() => { setQuery(''); setSuggestions([]); }}>
                        <FiX />
                    </button>
                )}
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions">
                    {suggestions.map((video) => (
                        <button key={video.id} className="suggestion-item" onClick={() => handleSelect(video)}>
                            <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="suggestion-thumb"
                            />
                            <div className="suggestion-info">
                                <span className="suggestion-title">{video.title}</span>
                                <span className="suggestion-meta">
                                    {video.releaseYear} · {video.type} · ⭐ {video.rating}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
