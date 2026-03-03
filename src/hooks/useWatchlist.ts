import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from './useAuth';
import type { WatchlistItem } from '../models/types';

export function useWatchlist() {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useLocalStorage<WatchlistItem[]>('hd_watchlist', []);

    const userWatchlist = watchlist.filter((w) => w.userId === user?.id);

    const isInWatchlist = useCallback(
        (videoId: number) => userWatchlist.some((w) => w.videoId === videoId),
        [userWatchlist]
    );

    const addToWatchlist = useCallback(
        (videoId: number) => {
            if (!user) return;
            if (isInWatchlist(videoId)) return;
            const newItem: WatchlistItem = {
                id: `${user.id}_${videoId}_${Date.now()}`,
                userId: user.id,
                videoId,
                addedAt: new Date().toISOString(),
            };
            setWatchlist((prev) => [...prev, newItem]);
        },
        [user, isInWatchlist, setWatchlist]
    );

    const removeFromWatchlist = useCallback(
        (videoId: number) => {
            if (!user) return;
            setWatchlist((prev) => prev.filter((w) => !(w.userId === user.id && w.videoId === videoId)));
        },
        [user, setWatchlist]
    );

    const toggleWatchlist = useCallback(
        (videoId: number) => {
            if (isInWatchlist(videoId)) {
                removeFromWatchlist(videoId);
            } else {
                addToWatchlist(videoId);
            }
        },
        [isInWatchlist, addToWatchlist, removeFromWatchlist]
    );

    return { watchlist: userWatchlist, isInWatchlist, addToWatchlist, removeFromWatchlist, toggleWatchlist };
}
