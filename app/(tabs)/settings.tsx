import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Switch, ScrollView } from 'react-native';
import { Stack } from 'expo-router';

export default function Settings() {
  const [username, setUsername] = useState('Marina');
  const [email, setEmail] = useState('marina@email.com');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Settings', headerShown: true }} />

      <Text style={styles.sectionLabel}>PROFILE</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Username</Text>
        <TextInput
          style={styles.rowInput}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Email</Text>
        <TextInput
          style={styles.rowInput}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.sectionLabel}>PREFERENCES</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    marginTop: 20,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  rowLabel: {
    fontSize: 15,
    color: '#222',
  },
  rowInput: {
    fontSize: 15,
    color: '#555',
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
});