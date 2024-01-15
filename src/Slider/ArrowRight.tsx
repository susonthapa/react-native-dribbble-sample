import React, { FC, useEffect } from "react"
import Animated, { useSharedValue, withTiming } from "react-native-reanimated"
import Svg, { SvgProps, Path } from "react-native-svg"

const AnimatedPath = Animated.createAnimatedComponent(Path)

type Props = SvgProps & {
  animateToTick?: boolean
}

const ArrowRight: FC<Props> = ({ animateToTick, ...props }) => {
  const dashOffset = useSharedValue(-3)

  useEffect(() => {
    if (animateToTick === undefined) {
      return
    }
    if (animateToTick) {
      dashOffset.value = withTiming(-27, {
        duration: 500,
      })
    } else {
      dashOffset.value = withTiming(-3, {
        duration: 500
      })
    }
  }, [animateToTick])

  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="-7.1 -7.1 14.2 14.2" {...props}>
      <AnimatedPath
        fill="none"
        stroke="#CACAD1"
        strokeWidth={1.2}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeDasharray="11 30"
        strokeDashoffset={dashOffset}
        d="m0 6 6-6-6-6-6 6 3 3 6-6"
      />
    </Svg>
  )
}
export default ArrowRight
