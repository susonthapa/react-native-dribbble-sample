import React, { FC, useEffect } from "react"
import Animated, { useSharedValue, withTiming } from "react-native-reanimated"
import Svg, { SvgProps, Path } from "react-native-svg"

const AnimatedPath = Animated.createAnimatedComponent(Path)

type Props = SvgProps & {
  animateToTick?: boolean
}

const ArrowRight: FC<Props> = ({ animateToTick, ...props }) => {
  const dashOffset = useSharedValue(0)

  useEffect(() => {
    if (animateToTick === undefined) {
      return
    }
    if (animateToTick) {
      dashOffset.value = withTiming(-25, {
        duration: 500,
      })
    } else {
      dashOffset.value = withTiming(0, {
        duration: 500
      })
    }
  }, [animateToTick])

  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 12 12" {...props}>
      <AnimatedPath
        fill="none"
        stroke="white"
        strokeWidth={1}
        strokeDasharray="17 25"
        strokeDashoffset={dashOffset}
        d="m0 6 6-6-6-6-6 6 3 3 6-6"
      />
    </Svg>
  )
}
export default ArrowRight
