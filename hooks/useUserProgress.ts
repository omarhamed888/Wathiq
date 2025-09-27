import { useState, useEffect, useCallback, useMemo } from 'react';
import type { User, LearningModule } from '../types';

const USER_STORAGE_KEY = 'wathiq_user';
const COMPLETED_MODULES_KEY = 'wathiq_completed_modules';
const STATS_STORAGE_KEY = 'wathiq_stats';
// Key for storing the generated lesson content in localStorage.
// This acts as a persistent "database" to ensure content is generated only once.
const MODULE_CACHE_KEY = 'wathiq_module_cache';


const initialUser: User = {
  full_name: 'Alex Doe',
  email: 'alex.doe@example.com',
  level: 1,
  total_points: 0,
  age_group: 'adults',
  preferred_language: 'en',
  learning_progress: { current_streak: 0 },
  badges: []
};

const initialStats = {
    totalScans: 42, // Mocked for now
    averageTrustScore: 88, // Mocked for now
};

// Helper to get data from localStorage
const getStoredData = <T>(key: string, fallback: T): T => {
    try {
        const stored = window.localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return fallback;
    }
};

export const useUserProgress = () => {
    const [user, setUser] = useState<User>(() => getStoredData(USER_STORAGE_KEY, initialUser));
    const [completedModules, setCompletedModules] = useState<Set<string>>(() => new Set(getStoredData<string[]>(COMPLETED_MODULES_KEY, [])));
    const [stats, setStats] = useState(() => getStoredData(STATS_STORAGE_KEY, initialStats));
    // Caches generated lesson content (content and quiz) to localStorage.
    // This prevents redundant API calls and ensures content is generated only once.
    const [moduleCache, setModuleCache] = useState<Record<string, Pick<LearningModule, 'content' | 'quiz'>>>(() => getStoredData(MODULE_CACHE_KEY, {}));

    // Save user data to localStorage whenever it changes
    useEffect(() => {
        try {
            window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } catch (error) {
            console.error("Error saving user data to localStorage:", error);
        }
    }, [user]);

    // Save completed modules to localStorage
    useEffect(() => {
        try {
            window.localStorage.setItem(COMPLETED_MODULES_KEY, JSON.stringify(Array.from(completedModules)));
        } catch (error) {
            console.error("Error saving completed modules to localStorage:", error);
        }
    }, [completedModules]);
    
     // Save stats to localStorage
    useEffect(() => {
        try {
            window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
        } catch (error) {
            console.error("Error saving stats to localStorage:", error);
        }
    }, [stats]);

    // Save module cache to localStorage
    useEffect(() => {
        try {
            // This is where the generated content is persisted.
            window.localStorage.setItem(MODULE_CACHE_KEY, JSON.stringify(moduleCache));
        } catch (error) {
            console.error("Error saving module cache to localStorage:", error);
        }
    }, [moduleCache]);

    const cacheModuleContent = useCallback((moduleId: string, data: Pick<LearningModule, 'content' | 'quiz'>) => {
        setModuleCache(prev => ({
            ...prev,
            [moduleId]: data
        }));
    }, []);

    const completeModule = useCallback((moduleId: string, pointsAwarded: number) => {
        if (completedModules.has(moduleId)) return; // Don't award points twice

        setCompletedModules(prev => new Set(prev).add(moduleId));
        
        setUser(prevUser => {
            const newTotalPoints = prevUser.total_points + pointsAwarded;
            // Simple leveling system: new level every 500 points
            const newLevel = Math.floor(newTotalPoints / 500) + 1;
            return {
                ...prevUser,
                total_points: newTotalPoints,
                level: newLevel,
            };
        });

    }, [completedModules]);

    return useMemo(() => ({
        user,
        stats,
        completedModules,
        completeModule,
        moduleCache,
        cacheModuleContent,
    }), [user, stats, completedModules, completeModule, moduleCache, cacheModuleContent]);
};