import React, { FC } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

const WIDTH = 200
const HEIGHT = 70

const LinearSlider = () => {
  const offset = useSharedValue(0)

  const ovalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }]
    }
  })

  const pan = Gesture.Pan()
    .onChange((e) => {
      if (e.translationX > 0) {
        const maxLimit = (WIDTH * (1 - 0.375) - 8)
        if (e.translationX < maxLimit) {
          offset.value = e.translationX
        }
      }

    })
    .onFinalize(() => {
    })
  return (
    <View style={{
      width: WIDTH,
      height: HEIGHT,
      borderRadius: HEIGHT / 2,
      borderColor: '#333358',
      borderWidth: 2,
      justifyContent: 'center',
      padding: 4,
    }}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[{
          backgroundColor: '#333358',
          width: WIDTH * 0.375,
          height: '100%',
          borderRadius: HEIGHT / 2
        }, ovalStyle]}>
        </Animated.View>
      </GestureDetector>

    </View>
  )
}

export default LinearSlider