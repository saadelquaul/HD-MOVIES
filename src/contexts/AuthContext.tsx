import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '../models/types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => { success: boolean; error?: string };
    register: (username: string, email: string, password: string) => { success: boolean; error?: string };
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const stored = localStorage.getItem('hd_current_user');
            return stored ? (JSON.parse(stored) as User) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('hd_current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('hd_current_user');
        }
    }, [user]);

    const getUsers = (): User[] => {
        try {
            const stored = localStorage.getItem('hd_users');
            return stored ? (JSON.parse(stored) as User[]) : [];
        } catch {
            return [];
        }
    };

    const saveUsers = (users: User[]) => {
        localStorage.setItem('hd_users', JSON.stringify(users));
    };

    const login = useCallback((email: string, password: string) => {
        const users = getUsers();
        const found = users.find((u) => u.email === email && u.password === password);
        if (found) {
            setUser(found);
            return { success: true };
        }
        return { success: false, error: 'Email ou mot de passe incorrect.' };
    }, []);

    const register = useCallback((username: string, email: string, password: string) => {
        const users = getUsers();
        if (users.find((u) => u.email === email)) {
            return { success: false, error: 'Cet email est déjà utilisé.' };
        }
        if (users.find((u) => u.username === username)) {
            return { success: false, error: "Ce nom d'utilisateur est déjà pris." };
        }
        const newUser: User = {
            id: `user_${Date.now()}`,
            username,
            email,
            password,
        };
        saveUsers([...users, newUser]);
        setUser(newUser);
        return { success: true };
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}
