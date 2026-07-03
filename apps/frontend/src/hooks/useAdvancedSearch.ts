import { useState, useEffect, useCallback } from 'react';

interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, any>;
}

export function useAdvancedSearch<T extends Record<string, any>>(
  storageKey: string,
  defaultFilters: T
) {
  const [filters, setFilters] = useState<T>(() => {
    try {
    const saved = localStorage.getItem(`lumis-${storageKey}-filters`);
      return saved ? { ...defaultFilters, ...JSON.parse(saved) } : defaultFilters;
    } catch {
      return defaultFilters;
    }
  });

  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => {
    try {
    const saved = localStorage.getItem(`lumis-${storageKey}-saved`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [query, setQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(`lumis-${storageKey}-filters`, JSON.stringify(filters));
  }, [filters, storageKey]);

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setQuery('');
  }, [defaultFilters]);

  const saveCurrentFilter = useCallback((name: string) => {
    const newSaved: SavedFilter = {
      id: Date.now().toString(),
      name,
      filters: { ...filters, query },
    };
    const updated = [...savedFilters, newSaved].slice(-10); // max 10
    setSavedFilters(updated);
    localStorage.setItem(`lumis-${storageKey}-saved`, JSON.stringify(updated));
  }, [filters, query, savedFilters, storageKey]);

  const loadSavedFilter = useCallback((id: string) => {
    const found = savedFilters.find(f => f.id === id);
    if (found) {
      setFilters(prev => ({ ...prev, ...found.filters }));
      setQuery(found.filters.query || '');
    }
  }, [savedFilters]);

  const removeSavedFilter = useCallback((id: string) => {
    const updated = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem(`ferramenta-${storageKey}-saved`, JSON.stringify(updated));
  }, [savedFilters, storageKey]);

  const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(defaultFilters) || query.length > 0;

  return {
    query,
    setQuery,
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    savedFilters,
    saveCurrentFilter,
    loadSavedFilter,
    removeSavedFilter,
  };
}