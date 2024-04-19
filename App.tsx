import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import * as TaskManager from 'expo-task-manager'
import * as BackgroundFetch from 'expo-background-fetch'

const save = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.ALWAYS,
  })
}

const BACKGROUND_FETCH_TASK = 'background-fetch'

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now()

  console.log(
    `${new Date(now).toISOString()} - Attempting to read from SecureStore`
  )

  try {
    const value = await SecureStore.getItemAsync('my-key', {
      keychainAccessible: SecureStore.ALWAYS,
    })
    console.log(`SecureStore value: ${value || 'null'}`)
  } catch (error) {
    throw new Error(`Failed to read from SecureStore: ${error}`)
  }

  return BackgroundFetch.BackgroundFetchResult.NewData
})

export default function App() {
  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 5, // 5 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    })
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style='auto' />
      <Button
        title='Save'
        onPress={() => {
          save('my-key', 'This is my secret value!')
          registerBackgroundFetchAsync()
          console.log('👪', 'Saved')
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
