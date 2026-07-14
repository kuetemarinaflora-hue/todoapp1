import { createContext, useContext, useState, ReactNode } from 'react';

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

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todosByCategory, setTodosByCategory] = useState<TodosByCategory>({});

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