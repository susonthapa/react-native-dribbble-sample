import React, { FC, useEffect } from "react";
import Animated, { Easing, Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Circle, Svg, SvgProps } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const AnimatedSvg = Animated.createAnimatedComponent(Svg)

type Props = SvgProps & {
  enableAnimation: boolean
}

const Ripple: FC<Props> = ({ enableAnimation, ...props }) => {
  const radius = useSharedValue(0)
  const svgStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(radius.value, [14, 20], [1, 0], Extrapolation.CLAMP)
    }
  })

  useEffect(() => {
    if (enableAnimation) {
      radius.value = withTiming(20, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      })
    } else {
      radius.value = 0
    }

  }, [enableAnimation])
  return (
    <AnimatedSvg viewBox="0 0 20 20" {...props} style={[props.style, svgStyle]}>
      <AnimatedCircle
        cx={10}
        cy={10}
        r={radius}
        fill="#7A73B6"
      />
    </AnimatedSvg>
  )
}

export default Ripple