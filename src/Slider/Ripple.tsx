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
      opacity: interpolate(radius.value, [10, 15], [1, 0], Extrapolation.CLAMP)
    }
  })

  useEffect(() => {
    if (enableAnimation) {
      radius.value = withTiming(15, {
        duration: 500,
        easing: Easing.inOut(Easing.quad)
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