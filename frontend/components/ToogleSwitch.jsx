import { useState } from 'react'
import { View, Text } from 'react-native'
import SwitchToggle from "react-native-switch-toggle"

const ToogleSwitch = ({handleToggle,toogle}) => {
    
    return (
        
            <SwitchToggle
            switchOn={toogle}
            onPress={()=>{
                
                handleToggle()
            }}
            
            circleColorOff='#5B5B5B'
            circleColorOn='#ACD17D'
            backgroundColorOn='#4D4D4D'
            backgroundColorOff='#3A3A3A'
        />
       
    )
}

export default ToogleSwitch