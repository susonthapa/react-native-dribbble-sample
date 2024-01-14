import React, { useEffect } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Easing, useAnimatedReaction, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated";

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
  const ovalOffset = useSharedValue(0)
  const sliderOffset = useSharedValue(0)
  const maxLimit = (WIDTH * (1 - 0.375) - 12)
  const ovalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: ovalOffset.value }]
    }
  })

  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sliderOffset.value }]
    }
  })

  const pan = Gesture.Pan()
    .onChange((e) => {
      let currentValue = ovalOffset.value

      const updatedValue = currentValue + e.changeX
      if ((e.changeX > 0 && ovalOffset.value < maxLimit)) {
        currentValue = Math.min(maxLimit, updatedValue)
      } else if (e.changeX < 0 && ovalOffset.value > 0) {
        currentValue = Math.max(0, currentValue + e.changeX)
      }
      ovalOffset.value = currentValue
    })
    .onFinalize((e) => {
      let currentValue = ovalOffset.value
      const halfLimit = maxLimit / 2
      if (currentValue >= halfLimit) {
        currentValue = maxLimit
      } else {
        currentValue = 0
      }
      if (currentValue === 0) {
        ovalOffset.value = withSequence(
          withTiming(0),
          withDelay(100,
            getIdleAnimation()
          )
        )
      } else {
        ovalOffset.value = withTiming(currentValue, {
          easing: Easing.exp
        })
      }
    })

  useAnimatedReaction(() => {
    return ovalOffset.value
  }, (current, previous) => {
    if (current !== previous && current === maxLimit) {
      sliderOffset.value = withSequence(
        withTiming(15, { duration: 100 }),
        withSpring(0, {
          duration: 1000
        })
      )
    }
  })

  useEffect(() => {
    ovalOffset.value = getIdleAnimation()
  }, [])

  return (
    <Animated.View style={[{
      width: WIDTH,
      height: HEIGHT,
      borderRadius: HEIGHT / 2,
      borderColor: '#333358',
      borderWidth: 2,
      justifyContent: 'center',
      padding: 4,
    }, sliderStyle]}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[{
          backgroundColor: '#333358',
          width: WIDTH * 0.375,
          height: '100%',
          borderRadius: HEIGHT / 2
        }, ovalStyle]}>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}

export default LinearSlider