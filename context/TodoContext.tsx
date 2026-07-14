import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type TodosByCategory = {
  [category: string]: Todo[];
};

type TodoContextType = {
  todosByCategory: TodosByCategory;
  addTodo: (category: string, text: string) => void;
  toggleComplete: (category: string, id: string) => void;
  deleteTodo: (category: string, id: string) => void;
};

const STORAGE_KEY = 'TODO_APP_DATA';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todosByCategory, setTodosByCategory] = useState<TodosByCategory>({});
  const [loaded, setLoaded] = useState(false);

  // Load saved data once when the app starts
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setTodosByCategory(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load todos', e);
      } finally {
        setLoaded(true);
      }
    };
    loadData();
  }, []);

  // Save data every time it changes (but not on the very first load)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todosByCategory)).catch((e) =>
      console.error('Failed to save todos', e)
    );
  }, [todosByCategory, loaded]);

  const addTodo = (category: string, text: string) => {
    const newTodo: Todo = { id: Date.now().toString(), text, completed: false };
    setTodosByCategory((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), newTodo],
    }));
  };

  const toggleComplete = (category: string, id: string) => {
    setTodosByCategory((prev) => ({
      ...prev,
      [category]: prev[category].map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  const deleteTodo = (category: string, id: string) => {
    setTodosByCategory((prev) => ({
      ...prev,
      [category]: prev[category].filter((t) => t.id !== id),
    }));
  };

  return (
    <TodoContext.Provider value={{ todosByCategory, addTodo, toggleComplete, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) throw new Error('useTodos must be used within a TodoProvider');
  return context;
}