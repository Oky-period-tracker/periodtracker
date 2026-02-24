import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { verifyDatabaseData, resetDatabase } from '../services/sqlite/database'

export function DebugDatabaseScreen() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkDatabase = async () => {
    setLoading(true)
    try {
      const result = await verifyDatabaseData()
      setData(result)
    } catch (error) {
      Alert.alert('Error', `Failed to check database: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const clearDatabase = async () => {
    Alert.alert(
      'Clear Database',
      'Are you sure? This will delete all accounts and app state. The app will need to restart.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              setLoading(true)
              await resetDatabase()
              setData(null)
              Alert.alert('Success', 'Database cleared! Please restart the app now.', [
                {
                  text: 'OK',
                  onPress: () => {
                    // Force app to reload by clearing module cache
                    // This is a workaround since we can't directly restart
                  },
                },
              ])
            } catch (error) {
              Alert.alert('Error', `Failed to clear database: ${error}`)
            } finally {
              setLoading(false)
            }
          },
          style: 'destructive',
        },
      ]
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Database Debug</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={checkDatabase}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Checking...' : 'Check Database'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonClear, loading && styles.buttonDisabled]}
        onPress={clearDatabase}
        disabled={loading}
      >
        <Text style={styles.buttonText}>🗑️ Clear All Data</Text>
      </TouchableOpacity>

      {data && (
        <View style={styles.dataContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Users ({data.userCount})</Text>
            {data.users.length > 0 ? (
              data.users.map((user: any, idx: number) => (
                <View key={idx} style={styles.item}>
                  <Text style={styles.itemText}>
                    <Text style={styles.label}>Username:</Text> {user.name || '(empty)'} | Raw: {JSON.stringify(user.name)}
                  </Text>
                  <Text style={styles.itemText}>
                    <Text style={styles.label}>ID:</Text> {user.id}
                  </Text>
                  <Text style={styles.itemText}>
                    <Text style={styles.label}>Token:</Text> {user.appToken ? 'YES' : 'NO'}
                  </Text>
                  <Text style={styles.itemText}>
                    <Text style={styles.label}>PendingSync:</Text>{' '}
                    {user.isPendingSync ? 'YES' : 'SYNCED'}
                  </Text>
                  <Text style={styles.itemText}>
                    <Text style={styles.label}>Created:</Text> {user.createdAt}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No users found</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App States ({data.appStateCount})</Text>
            {data.appStates.length > 0 ? (
              data.appStates.map((state: any, idx: number) => (
                <View key={idx} style={styles.item}>
                  <Text style={styles.itemText}>
                    <Text style={styles.label}>UserId:</Text> {state.userId}
                  </Text>
                  <Text style={styles.itemText}>
                    <Text style={styles.label}>Version:</Text> {state.storeVersion}
                  </Text>
                  <Text style={styles.itemText}>
                    <Text style={styles.label}>Updated:</Text> {state.updatedAt}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No app states found</Text>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonClear: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dataContainer: {
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
})
