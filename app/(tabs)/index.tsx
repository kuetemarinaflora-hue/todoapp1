import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTodos } from '@/context/TodoContext';

const categories = [
  { id: 'personal', name: 'Personal', color: '#4CAF50' },
  { id: 'work', name: 'Work', color: '#2196F3' },
  { id: 'shopping', name: 'Shopping', color: '#FF9800' },
   { id: 'fitness', name: 'Fitness', color: '#ff00c3' },

];

export default function Home() {
  const router = useRouter();
  const { todosByCategory } = useTodos();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
  <Text style={styles.title}>My Lists</Text>
  <TouchableOpacity onPress={() => router.push('/settings')}>
    <Text style={styles.settingsLink}>Settings</Text>
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
              style={[styles.card, { borderLeftColor: item.color }]}
              onPress={() => router.push({ pathname: '/[category]', params: { category: item.id } })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardText}>{item.name}</Text>
                <Text style={styles.percentText}>{percent}%</Text>
              </View>

              <Text style={styles.countText}>
                {total === 0 ? 'No tasks yet' : `${completed}/${total} done`}
              </Text>

              <View style={styles.progressTrack}>
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
  headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
},
settingsLink: {
  fontSize: 15,
  color: '#2196F3',
  fontWeight: '600',
},
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 12,
    borderRadius: 10,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  percentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  countText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 10,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});