import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LinearSlider from './src/Slider/LinearSlider';
import UploadButton, { UploadButtonHandle } from './src/UploadButton/UploadButton';

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
    <GestureHandlerRootView style={{
      width: '100%',
      height: '100%'
    }}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={{ justifyContent: 'space-evenly', flex: 1, alignItems: 'center' }}>
          <LinearSlider />
          <UploadButton ref={linerButtonRef} onPress={linearProgress} />
          <UploadButton ref={intermittentButtonRef} onPress={intermittentProgress} />
        </View>
      </View>
    </GestureHandlerRootView>
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
