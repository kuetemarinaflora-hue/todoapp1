import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

type CategoryContextType = {
  categories: Category[];
  addCategory: (name: string, icon?: string, color?: string) => void;
  renameCategory: (id: string, newName: string) => void;
  deleteCategory: (id: string) => void;
};

const STORAGE_KEY = "CATEGORIES_DATA";

export const COLOR_PALETTE = [
  "#4CAF50",
  "#2196F3",
  "#FF9800",
  "#9C27B0",
  "#E91E63",
  "#00BCD4",
  "#795548",
];
export const ICON_PALETTE = [
  "person",
  "briefcase",
  "cart",
  "book",
  "film",
  "game-controller",
  "home",
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: "personal", name: "Personal", color: "#4CAF50", icon: "person" },
  { id: "work", name: "Work", color: "#2196F3", icon: "briefcase" },
  { id: "shopping", name: "Shopping", color: "#FF9800", icon: "cart" },
];

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined,
);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: Category[] = JSON.parse(saved);
          const migrated = parsed.map((c, index) => ({
            ...c,
            icon: c.icon || ICON_PALETTE[index % ICON_PALETTE.length],
          }));
          setCategories(migrated);
        }
      } catch (e) {
        console.error("Failed to load categories", e);
      } finally {
        setLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(categories)).catch((e) =>
      console.error("Failed to save categories", e),
    );
  }, [categories, loaded]);

  const addCategory = (name: string, icon?: string, color?: string) => {
    const index = categories.length % COLOR_PALETTE.length;
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color: color || COLOR_PALETTE[index],
      icon: icon || ICON_PALETTE[index],
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const renameCategory = (id: string, newName: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c)),
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CategoryContext.Provider
      value={{ categories, addCategory, renameCategory, deleteCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context)
    throw new Error("useCategories must be used within a CategoryProvider");
  return context;
}
