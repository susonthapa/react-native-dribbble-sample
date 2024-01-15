import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Easing, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated";
import ArrowRight from "./ArrowRight";
import Ripple from "./Ripple";

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
  const [isChecked, setIsChecked] = useState<boolean | undefined>(undefined)
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
        runOnJS(setIsChecked)(false)
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
      runOnJS(setIsChecked)(true)
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
      backgroundColor: 'white',
      shadowColor: '#333358',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 8
    }, sliderStyle]}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[{
          backgroundColor: '#333358',
          width: WIDTH * 0.375,
          height: '100%',
          borderRadius: HEIGHT / 2,
          overflow: 'hidden',
        }, ovalStyle]}>
          <View style={{
            padding: 12,
          }}>
            <ArrowRight animateToTick={isChecked} />
          </View>
          <Ripple enableAnimation={isChecked ?? false} style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }} />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}

export default LinearSlider