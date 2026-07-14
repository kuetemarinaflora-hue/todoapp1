import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTodos } from '@/context/TodoContext';
import { useAppTheme } from '@/context/ThemeContext';
import { useCategories } from '@/context/CategoryContext';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();
  const { todosByCategory } = useTodos();
  const { colors } = useAppTheme();
  const { categories, addCategory, renameCategory, deleteCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    addCategory(newCategoryName.trim());
    setNewCategoryName('');
  };

  const handleLongPress = (id: string, currentName: string) => {
    Alert.alert(currentName, 'What do you want to do?', [
      {
        text: 'Rename',
        onPress: () => {
          Alert.prompt(
            'Rename list',
            undefined,
            (text) => {
              if (text && text.trim() !== '') renameCategory(id, text.trim());
            },
            'plain-text',
            currentName
          );
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteCategory(id),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>My Lists</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Text style={styles.settingsLink}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="New list name..."
          placeholderTextColor={colors.subtext}
          value={newCategoryName}
          onChangeText={setNewCategoryName}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const todos = todosByCategory[item.id] || [];
          const total = todos.length;
          const completed = todos.filter((t) => t.completed).length;
          const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

          return (
            <TouchableOpacity
              style={[styles.card, { borderLeftColor: item.color, backgroundColor: colors.card }]}
              onPress={() => router.push({ pathname: '/[category]', params: { category: item.id } })}
              onLongPress={() => handleLongPress(item.id, item.name)}
            >
             <View style={styles.cardHeader}>
  <View style={styles.cardTitleRow}>
    <View style={[styles.iconBubble, { backgroundColor: item.color + '22' }]}>
      <Ionicons name={item.icon as any} size={18} color={item.color} />
    </View>
    <Text style={[styles.cardText, { color: colors.text }]}>{item.name}</Text>
  </View>
  <Text style={[styles.percentText, { color: colors.subtext }]}>{percent}%</Text>
</View>

              <Text style={[styles.countText, { color: colors.subtext }]}>
                {total === 0 ? 'No tasks yet' : `${completed}/${total} done`}
              </Text>

              <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${percent}%`, backgroundColor: item.color },
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  settingsLink: { fontSize: 15, color: '#2196F3', fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16 },
  addButton: { backgroundColor: '#2196F3', width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  card: { padding: 18, marginBottom: 12, borderRadius: 10, borderLeftWidth: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardText: { fontSize: 18, fontWeight: '600' },
  percentText: { fontSize: 14, fontWeight: '600' },
  countText: { fontSize: 13, marginBottom: 10 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
iconBubble: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});