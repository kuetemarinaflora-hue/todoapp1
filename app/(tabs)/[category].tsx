import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTodos } from '@/context/TodoContext';
import { useAppTheme } from '@/context/ThemeContext';

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [task, setTask] = useState('');
  const { todosByCategory, addTodo, toggleComplete, deleteTodo } = useTodos();
  const { colors } = useAppTheme();

  const todos = todosByCategory[category] || [];

  const handleAdd = () => {
    if (task.trim() === '') return;
    addTodo(category, task);
    setTask('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: category, headerShown: true }} />

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Add a new task..."
          placeholderTextColor={colors.subtext}
          value={task}
          onChangeText={setTask}
        />
        <Button title="Add" onPress={handleAdd} />
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.todoItem, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.todoTextWrapper} onPress={() => toggleComplete(category, item.id)}>
              <Text style={[styles.todoText, { color: colors.text }, item.completed && styles.todoTextCompleted]}>
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(category, item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16 },
  todoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, marginBottom: 10, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  todoTextWrapper: { flex: 1 },
  todoText: { fontSize: 16 },
  todoTextCompleted: { textDecorationLine: 'line-through', color: '#aaa' },
  deleteText: { color: '#e74c3c', fontWeight: '600', marginLeft: 10 },
});