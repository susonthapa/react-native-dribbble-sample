import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import UploadButton, { UploadButtonHandle } from './src/UploadButton';

export default function App() {
  const linerButtonRef = useRef<UploadButtonHandle>(null)
  const intermittentButtonRef = useRef<UploadButtonHandle>(null)

  const linearProgress = () => {
    setTimeout(() => {
      for (let i = 0; i <= 100; i++) {
        setTimeout(() => {
          linerButtonRef.current?.setProgress(i)
        }, 5 * i)
      }
    }, 1000)
  }

  const intermittentProgress = () => {
    setTimeout(() => {
      for (let i = 0; i <= 100; i += 25) {
        setTimeout(() => {
          intermittentButtonRef.current?.setProgress(i)
        }, 30 * i)
      }
    }, 1000)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ justifyContent: 'space-evenly', flex: 1 }}>
        <UploadButton ref={linerButtonRef} onPress={linearProgress} />
        <UploadButton ref={intermittentButtonRef} onPress={intermittentProgress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
