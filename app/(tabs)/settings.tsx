import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Switch, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';

export default function Settings() {
  const [username, setUsername] = useState('Marina');
  const [email, setEmail] = useState('marina@email.com');
  const { isDark, toggleTheme, colors } = useAppTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Settings', headerShown: true }} />

      <Text style={[styles.sectionLabel, { color: colors.subtext }]}>PROFILE</Text>

      <View style={[styles.row, { backgroundColor: colors.card }]}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>Username</Text>
        <TextInput
          style={[styles.rowInput, { color: colors.subtext }]}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={[styles.row, { backgroundColor: colors.card }]}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>Email</Text>
        <TextInput
          style={[styles.rowInput, { color: colors.subtext }]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={[styles.sectionLabel, { color: colors.subtext }]}>PREFERENCES</Text>

      <View style={[styles.row, { backgroundColor: colors.card }]}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  rowLabel: {
    fontSize: 15,
  },
  rowInput: {
    fontSize: 15,
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
});