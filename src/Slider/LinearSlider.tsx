import React, { FC, useEffect, useState } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Easing, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated";
import ArrowRight from "./ArrowRight";
import Ripple from "./Ripple";

const KNOB_WIDTH_FACTOR = 0.375
const PRIMARY_COLOR = '#333358'

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

type Props = {
  width?: number,
  height?: number,
}

const LinearSlider: FC<Props> = ({ width = 225, height = 70 }) => {
  const [isChecked, setIsChecked] = useState<boolean | undefined>(undefined)
  const ovalOffset = useSharedValue(0)
  const sliderOffset = useSharedValue(0)
  const maxKnobLimit = (width * (1 - 0.375) - 12)
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
      if ((e.changeX > 0 && ovalOffset.value < maxKnobLimit)) {
        currentValue = Math.min(maxKnobLimit, updatedValue)
      } else if (e.changeX < 0 && ovalOffset.value > 0) {
        currentValue = Math.max(0, currentValue + e.changeX)
      }
      ovalOffset.value = currentValue
    })
    .onFinalize(() => {
      let currentValue = ovalOffset.value
      const halfLimit = maxKnobLimit / 2
      if (currentValue >= halfLimit) {
        currentValue = maxKnobLimit
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
    if (current !== previous && current === maxKnobLimit) {
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
      width: width,
      height: height,
      borderRadius: height / 2,
      borderColor: PRIMARY_COLOR,
      borderWidth: 2,
      justifyContent: 'center',
      padding: 4,
      backgroundColor: 'white',
      shadowColor: PRIMARY_COLOR,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 8
    }, sliderStyle]}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[{
          backgroundColor: PRIMARY_COLOR,
          width: width * KNOB_WIDTH_FACTOR,
          height: '100%',
          borderRadius: height / 2,
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