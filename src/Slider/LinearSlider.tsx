import React, { FC } from "react";
import { View } from "react-native";


const Oval = () => {
  return (
    <View style={{
      backgroundColor: '#333358',
      width: 75,
      height: '100%',
      borderRadius: 40
    }}
    >

    </View>
  )
}


const LinearSlider = () => {
  return (
    <View style={{
      width: 200,
      height: 70,
      borderRadius: 35,
      borderColor: '#333358',
      borderWidth: 2,
      justifyContent: 'center',
      padding: 4,
    }}>
      <Oval />
    </View>
  )
}

export default LinearSlider