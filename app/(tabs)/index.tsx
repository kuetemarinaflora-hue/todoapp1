import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export default function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = () => {
    if (task.trim() === '') return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: task,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setTask('');
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My To-Do List</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          value={task}
          onChangeText={setTask}
        />
        <Button title="Add" onPress={addTodo} />
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity style={styles.todoTextWrapper} onPress={() => toggleComplete(item.id)}>
              <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  todoTextWrapper: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteText: {
    color: 'red',
    marginLeft: 10,
  },
});