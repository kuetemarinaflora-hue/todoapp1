import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Category = {
  id: string;
  name: string;
  color: string;
};

type CategoryContextType = {
  categories: Category[];
  addCategory: (name: string) => void;
  renameCategory: (id: string, newName: string) => void;
  deleteCategory: (id: string) => void;
};

const STORAGE_KEY = 'CATEGORIES_DATA';

const PALETTE = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#E91E63', '#00BCD4', '#795548'];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'personal', name: 'Personal', color: '#4CAF50' },
  { id: 'work', name: 'Work', color: '#2196F3' },
  { id: 'shopping', name: 'Shopping', color: '#FF9800' },
];

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setCategories(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load categories', e);
      } finally {
        setLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(categories)).catch((e) =>
      console.error('Failed to save categories', e)
    );
  }, [categories, loaded]);

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color: PALETTE[categories.length % PALETTE.length],
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const renameCategory = (id: string, newName: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, renameCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategories must be used within a CategoryProvider');
  return context;
}