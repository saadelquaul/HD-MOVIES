import type { Video, Category, VideoType } from '../models/types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

if (!API_KEY) {
    console.warn(
        '⚠️ TMDb API key is missing! Create a .env file with VITE_TMDB_API_KEY=your_key.\n' +
        'Get your free API key at: https://www.themoviedb.org/settings/api'
    );
}

const GENRE_MAP: Record<number, string> = {
    28: 'Action',
    12: 'Aventure',
    16: 'Animation',
    35: 'Comédie',
    80: 'Crime',
    99: 'Documentaire',
    18: 'Drame',
    10751: 'Famille',
    14: 'Fantaisie',
    36: 'Histoire',
    27: 'Horreur',
    10402: 'Musique',
    9648: 'Mystère',
    10749: 'Romance',
    878: 'Science-Fiction',
    10770: 'Téléfilm',
    53: 'Thriller',
    10752: 'Guerre',
    37: 'Western',
    10759: 'Action',
    10762: 'Enfants',
    10763: 'Actualités',
    10764: 'Réalité',
    10765: 'Science-Fiction',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'Guerre',
};

async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDb API error: ${res.status}`);
    return res.json() as Promise<T>;
}

interface TMDbMovie {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    genre_ids: number[];
    popularity: number;
    runtime?: number;
}

interface TMDbMovieDetail {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    genres: { id: number; name: string }[];
    popularity: number;
    runtime?: number;
    episode_run_time?: number[];
    credits?: {
        cast: { name: string; order: number }[];
        crew: { name: string; job: string }[];
    };
    videos?: {
        results: { key: string; site: string; type: string }[];
    };
    similar?: {
        results: TMDbMovie[];
    };
}

interface TMDbResponse {
    results: TMDbMovie[];
    total_pages: number;
    total_results: number;
}

function mapToVideo(item: TMDbMovie, mediaType: VideoType): Video {
    const year = item.release_date
        ? parseInt(item.release_date.substring(0, 4))
        : item.first_air_date
            ? parseInt(item.first_air_date.substring(0, 4))
            : 0;

    return {
        id: item.id,
        title: item.title || item.name || 'Sans titre',
        description: item.overview || 'Aucune description disponible.',
        thumbnailUrl: item.poster_path ? `${IMG_BASE}${item.poster_path}` : '/placeholder.jpg',
        trailerUrl: '',
        duration: item.runtime || 0,
        releaseYear: year,
        type: mediaType,
        category: item.genre_ids?.length ? (GENRE_MAP[item.genre_ids[0]] || 'Autre') : 'Autre',
        rating: Math.round(item.vote_average * 10) / 10,
        director: '',
        cast: [],
        popularity: item.popularity,
    };
}

export async function getTrending(mediaType: 'movie' | 'tv' = 'movie', page = 1): Promise<{ videos: Video[]; totalPages: number }> {
    const data = await fetchJSON<TMDbResponse>(
        `${BASE_URL}/trending/${mediaType}/week?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    const type: VideoType = mediaType === 'movie' ? 'FILM' : 'SERIE';
    return {
        videos: data.results.map((m) => mapToVideo(m, type)),
        totalPages: data.total_pages,
    };
}

export async function getPopular(mediaType: 'movie' | 'tv' = 'movie', page = 1): Promise<{ videos: Video[]; totalPages: number }> {
    const data = await fetchJSON<TMDbResponse>(
        `${BASE_URL}/${mediaType}/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    const type: VideoType = mediaType === 'movie' ? 'FILM' : 'SERIE';
    return {
        videos: data.results.map((m) => mapToVideo(m, type)),
        totalPages: data.total_pages,
    };
}

export async function getTopRated(mediaType: 'movie' | 'tv' = 'movie', page = 1): Promise<{ videos: Video[]; totalPages: number }> {
    const data = await fetchJSON<TMDbResponse>(
        `${BASE_URL}/${mediaType}/top_rated?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    const type: VideoType = mediaType === 'movie' ? 'FILM' : 'SERIE';
    return {
        videos: data.results.map((m) => mapToVideo(m, type)),
        totalPages: data.total_pages,
    };
}

export async function searchContent(query: string, page = 1): Promise<{ videos: Video[]; totalPages: number }> {
    const data = await fetchJSON<TMDbResponse>(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=${page}`
    );
    return {
        videos: data.results
            .filter((m) => m.poster_path)
            .map((m) => {
                const isTV = !!(m.first_air_date || m.name);
                return mapToVideo(m, isTV ? 'SERIE' : 'FILM');
            }),
        totalPages: data.total_pages,
    };
}

export async function getVideoDetail(id: number, mediaType: 'movie' | 'tv'): Promise<Video> {
    const data = await fetchJSON<TMDbMovieDetail>(
        `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits,videos,similar`
    );

    const trailer = data.videos?.results.find(
        (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );

    const director = data.credits?.crew.find((c) => c.job === 'Director')?.name || '';
    const cast = data.credits?.cast
        .sort((a, b) => a.order - b.order)
        .slice(0, 10)
        .map((c) => c.name) || [];

    const year = data.release_date
        ? parseInt(data.release_date.substring(0, 4))
        : data.first_air_date
            ? parseInt(data.first_air_date.substring(0, 4))
            : 0;

    const type: VideoType = mediaType === 'movie' ? 'FILM' : 'SERIE';

    return {
        id: data.id,
        title: data.title || data.name || 'Sans titre',
        description: data.overview || 'Aucune description disponible.',
        thumbnailUrl: data.poster_path ? `${IMG_BASE}${data.poster_path}` : '/placeholder.jpg',
        trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : '',
        duration: data.runtime || (data.episode_run_time?.[0] ?? 0),
        releaseYear: year,
        type,
        category: data.genres?.[0]?.name || 'Autre',
        rating: Math.round(data.vote_average * 10) / 10,
        director,
        cast,
        popularity: data.popularity,
    };
}

export async function getSimilar(id: number, mediaType: 'movie' | 'tv'): Promise<Video[]> {
    const data = await fetchJSON<TMDbResponse>(
        `${BASE_URL}/${mediaType}/${id}/similar?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    const type: VideoType = mediaType === 'movie' ? 'FILM' : 'SERIE';
    return data.results.slice(0, 12).map((m) => mapToVideo(m, type));
}

export async function getByGenre(genreId: number, mediaType: 'movie' | 'tv' = 'movie', page = 1): Promise<{ videos: Video[]; totalPages: number }> {
    const data = await fetchJSON<TMDbResponse>(
        `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&language=fr-FR&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    );
    const type: VideoType = mediaType === 'movie' ? 'FILM' : 'SERIE';
    return {
        videos: data.results.map((m) => mapToVideo(m, type)),
        totalPages: data.total_pages,
    };
}

export async function getGenres(mediaType: 'movie' | 'tv' = 'movie'): Promise<Category[]> {
    const data = await fetchJSON<{ genres: { id: number; name: string }[] }>(
        `${BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}&language=fr-FR`
    );
    return data.genres.map((g) => ({ id: g.id, name: g.name }));
}

export async function getDocumentaries(page = 1): Promise<{ videos: Video[]; totalPages: number }> {
    const data = await fetchJSON<TMDbResponse>(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR&with_genres=99&page=${page}&sort_by=popularity.desc`
    );
    return {
        videos: data.results.map((m) => mapToVideo(m, 'DOCUMENTAIRE')),
        totalPages: data.total_pages,
    };
}
