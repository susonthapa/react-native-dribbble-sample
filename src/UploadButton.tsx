import { useRef, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { AnimatableValue, interpolate, runOnJS, useAnimatedStyle, Easing, useSharedValue, withRepeat, withTiming, withDecay, withDelay } from "react-native-reanimated"
import CloudUpload from './icons/CloudUpload'

const UploadButton = () => {
    const pressScale = useSharedValue(1)
    const pressTranslate = useSharedValue(0)
    const progressTranslate = useSharedValue(0)
    const buttonWidth = useRef<number>(0)
    const progressValue = useSharedValue(0)
    const opacityValue = useSharedValue(1)

    const activeRef = useRef<boolean>()
    const opacityRef = useRef<number>(0)
    const [progress, setProgress] = useState('')

    const resetAnim = (isFinished: boolean) => {
        if (isFinished && !activeRef.current) {
            setProgress('0%')
        }
    }

    const simulateProgress = () => {
        if (activeRef.current) {
            setTimeout(() => {
                for (let i = 0; i <= 100; i++) {
                    setTimeout(() => {
                        setProgress(i.toString() + '%')
                        if (i === 100) {
                            opacityValue.value = 0
                            setTimeout(() => {
                                setProgress('Completed!')
                                setTimeout(() => {
                                    toggleAnimation()
                                }, 1000)
                            }, 300)
                        }
                        progressValue.value = i
                    }, 20 * i)
                }
            }, 1000)
        }
    }

    const revertProgress = () => {
        progressValue.value = withDelay(200, withTiming(0, {
            duration: 400,
            easing: Easing.ease,
        }))
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(pressScale.value, {
                        duration: 400,
                        easing: Easing.ease,
                    })
                },

            ]
        }
    })

    const translateStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withTiming(pressTranslate.value, {
                        duration: 400,
                        easing: Easing.ease,
                    }, (isFinished?: boolean, current?: AnimatableValue) => {
                        runOnJS(resetAnim)(isFinished ?? true)
                    })
                }
            ]
        }
    }, [])
    const progressStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                translateX: withTiming(progressTranslate.value, {
                    duration: 400,
                    easing: Easing.ease,
                })
            }]
        }
    })

    const progressWidthStyle = useAnimatedStyle(() => {
        const width = interpolate(progressValue.value, [0, 100], [0, buttonWidth.current], 'clamp')
        return {
            width: width,
        }
    })

    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: withRepeat(withTiming(opacityValue.value, {
            }), 2, true, (isFinished?: boolean) => {
                if (isFinished) {
                    opacityValue.value = 1
                }
            })
        }
    })

    const widthStyle = buttonWidth.current !== 0 ? {
        width: buttonWidth.current
    } : {}

    const toggleAnimation = () => {
        const active = !activeRef.current
        activeRef.current = active
        pressScale.value = active ? 1.2 : 1
        pressTranslate.value = active ? buttonWidth.current : 0
        progressTranslate.value = active ? 0 : (-buttonWidth.current + 24)
        if (activeRef.current) {
            simulateProgress()
        } else {
            revertProgress()
        }
    }

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                opacityRef.current = 1
                if (!activeRef.current) {
                    toggleAnimation()
                }
            }}
            style={{
                // IOS shadow
                shadowColor: "#3AB549",
                shadowOffset: {
                    width: 0,
                    height: 8,
                },
                shadowOpacity: 0.7,
                shadowRadius: 8,
            }}
        >
            <Animated.View style={[{
                backgroundColor: '#3AB549',
                borderRadius: 24,
                height: 48,
                elevation: 16,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: 12,
                overflow: 'hidden',
            },
                animatedStyle,
                widthStyle,
            ]} onLayout={(e) => {
                if (buttonWidth.current === 0) {
                    buttonWidth.current = e.nativeEvent.layout.width
                    progressTranslate.value = -buttonWidth.current + 24
                }
            }}>
                <Animated.View style={[
                    {
                        position: 'absolute',
                        backgroundColor: '#2A9238',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    },
                    progressWidthStyle,
                ]} />

                <View style={{
                    marginHorizontal: 24,
                    overflow: 'hidden',
                }}>
                    <Animated.View style={[
                        {
                            width: buttonWidth.current - 48,
                            position: 'absolute',
                            bottom: 0,
                            top: 0,
                            left: 0,
                            right: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        progressStyle,
                    ]}>
                        <Animated.Text style={[
                            {
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 16,
                                textAlign: 'center',
                            },
                            opacityStyle,
                        ]}>{progress}</Animated.Text>
                    </Animated.View>
                    <Animated.View style={[
                        {
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        translateStyle,
                    ]} >
                        <CloudUpload />
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 16,
                            marginLeft: 12,
                        }}>Upload</Text>
                    </Animated.View>
                </View>

            </Animated.View>
        </TouchableOpacity>
    )
}

export default UploadButton