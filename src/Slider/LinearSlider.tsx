import React, { useEffect } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated";

const WIDTH = 200
const HEIGHT = 70

function getIdleAnimation() {
  "worklet"
  return withRepeat(withSequence(
    withTiming(15, {
      duration: 400,
      easing: Easing.ease
    }),
    withSpring(0, {
      duration: 1000,
      stiffness: 1000,
      overshootClamping: true
    }),
  ), -1)
}


const LinearSlider = () => {
  const offset = useSharedValue(0)
  const ovalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }]
    }
  })

  const pan = Gesture.Pan()
    .onChange((e) => {
      let currentValue = offset.value

      const maxLimit = (WIDTH * (1 - 0.375) - 12)
      const updatedValue = currentValue + e.changeX
      if ((e.changeX > 0 && offset.value < maxLimit)) {
        currentValue = Math.min(maxLimit, updatedValue)
      } else if (e.changeX < 0 && offset.value > 0) {
        currentValue = Math.max(0, currentValue + e.changeX)
      }
      offset.value = currentValue
    })
    .onFinalize((e) => {
      let currentValue = offset.value
      const maxLimit = (WIDTH * (1 - 0.375) - 12)
      const halfLimit = maxLimit / 2
      if (currentValue >= halfLimit) {
        currentValue = maxLimit
      } else {
        currentValue = 0
      }
      if (currentValue === 0) {
        offset.value = withSequence(
          withTiming(0),
          withDelay(100,
            getIdleAnimation()
          )
        )
      } else {
        offset.value = withTiming(currentValue)
      }
    })


  useEffect(() => {
    offset.value = getIdleAnimation()
  }, [])

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